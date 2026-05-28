import React, { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';
import {
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from '../services/odooApi';
import { Dropdown } from 'react-native-element-dropdown';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';

export default function EditEmployeeScreen({
  route,
  navigation,
}) {
  const employee = route?.params?.employee;

  const [name, setName] = useState(employee?.name || '');
  const [email, setEmail] = useState(
    employee?.work_email || ''
  );
  const [job, setJob] = useState(
    employee?.job_title || ''
  );
  const [managerId, setManagerId] = useState(
    Array.isArray(employee?.parent_id) ? employee.parent_id[0] : employee?.parent_id || null
  );
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      const data = await getEmployees();

      setManagers(
        data
          .filter((item) => item.id !== employee?.id)
          .map((item) => ({
            label: item.name,
            value: item.id,
          }))
      );
    } catch (error) {
      console.log('Manager load error:', error);
    }
  };

  const handleUpdate = async () => {
    if (!employee?.id) {
      Alert.alert('Error', 'Employee not found');
      return;
    }

    if (!name || !email || !job) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await updateEmployee(employee.id, name, email, job, false, managerId);
      Alert.alert('Success', 'Employee updated');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!employee?.id) {
      Alert.alert('Error', 'Employee not found');
      return;
    }

    Alert.alert(
      'Delete Employee',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteEmployee(employee.id);
              Alert.alert('Success', 'Employee deleted');
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to delete employee'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenShell
      eyebrow="Employees"
      title="Edit Employee"
      description="Update details or remove the record from Odoo."
    >

      <SectionCard className="bg-white/5" title={null} description={null} eyebrow={null}>
        <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Employee details
        </Text>

        <AppInput
          placeholder="Employee Name"
          value={name}
          onChangeText={setName}
        />

        <AppInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="mt-4"
        />

        <AppInput
          placeholder="Job Title"
          value={job}
          onChangeText={setJob}
          className="mt-4"
        />

        <Text className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Select Manager
        </Text>

        <Dropdown
          containerStyle={{
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#0f172a',
            borderWidth: 1,
            borderColor: '#334155',
          }}
          itemContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: '#1e293b',
          }}
          style={{
            backgroundColor: '#0f172a',
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: '#334155',
          }}
          activeColor="#1e293b"
          placeholderStyle={{
            color: '#94a3b8',
          }}
          selectedTextStyle={{
            color: 'white',
          }}
          data={managers}
          labelField="label"
          valueField="value"
          placeholder="Choose Manager"
          value={managerId}
          onChange={(item) => {
            setManagerId(item.value);
          }}
        />

        <AppButton onPress={handleUpdate} disabled={loading} className="mt-5">
          Update Employee
        </AppButton>

        <AppButton
          onPress={handleDelete}
          disabled={loading}
          variant="danger"
          className="mt-3">
          Delete Employee
        </AppButton>
      </SectionCard>
    </ScreenShell>
  );
}
