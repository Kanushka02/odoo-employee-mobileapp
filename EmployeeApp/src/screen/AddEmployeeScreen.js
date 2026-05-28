import React, { useEffect, useState } from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { createEmployee, getEmployees } from '../services/odooApi';
import { Dropdown } from 'react-native-element-dropdown';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';

export default function AddEmployeeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [job, setJob] = useState('');
  const [image, setImage] = useState(null);
  const [managerId, setManagerId] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    requestImagePermission();
    loadEmployees();
  }, []);

  const requestImagePermission = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert(
        'Photo access needed',
        'Enable media library access to select an employee photo.'
      );
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();

      setEmployees(
        data.map((emp) => ({
          label: emp.name,
          value: emp.id,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

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
          image?.base64 || false,
          managerId
        );
      Alert.alert('Success', 'Employee added');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create employee');
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please allow photo access to choose an employee image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <ScreenShell
      eyebrow="Employees"
      title="Add Employee"
      description="Create a new team member, assign a manager, and optionally add a profile photo."
    >
      <SectionCard
        className="bg-white/5"
        eyebrow="Employee details"
        title="New profile"
        description="Fill in the employee information that should appear in the directory."
      >

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

        <Text className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Select manager
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
          data={employees}
          labelField="label"
          valueField="value"
          placeholder="Choose Manager"
          value={managerId}
          onChange={(item) => {
            setManagerId(item.value);
          }}
        />

        <View className="mt-5 rounded-[28px] border border-white/10 bg-slate-950/70 p-4">
          <Text className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Profile photo
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            className="mt-4 items-center rounded-2xl bg-brand-500 px-4 py-4"
          >
            <Text className="font-semibold text-white">
              Choose employee photo
            </Text>
          </TouchableOpacity>

          <Text className="mt-3 text-center text-xs leading-5 text-slate-400">
            Photos make it easier for users to recognize the employee in the list.
          </Text>
        </View>

        {image ? (
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
        ) : (
          <View className="mt-4 rounded-2xl border border-dashed border-slate-600 bg-slate-900/70 px-4 py-4">
            <Text className="text-center text-sm text-slate-400">
              No photo selected yet.
            </Text>
          </View>
        )}

        <AppButton onPress={handleAddEmployee} className="mt-5">
          Add Employee
        </AppButton>
      </SectionCard>
    </ScreenShell>
  );
}