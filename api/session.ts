// src/auth/session.ts
import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "perfex_session_token";

export async function setSessionToken(token: string) {
  await SecureStore.setItemAsync(SESSION_KEY, token);
}

export async function getSessionToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SESSION_KEY);
}

export async function clearSessionToken() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}