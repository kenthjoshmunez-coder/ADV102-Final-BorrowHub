import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import AuthHeader from "../components/AuthHeader";
import PasswordReminder from "../components/PasswordReminder";
import Screen from "../components/Screen";
import { signInUser } from "../services/authService";
import { getFriendlyError, isPasswordError } from "../utils/errors";
import { showMessage } from "../utils/feedback";
import { colors, spacing, typography } from "../constants/ui";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    text: "",
    wrongPassword: false,
  });

  const login = async () => {
    setStatus({ type: "", text: "", wrongPassword: false });

    if (!email.trim() || !password) {
      const msg = "Please enter your email and password.";
      setStatus({ type: "error", text: msg, wrongPassword: false });
      showMessage("Almost there", msg);
      return;
    }

    setLoading(true);
    setStatus({ type: "success", text: "Signing in..." });

    try {
      await signInUser(email, password);
      setStatus({ type: "success", text: "Success! Opening home..." });
      router.replace("/home");
    } catch (error) {
      const wrongPassword = isPasswordError(error?.code);
      const msg = getFriendlyError(error);
      setStatus({ type: "error", text: msg, wrongPassword });
      showMessage(
        wrongPassword ? "Incorrect password" : "Could not sign in",
        msg,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll center>
      <View style={styles.card}>
        <AuthHeader
          title="BorrowHub"
          subtitle="For students & communities — borrow books, gadgets, school supplies & tools."
        />

        <AppInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <AppInput
          label="Password"
          placeholder="Your password"
          value={password}
          secureTextEntry
          onChangeText={(text) => {
            setPassword(text);
            if (status.wrongPassword) {
              setStatus({ type: "", text: "", wrongPassword: false });
            }
          }}
        />

        {status.wrongPassword ? <PasswordReminder /> : null}

        {status.text ? (
          <Text
            style={[
              styles.status,
              status.type === "error" ? styles.error : styles.success,
            ]}
          >
            {status.text}
          </Text>
        ) : null}

        <AppButton
          title="Sign in"
          onPress={login}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?</Text>
          <AppButton
            title="Create an account"
            variant="ghost"
            onPress={() => router.push("/register")}
            disabled={loading}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  status: {
    fontSize: 14,
    marginBottom: spacing.sm,
    textAlign: "center",
    fontWeight: "500",
  },
  error: { color: colors.danger },
  success: { color: colors.available },
  footer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  footerText: {
    ...typography.caption,
  },
});
