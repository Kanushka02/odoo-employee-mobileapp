import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login, setConnectionConfig } from '../services/odooApi';

export default function LoginScreen({ navigation, route }) {
  const scannedConfig = route?.params?.config || {};

  const [baseUrl, setBaseUrl] = useState(
    scannedConfig.baseUrl || 'http://10.32.100.93:8069/jsonrpc'
  );
  const [db, setDb] = useState(scannedConfig.db || '');
  const [username, setUsername] = useState(scannedConfig.username || '');
  const [password, setPassword] = useState(scannedConfig.password || '');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!baseUrl || !db || !username || !password) {
      Alert.alert('Missing details', 'Please fill all fields before login.');
      return;
    }

    try {
      setLoading(true);
      setConnectionConfig({ baseUrl, db, username, password });
      await login({ baseUrl, db, username, password });
      navigation.replace('Employees');
    } catch (error) {
      Alert.alert('Login failed', 'Could not login to Odoo. Check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Login to Odoo</Text>

      <TextInput
        placeholder="Odoo JSON-RPC URL"
        value={baseUrl}
        onChangeText={setBaseUrl}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Database"
        value={db}
        onChangeText={setDb}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 }}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={onLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#9ca3af' : '#2563eb',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
