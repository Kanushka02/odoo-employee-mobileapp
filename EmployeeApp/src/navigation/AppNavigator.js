import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screen/LoginScreen';
import EmployeeListScreen from '../screen/EmployeeListScreen';
import AddEmployeeScreen from '../screen/AddEmployeeScreen';
import EditEmployeeScreen from '../screen/EditEmployeeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#020617' },
        }}>

         <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Employees"
          component={EmployeeListScreen}
        />

        <Stack.Screen
          name="AddEmployee"
          component={AddEmployeeScreen}
        />

        <Stack.Screen
          name="EditEmployee"
          component={EditEmployeeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
