import * as SecureStore from "expo-secure-store";

const KEY = "auth:access_token";

export async function setAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEY, token, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK
  });
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY);
}

export async function clearAccessToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}