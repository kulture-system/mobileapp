import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Mobile App</Text>
      <Button title="Go to Sign In" onPress={() => router.push("/auth")} />
    </View>
  );
}