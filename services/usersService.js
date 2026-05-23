import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";
import { db } from "../firebase/config";

export async function createUserProfile(user) {
  return setDoc(
    doc(db, COLLECTIONS.USERS, user.uid),
    {
      email: user.email ?? "",
      displayName: user.email?.split("@")[0] ?? "Student",
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}
