import React from 'react';
import { View, Button } from 'react-native';
import { googleLogin } from '../services/authService';

const LoginScreen = () => {
  const handleLogin = async () => {
    try {
      const data = await googleLogin();
      console.log('Login success:', data);
    } catch (err) {
      console.log('Login error:', err);
    }
  };

  return (
    <View>
      <Button title="Sign in with Google" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
