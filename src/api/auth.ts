import { apiFetch } from "./client";

export type Provider = "google" | "microsoft" | "apple";

export type User = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
};

export type MobileOAuthResponse = {
  ok: true;
  user: User;
  accessToken: string;
};

export async function mobileOAuth(provider: Provider, idToken: string): Promise<MobileOAuthResponse> {
  return apiFetch<MobileOAuthResponse>("/auth/oauth/mobile", {
    method: "POST",
    body: JSON.stringify({ provider, idToken })
  });
}

export async function getMe(): Promise<{ user: User }> {
  return apiFetch<{ user: User }>("/me", { method: "GET" });
}

export async function logout(): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>("/auth/logout", { method: "POST" });
}