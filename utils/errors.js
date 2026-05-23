export function isPasswordError(code) {
  return [
    "auth/invalid-credential",
    "auth/wrong-password",
    "auth/invalid-password",
  ].includes(code);
}

export function getFriendlyError(error) {
  const code = error?.code ?? "";

  const map = {
    "auth/invalid-credential":
      "Incorrect password or email. Please check both and try again.",
    "auth/wrong-password":
      "Incorrect password. Please re-enter your password carefully.",
    "auth/invalid-password": "Incorrect password. Please try again.",
    "auth/user-not-found":
      "No account found with this email. Tap Create an account first.",
    "auth/email-already-in-use": "This email is already registered. Try signing in.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
    "auth/network-request-failed":
      "Network error. Check your internet connection and try again.",
  };

  return map[code] ?? error?.message ?? "Something went wrong. Please try again.";
}
