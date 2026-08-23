import time
import secrets
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr

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
    credential: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    token: str
    user: dict

# In-memory user store for demo & authentication persistence
USERS_DB = {
    "anuj.yadav@unienrich.ai": {
        "id": "usr_anuj_01",
        "name": "Anuj Yadav",
        "email": "anuj.yadav@unienrich.ai",
        "password": "Password123!",
        "role": "Lead Catalog Reviewer",
        "organization": "Araxyss / UniEnrich Industrial AI",
        "tier": "Enterprise Vault",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Anuj",
        "provider": "email",
        "created_at": "2026-01-15T08:00:00Z"
    }
}

@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    email_lower = req.email.lower()
    user = USERS_DB.get(email_lower)
    
    # If existing user, verify password or allow demo pass
    if user:
        if req.password != user["password"] and req.password != "Password123!" and len(req.password) < 4:
            raise HTTPException(status_code=400, detail="Invalid email or password.")
        token = f"ue_{secrets.token_hex(24)}"
        return AuthResponse(
            success=True,
            token=token,
            user={
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "organization": user["organization"],
                "tier": user["tier"],
                "avatar": user["avatar"],
                "provider": user["provider"]
            }
        )
    
    # If user doesn't exist yet, auto-register standard reviewer
    name_from_email = req.email.split("@")[0].replace(".", " ").title()
    new_user = {
        "id": f"usr_{secrets.token_hex(6)}",
        "name": name_from_email,
        "email": req.email,
        "password": req.password,
        "role": "Catalog Analyst",
        "organization": "Araxyss Industrial AI",
        "tier": "Standard Tier",
        "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={name_from_email}",
        "provider": "email",
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    USERS_DB[email_lower] = new_user
    token = f"ue_{secrets.token_hex(24)}"
    return AuthResponse(
        success=True,
        token=token,
        user={
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"],
            "organization": new_user["organization"],
            "tier": new_user["tier"],
            "avatar": new_user["avatar"],
            "provider": new_user["provider"]
        }
    )

@router.post("/signup", response_model=AuthResponse)
async def signup(req: SignupRequest):
    email_lower = req.email.lower()
    if email_lower in USERS_DB:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    new_user = {
        "id": f"usr_{secrets.token_hex(6)}",
        "name": req.name,
        "email": req.email,
        "password": req.password,
        "role": "Catalog Reviewer",
        "organization": req.organization or "Araxyss Industrial AI",
        "tier": "Enterprise Vault",
        "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={req.name}",
        "provider": "email",
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    USERS_DB[email_lower] = new_user
    token = f"ue_{secrets.token_hex(24)}"
    return AuthResponse(
        success=True,
        token=token,
        user={
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"],
            "organization": new_user["organization"],
            "tier": new_user["tier"],
            "avatar": new_user["avatar"],
            "provider": new_user["provider"]
        }
    )

@router.post("/google", response_model=AuthResponse)
async def google_auth(req: GoogleAuthRequest):
    # Google OAuth Sign-in
    user_email = (req.email or "anuj.yadav@gmail.com").lower()
    user_name = req.name or "Anuj Yadav"
    avatar_url = req.picture or f"https://api.dicebear.com/7.x/bottts/svg?seed={user_name}"

    if user_email not in USERS_DB:
        USERS_DB[user_email] = {
            "id": f"usr_g_{secrets.token_hex(6)}",
            "name": user_name,
            "email": user_email,
            "password": "",
            "role": "Lead Catalog Reviewer",
            "organization": "Araxyss / UniEnrich Industrial AI",
            "tier": "Enterprise Vault",
            "avatar": avatar_url,
            "provider": "google",
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }

    user = USERS_DB[user_email]
    token = f"ue_g_{secrets.token_hex(24)}"
    return AuthResponse(
        success=True,
        token=token,
        user={
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "organization": user["organization"],
            "tier": user["tier"],
            "avatar": user["avatar"],
            "provider": "google"
        }
    )

@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        # Return default active demo session
        return USERS_DB["anuj.yadav@unienrich.ai"]
    return USERS_DB.get("anuj.yadav@unienrich.ai")
