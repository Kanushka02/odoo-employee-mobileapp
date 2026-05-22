import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { createEmployee } from '../services/odooApi';

export default function AddEmployeeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [job, setJob] = useState('');

  const handleAddEmployee = async () => {
    if (!name || !email || !job) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    await createEmployee(name, email, job);

    Alert.alert('Success', 'Employee Added');

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Add Employee
      </Text>

      <TextInput
        placeholder="Employee Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Job Title"
        value={job}
        onChangeText={setJob}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddEmployee}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Add Employee
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
  },

  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
};