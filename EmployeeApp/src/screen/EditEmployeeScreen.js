import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import {
  deleteEmployee,
  updateEmployee,
} from '../services/odooApi';
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
  const [loading, setLoading] = useState(false);

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
      await updateEmployee(employee.id, name, email, job);
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
    <ScreenShell>
      <SectionCard
        className="mb-5"
        eyebrow="Employees"
        title="Edit Employee"
        description="Update details or remove the record from Odoo."
      />

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
