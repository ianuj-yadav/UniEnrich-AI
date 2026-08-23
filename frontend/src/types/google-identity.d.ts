interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdentityApi {
  initialize: (configuration: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: { theme: "outline"; size: "large"; width: number; text: "continue_with" }
  ) => void;
  prompt?: () => void;
}

interface Window {
  google?: { accounts: { id: GoogleIdentityApi } };
}
