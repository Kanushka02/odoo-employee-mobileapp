import React, { useState } from 'react';
import { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, setConnectionConfig } from '../services/odooApi';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';

export default function LoginScreen({ navigation, route }) {
  const scannedConfig = route?.params?.config || {};

  const [baseUrl, setBaseUrl] = useState(
    scannedConfig.baseUrl || 'http://10.32.100.93:8069/jsonrpc'
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
    <ScreenShell>
      <SectionCard
        className="mb-8 bg-slate-900/90"
        eyebrow="Odoo Mobile"
        title="Login to Odoo"
        description="Connect to your database and manage employees from a focused, mobile-first dashboard."
      />

      <SectionCard
        className="bg-white/5"
        title={null}
        description={null}
        eyebrow={null}
      >
        <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Connection details
        </Text>

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

        <AppButton onPress={onLogin} disabled={loading} className="mt-2">
          {loading ? 'Logging in...' : 'Login'}
        </AppButton>
      </SectionCard>
    </ScreenShell>
  );
}
