import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const googleLogin = async () => {
  await GoogleSignin.hasPlayServices();

  await GoogleSignin.signIn();

  const { idToken } = await GoogleSignin.getTokens();

  if (!idToken) {
    throw new Error('No ID token returned from Google');
  }

  const response = await fetch(
    'https://pristinehealthstaffing.com/sv/perfex_crm/auth/google',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) {
    throw new Error('Backend authentication failed');
  }

  return await response.json();
};
