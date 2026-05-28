import React, { useState } from 'react';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, setConnectionConfig } from '../services/odooApi';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';

export default function LoginScreen({ navigation, route }) {
  const scannedConfig = route?.params?.config || {};

  const [baseUrl, setBaseUrl] = useState(
    scannedConfig.baseUrl || 'http://192.168.8.141:8069/jsonrpc'
  );
  const [db, setDb] = useState(scannedConfig.db || '');
  const [username, setUsername] = useState(scannedConfig.username || '');
  const [password, setPassword] = useState(scannedConfig.password || '');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadSavedConfig();
  }, []);

  const loadSavedConfig = async () => {
    const saved = await AsyncStorage.getItem(
      'odoo_config'
    );

    if (saved) {
      const config = JSON.parse(saved);

      setBaseUrl(config.baseUrl || '');
      setDb(config.db || '');
      setUsername(config.username || '');
    }
  };
  const onLogin = async () => {
    if (!baseUrl || !db || !username || !password) {
      Alert.alert('Missing details', 'Please fill all fields before login.');
      return;
    }

    try {
      setLoading(true);
      setConnectionConfig({ baseUrl, db, username, password });
      await login({ baseUrl, db, username, password });
      await AsyncStorage.setItem(
          'odoo_config',
          JSON.stringify({
            baseUrl,
            db,
            username,
          })
        );
      navigation.replace('Employees');
    } catch (error) {
      Alert.alert('Login failed', 'Could not login to Odoo. Check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell
      eyebrow="Odoo Mobile"
      title="Welcome back"
      description="Connect to your Odoo database and manage the employee directory from one clean, mobile-first workspace."
    >
      <SectionCard
        className="bg-white/5"
        eyebrow="Connection details"
        title="Sign in"
        description="Enter your Odoo JSON-RPC endpoint and user credentials to start managing employees."
      >
        <AppInput
          placeholder="Odoo JSON-RPC URL"
          value={baseUrl}
          onChangeText={setBaseUrl}
          autoCapitalize="none"
        />
        <AppInput
          placeholder="Database"
          value={db}
          onChangeText={setDb}
          autoCapitalize="none"
          className="mt-4"
        />
        <AppInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          className="mt-4"
        />
        <AppInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mt-4"
        />

        <AppButton onPress={onLogin} disabled={loading} className="mt-5">
          {loading ? 'Logging in...' : 'Login'}
        </AppButton>
      </SectionCard>
    </ScreenShell>
  );
}
