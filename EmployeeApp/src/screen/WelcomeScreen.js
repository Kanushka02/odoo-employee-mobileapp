import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';

const DEFAULT_SERVER = 'http://10.165.68.93:8069';

export default function WelcomeScreen({ navigation }) {
  const [serverAddress, setServerAddress] = useState(DEFAULT_SERVER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedServer();
  }, []);

  const loadSavedServer = async () => {
    try {
      const saved = await AsyncStorage.getItem('odoo_server_url');
      if (saved) {
        setServerAddress(saved);
      }
    } catch (error) {
      console.log('Error loading saved server:', error);
    }
  };

  const validateAndConnect = async () => {
    if (!serverAddress.trim()) {
      Alert.alert('Missing server address', 'Please enter your Odoo server address.');
      return;
    }

    try {
      setLoading(true);

      const baseUrl = serverAddress.trim();
      // Construct full JSON-RPC endpoint
      let fullUrl = baseUrl;
      if (!baseUrl.endsWith('/jsonrpc')) {
        fullUrl = baseUrl.endsWith('/') ? baseUrl + 'jsonrpc' : baseUrl + '/jsonrpc';
      }

      // Save base server address to device storage (for display)
      await AsyncStorage.setItem('odoo_server_url', baseUrl);

      // Navigate to Login screen with full JSON-RPC endpoint
      navigation.replace('Login', { serverUrl: fullUrl });
    } catch (error) {
      Alert.alert('Error', 'Failed to save server address. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell
      eyebrow="Odoo Mobile"
      title="Odoo Connect"
      description="Connect to your Odoo server to access the employee directory and manage team information on the go."
    >
      <SectionCard
        className="bg-white/5"
        eyebrow="Server setup"
        title="Connect to Odoo"
        description="Enter your Odoo server address to get started. You only need to do this once."
      >
        <AppInput
          placeholder="Server address (e.g., https://odoo.example.com or http://10.0.0.1:8069)"
          value={serverAddress}
          onChangeText={setServerAddress}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <AppButton
          onPress={validateAndConnect}
          disabled={loading}
          className="mt-5"
        >
          {loading ? 'Connecting...' : 'Continue to Login'}
        </AppButton>
      </SectionCard>
    </ScreenShell>
  );
}
