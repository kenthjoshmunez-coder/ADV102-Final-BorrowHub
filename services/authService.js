import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/config";

/** Wait until Firebase auth session is active (fixes home redirect race). */
export function waitForAuthUser(timeoutMs = 8000) {
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error("Sign-in is taking too long. Please try again."));
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        clearTimeout(timer);
        unsubscribe();
        resolve(user);
      }
    });
  });
}

export async function signInUser(email, password) {
  const result = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  await waitForAuthUser();
  return result.user;
}

export async function registerUser(email, password) {
  const result = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  await waitForAuthUser();
  return result.user;
}
