import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
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
} from 'react-native';

import {
  getEmployees,
  logout,
} from '../services/odooApi';
import ScreenShell from '../components/ScreenShell';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';

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

  const renderEmployeeAvatar = (employee) => {
    const avatarSource = employee.image_1920
      ? { uri: `data:image/png;base64,${employee.image_1920}` }
      : null;

    if (avatarSource) {
      return (
        <Image
          source={avatarSource}
          className="h-16 w-16 rounded-2xl bg-slate-800"
        />
      );
    }

    const initials = (employee.name || '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    return (
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15">
        <Text className="text-lg font-black text-brand-200">
          {initials || '?'}
        </Text>
      </View>
    );
  };

  return (
    <ScreenShell
      eyebrow="Employee Hub"
      title="Employees"
      description="Browse, search, and update employee records without leaving the mobile dashboard."
      scrollable={false}
      rightSlot={
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
      }>

      <Modal
        transparent
        visible={logoutDialogVisible}
        animationType="fade"
        onRequestClose={() => setLogoutDialogVisible(false)}>
        <View className="flex-1 justify-center bg-black/60 px-6">
          <View className="rounded-[30px] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/50">
            <Text className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
              Session action
            </Text>
            <Text className="mt-3 text-2xl font-black text-white">
              Confirm logout
            </Text>
            <Text className="mt-3 text-sm leading-6 text-slate-300">
              You will return to the login screen and need to sign in again to access employee data.
            </Text>

            <View className="mt-6 flex-row gap-3">
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

      <AppButton
        onPress={() => navigation.navigate('AddEmployee')}
        className="mb-4">
        Add Employee
      </AppButton>

      <AppInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search employee by name"
        autoCapitalize="none"
        autoCorrect={false}
        className="mb-4"
      />

      <View className="flex-1">
        {loading ? (
          <View className="flex-1 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 px-6">
            <ActivityIndicator size="large" color="#22d3ee" />
            <Text className="mt-4 text-base font-semibold text-white">
              Loading employees...
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-slate-300">
              Pulling the latest team records from Odoo.
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
                tintColor="#22d3ee"
              />
            }
            className="flex-1"
            ListFooterComponent={<View className="h-24" />}
            ListEmptyComponent={
              <View className="rounded-[28px] border border-dashed border-white/10 bg-white/5 px-6 py-10">
                <Text className="text-center text-base font-semibold text-white">
                  {searchQuery ? 'No employees match your search.' : 'No employees found.'}
                </Text>
                <Text className="mt-2 text-center text-sm leading-6 text-slate-300">
                  Try a different name or add the first employee from the button above.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                className="mb-3 rounded-[28px] border border-white/10 bg-slate-900 p-4 shadow-xl shadow-black/15"
                onPress={() =>
                  navigation.navigate('EditEmployee', {
                    employee: item,
                  })
                }>
                <View className="flex-row items-start">
                  {renderEmployeeAvatar(item)}

                  <View className="ml-4 flex-1 pr-2">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1">
                        <Text
                          className="text-lg font-bold text-white"
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item.name}
                        </Text>

                        <Text
                          className="mt-1 text-sm text-slate-400"
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item.job_title || 'No job title set'}
                        </Text>
                      </View>

                      <View className="rounded-full bg-brand-500/15 px-3 py-1">
                        <Text className="text-xs font-semibold text-brand-200">
                          Edit
                        </Text>
                      </View>
                    </View>

                    <View className="mt-4 flex-row items-start">
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color="#94a3b8"
                      />

                      <Text
                        className="ml-3 flex-1 text-sm leading-5 text-slate-300"
                        numberOfLines={3}
                        ellipsizeMode="tail">
                        {item.work_email || 'No email set'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenShell>
  );
}
