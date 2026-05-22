import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from 'react-native';

import {
  lightTheme,
  darkTheme,
} from '../styles/theme';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  FlatList,
  Modal,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {
  getEmployees,
  logout,
} from '../services/odooApi';

export default function EmployeeListScreen({
  navigation,
}) {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      () => {
        loadEmployees();
      }
    );

    return unsubscribe;
  }, [navigation]);

  const loadEmployees = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      Alert.alert(
        'Load failed',
        'Could not load employees from Odoo. Check your connection details and try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onLogout = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = () => {
    setLogoutDialogVisible(false);
    logout();
    navigation.replace('Login');
  };

  const filteredEmployees = employees.filter((employee) =>
    (employee.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
      }}>
      <Modal
        transparent
        visible={logoutDialogVisible}
        animationType="fade"
        onRequestClose={() => setLogoutDialogVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.45)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
              Confirm Logout
            </Text>
            <Text style={{ color: '#4b5563', marginBottom: 20 }}>
              Are you sure you want to logout?
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: '#e5e7eb',
                }}
                onPress={() => setLogoutDialogVisible(false)}>
                <Text style={{ textAlign: 'center', fontWeight: '600', color: '#111827' }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: '#dc2626',
                }}
                onPress={confirmLogout}>
                <Text style={{ textAlign: 'center', fontWeight: '600', color: '#fff' }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LinearGradient
        colors={['#0066cc', '#00b894']}
        style={{
          padding: 20,
          borderRadius: 20,
          marginBottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                color: 'white',
              }}>
              Employees
            </Text>

            <Text style={{ color: 'white' }}>
              Employee Management System
            </Text>
          </View>

          <TouchableOpacity
            onPress={onLogout}>
            <Ionicons
              name="log-out-outline"
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <TouchableOpacity
        style={{
          backgroundColor: theme.secondary,
          padding: 14,
          borderRadius: 16,
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate('AddEmployee')}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Add Employee
        </Text>
      </TouchableOpacity>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search employee by name"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderWidth: 1,
          borderColor: '#d1d5db',
          backgroundColor: theme.card,
          color: theme.text,
          borderRadius: 15,
          paddingHorizontal: 14,
          paddingVertical: 12,
          marginBottom: 16,
        }}
      />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#6b7280' }}>
            Loading employees...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadEmployees(true)}
            />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 24 }}>
              {searchQuery ? 'No employees match your search.' : 'No employees found.'}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: theme.card,
                padding: 18,
                borderRadius: 20,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() =>
                navigation.navigate('EditEmployee', {
                  employee: item,
                })
              }>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700' }}>
                {item.name}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="gray"
                />

                <Text style={{ marginLeft: 8, color: theme.text }}>
                  {item.work_email}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color="gray"
                />

                <Text style={{ marginLeft: 8, color: theme.text }}>
                  {item.job_title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
