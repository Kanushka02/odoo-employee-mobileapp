import React, { useState } from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  Image,
} from 'react-native';
import { createEmployee } from '../services/odooApi';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';

export default function AddEmployeeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [job, setJob] = useState('');
  const [image, setImage] = useState(null);

  const handleAddEmployee = async () => {
    if (!name || !email || !job) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await createEmployee(
          name,
          email,
          job,
          image?.base64 || false
        );
      Alert.alert('Success', 'Employee added');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create employee');
    }
  };

  const pickImage = async () => {
  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

  if (!result.canceled) {
    setImage(result.assets[0]);
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

        <TouchableOpacity
          onPress={pickImage}
          className="mt-4 items-center rounded-2xl bg-blue-600 p-4"
        >
          <Text className="font-semibold text-white">
            Select Employee Photo
          </Text>
        </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 10,
              }}
            />
          )}

        <AppButton onPress={handleAddEmployee} className="mt-5">
          Add Employee
        </AppButton>
      </SectionCard>
    </ScreenShell>
  );
}