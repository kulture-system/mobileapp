import { View, Button, Text } from "react-native";
import { router } from "expo-router";

export default function HomeTab() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Home</Text>
      <Button title="Go To Sign In" onPress={() => router.push("/login")} />
    </View>
  );
}