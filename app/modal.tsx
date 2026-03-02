import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <Text style={styles.body}>
        This is a simple modal screen without any template alias imports.
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.85
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth
  },
  buttonPressed: {
    opacity: 0.7
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700"
  }
});