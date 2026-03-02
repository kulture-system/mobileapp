import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '611474666857-atmbcla7ql8oocvjbl50bgs643o9ldgj.apps.googleusercontent.com',
    offlineAccess: true,
  });
};
