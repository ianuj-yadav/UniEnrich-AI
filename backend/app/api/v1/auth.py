import base64
import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from app.core.config import settings
from app.db.models import AuthSession, User
from app.db.session import get_db

router = APIRouter(prefix="/auth")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = True

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    organization: Optional[str] = "Araxyss Industrial AI"

class GoogleAuthRequest(BaseModel):
    credential: str

class AuthResponse(BaseModel):
    success: bool
    token: str
    user: dict

SESSION_LIFETIME = timedelta(days=7)
PBKDF2_ITERATIONS = 310_000


def _utcnow() -> datetime:
    """Return UTC time in the naive format used by the existing SQLite schema."""
    return datetime.now(UTC).replace(tzinfo=None)


def _hash_password(password: str, salt: Optional[bytes] = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return "pbkdf2_sha256${}${}${}".format(
        PBKDF2_ITERATIONS,
        base64.b64encode(salt).decode("ascii"),
        base64.b64encode(digest).decode("ascii"),
    )


def _verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt_b64, _ = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = _hash_password(password, base64.b64decode(salt_b64))
        return hmac.compare_digest(candidate, encoded)
    except (ValueError, TypeError):
        return False


def _serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "organization": user.organization,
        "tier": user.tier,
        "avatar": user.avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={user.name}",
        "provider": user.provider,
    }


async def _create_session(db: AsyncSession, user: User) -> str:
    token = secrets.token_urlsafe(32)
    db.add(AuthSession(
        user_id=user.id,
        token_digest=hashlib.sha256(token.encode("utf-8")).hexdigest(),
        expires_at=_utcnow() + SESSION_LIFETIME,
    ))
    await db.commit()
    return token


async def ensure_demo_account(db: AsyncSession) -> None:
    """Create the documented local demo account once, without weakening login rules."""
    email = "anuj.yadav@unienrich.ai"
    existing = (await db.execute(select(User.id).where(User.email == email))).scalar_one_or_none()
    if existing:
        return
    db.add(User(
        id="usr_anuj_01", name="Anuj Yadav", email=email,
        password_hash=_hash_password("Password123!"),
        role="Lead Catalog Reviewer", organization="Araxyss / UniEnrich Industrial AI",
        tier="Enterprise Vault", avatar="https://api.dicebear.com/7.x/bottts/svg?seed=Anuj",
        provider="email",
    ))
    await db.commit()

@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    email_lower = req.email.lower()
    user = (await db.execute(select(User).where(User.email == email_lower))).scalar_one_or_none()
    if not user or user.provider != "email" or not _verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = await _create_session(db, user)
    return AuthResponse(success=True, token=token, user=_serialize_user(user))

@router.post("/signup", response_model=AuthResponse)
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_db)):
    email_lower = req.email.lower()
    existing = (await db.execute(select(User.id).where(User.email == email_lower))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    new_user = User(
        name=req.name.strip(), email=email_lower, password_hash=_hash_password(req.password),
        organization=req.organization or "Araxyss Industrial AI",
        avatar=f"https://api.dicebear.com/7.x/bottts/svg?seed={req.name}", provider="email",
    )
    db.add(new_user)
    await db.flush()
    token = await _create_session(db, new_user)
    return AuthResponse(success=True, token=token, user=_serialize_user(new_user))

@router.post("/google", response_model=AuthResponse)
async def google_auth(req: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in is not configured on the server.")
    try:
        identity = id_token.verify_oauth2_token(
            req.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError as error:
        raise HTTPException(status_code=401, detail="Google could not verify this sign-in token.") from error

    email = identity.get("email", "").lower()
    if not email or not identity.get("email_verified"):
        raise HTTPException(status_code=401, detail="Google did not return a verified email address.")

    user = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
    if not user:
        name = identity.get("name") or email.split("@")[0].replace(".", " ").title()
        user = User(
            name=name,
            email=email,
            password_hash="",
            role="Catalog Reviewer",
            organization="Araxyss Industrial AI",
            tier="Enterprise Vault",
            avatar=identity.get("picture"),
            provider="google",
        )
        db.add(user)
        await db.flush()
    else:
        user.name = identity.get("name") or user.name
        user.avatar = identity.get("picture") or user.avatar
        user.provider = "google"

    token = await _create_session(db, user)
    return AuthResponse(success=True, token=token, user=_serialize_user(user))

@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None), db: AsyncSession = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="A valid bearer token is required.")
    digest = hashlib.sha256(authorization.removeprefix("Bearer ").encode("utf-8")).hexdigest()
    result = await db.execute(
        select(AuthSession, User)
        .join(User, AuthSession.user_id == User.id)
        .where(AuthSession.token_digest == digest, AuthSession.expires_at > _utcnow())
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=401, detail="Your session has expired. Please sign in again.")
    return _serialize_user(row[1])


@router.post("/logout", status_code=204)
async def logout(authorization: Optional[str] = Header(None), db: AsyncSession = Depends(get_db)):
    if authorization and authorization.startswith("Bearer "):
        digest = hashlib.sha256(authorization.removeprefix("Bearer ").encode("utf-8")).hexdigest()
        session = (await db.execute(select(AuthSession).where(AuthSession.token_digest == digest))).scalar_one_or_none()
        if session:
            await db.delete(session)
            await db.commit()
