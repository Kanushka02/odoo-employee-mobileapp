import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  deleteEmployee,
  updateEmployee,
} from '../services/odooApi';

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
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          marginBottom: 20,
          fontWeight: '700',
        }}>
        Edit Employee
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
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Job Title"
        value={job}
        onChangeText={setJob}
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#2563eb' },
          loading && { opacity: 0.6 },
        ]}
        onPress={handleUpdate}
        disabled={loading}>
        <Text style={styles.buttonText}>
          Update Employee
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#dc2626' },
          loading && { opacity: 0.6 },
        ]}
        onPress={handleDelete}
        disabled={loading}>
        <Text style={styles.buttonText}>
          Delete Employee
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
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
};
