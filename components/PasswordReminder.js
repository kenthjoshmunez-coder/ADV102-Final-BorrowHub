import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/ui";

export default function PasswordReminder() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Password reminder</Text>
      <Text style={styles.text}>
        The password you entered is incorrect. Check caps lock, spelling, and
        make sure you are using the right account.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFCC80",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: "700",
    color: "#E65100",
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  text: {
    color: "#BF360C",
    fontSize: 13,
    lineHeight: 20,
  },
});
