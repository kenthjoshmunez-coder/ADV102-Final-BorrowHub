import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import AuthHeader from "../components/AuthHeader";
import Screen from "../components/Screen";
import { registerUser } from "../services/authService";
import { createUserProfile } from "../services/usersService";
import { getFriendlyError } from "../utils/errors";
import { showMessage } from "../utils/feedback";
import { colors, spacing, typography } from "../constants/ui";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const register = async () => {
    setStatus({ type: "", text: "" });

    if (!email.trim() || !password) {
      const msg = "Please enter your email and password.";
      setStatus({ type: "error", text: msg });
      showMessage("Almost there", msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setStatus({ type: "error", text: msg });
      showMessage("Password too short", msg);
      return;
    }

    setLoading(true);
    setStatus({ type: "success", text: "Creating your account..." });

    try {
      const user = await registerUser(email, password);

      try {
        await createUserProfile(user);
      } catch {
        // Profile optional — auth already succeeded
      }

      setStatus({ type: "success", text: "Success! Opening home..." });
      router.replace("/home");
    } catch (error) {
      const msg = getFriendlyError(error);
      setStatus({ type: "error", text: msg });
      showMessage("Could not sign up", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll center>
      <View style={styles.card}>
        <AuthHeader
          title="Join BorrowHub"
          subtitle="Create your account and start sharing items with your community."
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
          placeholder="At least 6 characters"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

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
          title="Create account"
          onPress={register}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <AppButton
            title="Back to sign in"
            variant="ghost"
            onPress={() => router.push("/")}
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
