// src/api/http.ts
import Constants from "expo-constants";

function requireApiBaseUrl(): string {
  const base = (Constants.expoConfig?.extra as any)?.API_BASE_URL;
  if (!base) throw new Error("Missing expoConfig.extra.API_BASE_URL");
  return String(base).replace(/\/+$/, "");
}

const API_BASE_URL = requireApiBaseUrl();

export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json as T;
}