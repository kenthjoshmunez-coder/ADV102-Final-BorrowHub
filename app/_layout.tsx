import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthRedirect from "../components/AuthRedirect";
import { AuthProvider } from "../contexts/AuthContext";
import { colors } from "../constants/ui";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <AuthRedirect />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="home" />
          <Stack.Screen name="add-item" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
