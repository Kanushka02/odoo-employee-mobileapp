import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
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
    <View className="flex-1 bg-slate-950 px-5 pt-4">
      <View className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-brand-500/20" />
      <View className="absolute top-40 -left-20 h-56 w-56 rounded-full bg-emerald-500/10" />

      <Modal
        transparent
        visible={logoutDialogVisible}
        animationType="fade"
        onRequestClose={() => setLogoutDialogVisible(false)}>
        <View className="flex-1 justify-center bg-black/50 px-6">
          <View className="rounded-[28px] border border-white/10 bg-slate-900 p-6">
            <Text className="mb-2 text-xl font-bold text-white">
              Confirm Logout
            </Text>
            <Text className="mb-5 text-sm leading-6 text-slate-300">
              Are you sure you want to logout?
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-2xl bg-slate-200 px-4 py-3"
                onPress={() => setLogoutDialogVisible(false)}>
                <Text className="text-center font-semibold text-slate-900">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-2xl bg-rose-600 px-4 py-3"
                onPress={confirmLogout}>
                <Text className="text-center font-semibold text-white">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="mb-5 rounded-[32px] border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-black/25">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
              Employee Hub
            </Text>

            <Text className="mt-2 text-4xl font-black text-white">
              Employees
            </Text>

            <Text className="mt-2 text-sm leading-6 text-slate-300">
              Employee Management System
            </Text>
          </View>

          <TouchableOpacity
            onPress={onLogout}
            activeOpacity={0.85}
            className="rounded-2xl bg-white/10 p-3">
            <Ionicons
              name="log-out-outline"
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        className="mb-4 flex-row items-center justify-center rounded-2xl bg-brand-500 px-4 py-4 shadow-lg shadow-brand-500/25"
        onPress={() => navigation.navigate('AddEmployee')}>
        <Ionicons
          name="add"
          size={20}
          color="white"
        />
        <Text className="ml-2 text-base font-semibold text-white">
          Add Employee
        </Text>
      </TouchableOpacity>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search employee by name"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        autoCorrect={false}
        className="mb-4 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white"
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-3 text-slate-300">
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
          className="flex-1"
          ListFooterComponent={<View className="h-24" />}
          ListEmptyComponent={
            <View className="mt-8 rounded-[28px] border border-dashed border-white/10 bg-white/5 px-6 py-10">
              <Text className="text-center text-base text-slate-300">
                {searchQuery ? 'No employees match your search.' : 'No employees found.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              className="mb-3 rounded-[28px] border border-white/10 bg-slate-900 p-5 shadow-xl shadow-black/15"
              onPress={() =>
                navigation.navigate('EditEmployee', {
                  employee: item,
                })
              }>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xl font-bold text-white">
                    {item.name}
                  </Text>

                  <Text className="mt-1 text-sm text-slate-400">
                    {item.job_title || 'No job title set'}
                  </Text>
                </View>

                <View className="rounded-full bg-brand-500/15 px-3 py-1">
                  <Text className="text-xs font-semibold text-brand-200">
                    Edit
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row items-center">
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#94a3b8"
                />

                <Text className="ml-3 text-sm text-slate-300">
                  {item.work_email || 'No email set'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
