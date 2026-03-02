import Constants from "expo-constants";
import { getAccessToken } from "./token";

type Extra = {
  API_BASE_URL: string;
};

function requireExtra(): Extra {
  const extra = Constants.expoConfig?.extra as Partial<Extra> | undefined;
  if (!extra?.API_BASE_URL) throw new Error("Missing expoConfig.extra.API_BASE_URL");
  return { API_BASE_URL: String(extra.API_BASE_URL) };
}

const { API_BASE_URL } = requireExtra();

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const token = await getAccessToken();

  const resp = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    },
    // harmless even if backend also sets a cookie; bearer is the primary auth mechanism
    credentials: "include"
  });

  const text = await resp.text().catch(() => "");
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!resp.ok) {
    const msg =
      typeof data === "object" && data && "error" in data && typeof (data as any).error === "string"
        ? (data as any).error
        : `HTTP ${resp.status}`;
    throw new Error(msg);
  }

  return data as T;
}