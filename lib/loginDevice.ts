// Only the email preference belongs in localStorage. Passwords stay in the
// browser's credential manager, where saving and account selection need consent.
const EMAIL_KEY = "vistiq.login.remembered-email";

type SavedPassword = Credential & { password: string };
type PasswordConstructor = new (data: { id: string; password: string }) => SavedPassword;

function passwordConstructor() {
  return (window as Window & { PasswordCredential?: PasswordConstructor }).PasswordCredential;
}

export function rememberedEmail(): string {
  try { return localStorage.getItem(EMAIL_KEY) || ""; } catch { return ""; }
}

export function rememberEmail(email: string | null) {
  try {
    if (email) localStorage.setItem(EMAIL_KEY, email);
    else localStorage.removeItem(EMAIL_KEY);
  } catch { /* Private mode/storage restrictions must not block login. */ }
}

export async function savedLogin(email: string): Promise<{ email: string; password: string } | null> {
  if (!passwordConstructor() || !navigator.credentials) return null;
  try {
    const credential = await navigator.credentials.get({ password: true, mediation: "optional" } as CredentialRequestOptions) as SavedPassword | null;
    if (credential?.type !== "password" || typeof credential.password !== "string") return null;
    // Never silently switch to another account selected by the browser.
    if (email && credential.id.toLowerCase() !== email.toLowerCase()) return null;
    return { email: credential.id, password: credential.password };
  } catch { return null; }
}

export async function saveLogin(email: string, password: string) {
  const PasswordCredential = passwordConstructor();
  if (!PasswordCredential || !navigator.credentials || !password) return;
  try { await navigator.credentials.store(new PasswordCredential({ id: email, password })); }
  catch { /* Browser autofill remains available when this API is unsupported. */ }
}
