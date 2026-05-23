import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../constants/ui";

export default function AuthHeader({ title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>BH</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  title: {
    ...typography.hero,
    textAlign: "center",
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: "center",
    marginTop: spacing.xs,
    maxWidth: 280,
  },
});
