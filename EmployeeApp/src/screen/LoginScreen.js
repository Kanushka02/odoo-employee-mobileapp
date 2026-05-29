import React, { useState } from 'react';
import { useEffect } from 'react';
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, setConnectionConfig, getDatabases } from '../services/odooApi';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';

export default function LoginScreen({ navigation, route }) {
  const serverUrl = route?.params?.serverUrl || '';

  const [databases, setDatabases] = useState([]);
  const [db, setDb] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDatabases, setFetchingDatabases] = useState(true);
  const [databaseModalVisible, setDatabaseModalVisible] = useState(false);
  const [databaseListAvailable, setDatabaseListAvailable] = useState(true);
  
  useEffect(() => {
    loadDatabasesAndConfig();
  }, [serverUrl]);

  const loadDatabasesAndConfig = async () => {
    let savedConfig = null;

    try {
      setFetchingDatabases(true);

      const savedServerUrl = await AsyncStorage.getItem('odoo_server_url');
      const resolvedServerUrl = serverUrl || (savedServerUrl
        ? (savedServerUrl.endsWith('/jsonrpc')
          ? savedServerUrl
          : (savedServerUrl.endsWith('/') ? `${savedServerUrl}jsonrpc` : `${savedServerUrl}/jsonrpc`))
        : '');

      if (!resolvedServerUrl) {
        Alert.alert('Error', 'Server URL not provided. Please go back and enter a valid server address.');
        return;
      }

      const saved = await AsyncStorage.getItem('odoo_config');
      if (saved) {
        savedConfig = JSON.parse(saved);
        setUsername(savedConfig.username || '');
      }

      // Fetch available databases from server
      const dbList = await getDatabases(resolvedServerUrl);
      const formattedDbs = (dbList || []).map((dbName) => ({
        label: dbName,
        value: dbName,
      }));
      setDatabases(formattedDbs);
      setDatabaseListAvailable(formattedDbs.length > 0);

      if (savedConfig?.db && (formattedDbs.length === 0 || formattedDbs.some((item) => item.value === savedConfig.db))) {
        setDb(savedConfig.db);
      }
    } catch (error) {
      // Odoo server might not support listing databases
      setDatabases([]);
      setDatabaseListAvailable(false);
      if (savedConfig?.db) {
        setDb(savedConfig.db);
      }
      console.log('Database fetch error:', error);
    } finally {
      setFetchingDatabases(false);
    }
  };

  const onLogin = async () => {
    if (!db || !username || !password) {
      Alert.alert('Missing details', 'Please select a database and enter your credentials.');
      return;
    }

    try {
      setLoading(true);
      const savedServerUrl = await AsyncStorage.getItem('odoo_server_url');
      const resolvedServerUrl = serverUrl || (savedServerUrl
        ? (savedServerUrl.endsWith('/jsonrpc')
          ? savedServerUrl
          : (savedServerUrl.endsWith('/') ? `${savedServerUrl}jsonrpc` : `${savedServerUrl}/jsonrpc`))
        : '');

      setConnectionConfig({ baseUrl: resolvedServerUrl, db, username, password });
      await login({ baseUrl: resolvedServerUrl, db, username, password });
      await AsyncStorage.setItem(
        'odoo_config',
        JSON.stringify({
          baseUrl: resolvedServerUrl,
          db,
          username,
        })
      );
      navigation.replace('Employees');
    } catch (error) {
      Alert.alert('Login failed', 'Invalid username or password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const onChangeServer = async () => {
    // Clear the server URL and go back to Welcome
    await AsyncStorage.removeItem('odoo_server_url');
    navigation.replace('Welcome');
  };

  return (
    <ScreenShell
      eyebrow="Odoo Mobile"
      title="Sign in"
      description="Select your database and enter your login credentials to access the employee directory."
    >
      <SectionCard
        className="bg-white/5 overflow-visible"
        eyebrow="Authentication"
        title="Login"
        description="Enter your Odoo credentials to continue."
      >
        {fetchingDatabases ? (
          <View className="items-center justify-center py-6">
            <Text className="text-center text-sm text-slate-400">
              Loading databases...
            </Text>
          </View>
        ) : (
          <>
            <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
              {databaseListAvailable ? 'Select database' : 'Enter database name'}
            </Text>

            {databaseListAvailable ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setDatabaseModalVisible(true)}
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-4"
                  style={{ minHeight: 56 }}>
                  <Text
                    className={db ? 'text-base text-white' : 'text-base text-slate-400'}
                    numberOfLines={1}
                  >
                    {db || 'Choose database'}
                  </Text>
                </TouchableOpacity>

                <Modal
                  visible={databaseModalVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setDatabaseModalVisible(false)}>
                  <View className="flex-1 justify-center bg-black/70 px-5">
                    <View className="max-h-[75%] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 p-5">
                      <Text className="text-lg font-bold text-white">
                        Choose database
                      </Text>
                      <Text className="mt-2 text-sm leading-6 text-slate-300">
                        Select the Odoo database that belongs to your server.
                      </Text>

                      <FlatList
                        data={databases}
                        keyExtractor={(item) => item.value}
                        style={{ marginTop: 16 }}
                        contentContainerStyle={{ paddingBottom: 8 }}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => {
                          const isSelected = item.value === db;

                          return (
                            <TouchableOpacity
                              activeOpacity={0.85}
                              onPress={() => {
                                setDb(item.value);
                                setDatabaseModalVisible(false);
                              }}
                              className={`mb-3 rounded-2xl border px-4 py-4 ${isSelected ? 'border-brand-400 bg-brand-500/15' : 'border-white/10 bg-slate-900'}`}>
                              <Text
                                className={`text-base font-semibold ${isSelected ? 'text-brand-200' : 'text-white'}`}>
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                        ListEmptyComponent={
                          <View className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6">
                            <Text className="text-center text-sm text-slate-300">
                              No databases found for this server.
                            </Text>
                          </View>
                        }
                      />

                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setDatabaseModalVisible(false)}
                        className="mt-2 rounded-2xl bg-slate-800 px-4 py-4">
                        <Text className="text-center font-semibold text-white">
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </>
            ) : (
              <AppInput
                placeholder="e.g., odoo18, test_db"
                value={db}
                onChangeText={setDb}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          </>
        )}

        <AppInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          className="mt-4"
          editable={!fetchingDatabases}
        />
        <AppInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mt-4"
          editable={!fetchingDatabases}
        />

        <AppButton
          onPress={onLogin}
          disabled={loading || fetchingDatabases}
          className="mt-5"
        >
          {loading ? 'Signing in...' : 'Login'}
        </AppButton>

        <AppButton
          onPress={onChangeServer}
          disabled={loading || fetchingDatabases}
          variant="secondary"
          className="mt-3"
        >
          Change Server
        </AppButton>
      </SectionCard>
    </ScreenShell>
  );
}
