import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      colors={['#0066cc', '#00b894']}
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
      }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: 'white' }}>Login to Odoo</Text>

      <TextInput
        placeholder="Odoo JSON-RPC URL"
        value={baseUrl}
        onChangeText={setBaseUrl}
        style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 15 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Database"
        value={db}
        onChangeText={setDb}
        style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 15 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 15 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 20 }}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={onLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#9ca3af' : '#111',
          padding: 15,
          borderRadius: 15,
          alignItems: 'center',
        }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
