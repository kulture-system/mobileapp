// src/auth/oauth.ts

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import Constants from "expo-constants";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type Extra = {
  GOOGLE_CLIENT_ID: string;
  MICROSOFT_CLIENT_ID: string;
  MICROSOFT_TENANT: string;
};

function requireExtra(): Extra {
  const extra = (Constants.expoConfig?.extra ?? {}) as Partial<Extra>;

  const GOOGLE_CLIENT_ID = extra?.GOOGLE_CLIENT_ID ? String(extra.GOOGLE_CLIENT_ID) : "";
  const MICROSOFT_CLIENT_ID = extra?.MICROSOFT_CLIENT_ID ? String(extra.MICROSOFT_CLIENT_ID) : "";
  const MICROSOFT_TENANT = extra?.MICROSOFT_TENANT ? String(extra.MICROSOFT_TENANT) : "common";

  if (!GOOGLE_CLIENT_ID) throw new Error("Missing expoConfig.extra.GOOGLE_CLIENT_ID");
  if (!MICROSOFT_CLIENT_ID) throw new Error("Missing expoConfig.extra.MICROSOFT_CLIENT_ID");

  return { GOOGLE_CLIENT_ID, MICROSOFT_CLIENT_ID, MICROSOFT_TENANT };
}

const { GOOGLE_CLIENT_ID, MICROSOFT_CLIENT_ID, MICROSOFT_TENANT } = requireExtra();

function asOptionalString(v: string | string[] | undefined): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

function requireParam(params: Record<string, string | string[] | undefined>, key: string): string {
  const v = asOptionalString(params[key]);
  if (!v) throw new Error(`missing_${key}`);
  return v;
}

function requireIdToken(tokenResponse: AuthSession.TokenResponse): string {
  const anyResp = tokenResponse as unknown as { params?: Record<string, unknown> };
  const idToken = anyResp?.params?.id_token;
  if (typeof idToken !== "string" || !idToken.length) throw new Error("missing_id_token");
  return idToken;
}

function redirectUri(): string {
  // Web should not require scheme; use origin-based redirect and a stable path.
  if (Platform.OS === "web") {
    return AuthSession.makeRedirectUri({
      preferLocalhost: true,
      path: "auth",
    });
  }

  const scheme = Constants.expoConfig?.scheme;
  if (!scheme || !scheme.length) throw new Error("Missing expoConfig.scheme");

  return AuthSession.makeRedirectUri({ scheme, path: "auth" });
}

export async function signInWithGoogle(): Promise<string> {
  const discovery = await AuthSession.fetchDiscoveryAsync("https://accounts.google.com");
  const ru = redirectUri();

  const request = new AuthSession.AuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    responseType: AuthSession.ResponseType.Code,
    redirectUri: ru,
    scopes: ["openid", "email", "profile"],
    usePKCE: true,
  });

  const result = await request.promptAsync(discovery);
  if (result.type !== "success") throw new Error("auth_cancelled_or_failed");

  const params = result.params as Record<string, string | string[] | undefined>;
  const code = requireParam(params, "code");

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: GOOGLE_CLIENT_ID,
      code,
      redirectUri: ru,
      extraParams: { code_verifier: request.codeVerifier ?? "" },
    },
    discovery
  );

  return requireIdToken(tokenResponse);
}

export async function signInWithMicrosoft(): Promise<string> {
  const authority = `https://login.microsoftonline.com/${MICROSOFT_TENANT}/v2.0`;
  const discovery = await AuthSession.fetchDiscoveryAsync(authority);
  const ru = redirectUri();

  const request = new AuthSession.AuthRequest({
    clientId: MICROSOFT_CLIENT_ID,
    responseType: AuthSession.ResponseType.Code,
    redirectUri: ru,
    scopes: ["openid", "email", "profile", "offline_access"],
    usePKCE: true,
    extraParams: { prompt: "select_account" },
  });

  const result = await request.promptAsync(discovery);
  if (result.type !== "success") throw new Error("auth_cancelled_or_failed");

  const params = result.params as Record<string, string | string[] | undefined>;
  const code = requireParam(params, "code");

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: MICROSOFT_CLIENT_ID,
      code,
      redirectUri: ru,
      extraParams: { code_verifier: request.codeVerifier ?? "" },
    },
    discovery
  );

  return requireIdToken(tokenResponse);
}

export async function signInWithApple(): Promise<string> {
  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) throw new Error("apple_sign_in_not_available");

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
  });

  const idToken = credential.identityToken;
  if (!idToken) throw new Error("missing_id_token");
  return idToken;
}