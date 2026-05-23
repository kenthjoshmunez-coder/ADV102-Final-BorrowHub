import { useEffect } from "react";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useAuthContext } from "../contexts/AuthContext";
import { auth } from "../firebase/config";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, ready } = useAuthContext();

  useEffect(() => {
    if (!requireAuth || !ready) return;

    const hasSession = Boolean(user ?? auth.currentUser);
    if (!hasSession) {
      router.replace("/");
    }
  }, [requireAuth, ready, user, router]);

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  const sessionUser = user ?? auth.currentUser;

  return {
    user: sessionUser,
    loading: !ready,
    logout,
  };
}
