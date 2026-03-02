import Constants from "expo-constants";

function getApiBaseUrl(): string {
  const base = (Constants.expoConfig?.extra as any)?.API_BASE_URL;
  if (!base) {
    throw new Error("Missing expoConfig.extra.API_BASE_URL");
  }
  return String(base).replace(/\/+$/, "");
}

const API_BASE_URL = getApiBaseUrl();

export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let json: any = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    const message =
      json?.message || json?.error || text || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return json as T;
}