import { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { apiPost } from "../src/api/http";
import { setSessionToken } from "../src/auth/session";
import { signInWithGoogle } from "../src/auth/oauth";

type LoginResponse = {
  ok: true;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    provider: "password" | "google" | "microsoft" | "apple";
    role?: string;
  };
  accessToken: string;
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleEmailLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Missing information", "Enter your email and password.");
      return;
    }

    try {
      setBusy(true);

      const result = await apiPost<LoginResponse>("/auth/login", {
        email: email.trim(),
        password,
      });

      await setSessionToken(result.accessToken);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Login failed", error?.message ?? String(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setBusy(true);

      const idToken = await signInWithGoogle();

      const result = await apiPost<LoginResponse>("/auth/oauth/mobile", {
        provider: "google",
        idToken,
      });

      await setSessionToken(result.accessToken);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Google sign-in failed", error?.message ?? String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        editable={!busy}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        editable={!busy}
      />

      <View style={styles.spacer} />
      <Button
        title={busy ? "Signing in..." : "Sign in with Email"}
        onPress={handleEmailLogin}
        disabled={busy}
      />

      <View style={styles.spacer} />
      <Button
        title="Continue with Google"
        onPress={handleGoogleLogin}
        disabled={busy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  spacer: {
    height: 12,
  },
});