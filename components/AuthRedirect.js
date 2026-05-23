import { useEffect } from "react";
import { usePathname, useRouter } from "expo-router";
import { useAuthContext } from "../contexts/AuthContext";
import { auth } from "../firebase/config";

function isAuthScreen(pathname) {
  const path = (pathname ?? "/").replace(/\/$/, "") || "/";
  return path === "/" || path === "/register" || path.endsWith("/register");
}

/** Sends signed-in users away from login/register to home. */
export default function AuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready } = useAuthContext();

  useEffect(() => {
    if (!ready) return;

    const sessionUser = user ?? auth.currentUser;
    if (sessionUser && isAuthScreen(pathname)) {
      router.replace("/home");
    }
  }, [ready, user, pathname, router]);

  return null;
}
