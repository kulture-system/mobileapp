import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="auth/index" options={{ title: "Sign in" }} />
    </Stack>
  );
}