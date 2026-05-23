import { Alert, Platform } from "react-native";

/** Works on web and mobile — RN Alert is unreliable on some web builds. */
export function showMessage(title, message) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}
