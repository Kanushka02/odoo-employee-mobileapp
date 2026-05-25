import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { createEmployee } from '../services/odooApi';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';

export default function AddEmployeeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [job, setJob] = useState('');

  const handleAddEmployee = async () => {
    if (!name || !email || !job) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await createEmployee(name, email, job);
      Alert.alert('Success', 'Employee added');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create employee');
    }
  };

  return (
    <ScreenShell>
      <SectionCard
        className="mb-5"
        eyebrow="Employees"
        title="Add Employee"
        description="Create a new team member directly from the mobile app."
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

        <AppButton onPress={handleAddEmployee} className="mt-5">
          Add Employee
        </AppButton>
      </SectionCard>
    </ScreenShell>
  );
}