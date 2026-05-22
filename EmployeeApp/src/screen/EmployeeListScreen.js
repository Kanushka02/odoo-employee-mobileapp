import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  FlatList,
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
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const filteredEmployees = employees.filter((employee) =>
    (employee.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#16a34a',
            padding: 14,
            borderRadius: 10,
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

        <TouchableOpacity
          style={{
            backgroundColor: '#dc2626',
            padding: 14,
            borderRadius: 10,
            justifyContent: 'center',
          }}
          onPress={onLogout}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search employee by name"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderRadius: 10,
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
                backgroundColor: '#f2f2f2',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
              }}
              onPress={() =>
                navigation.navigate('EditEmployee', {
                  employee: item,
                })
              }>
              <Text>Name: {item.name}</Text>

              <Text>Email: {item.work_email}</Text>

              <Text>Job: {item.job_title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
