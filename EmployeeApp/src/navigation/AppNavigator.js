import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screen/WelcomeScreen';
import LoginScreen from '../screen/LoginScreen';
import EmployeeListScreen from '../screen/EmployeeListScreen';
import AddEmployeeScreen from '../screen/AddEmployeeScreen';
import EditEmployeeScreen from '../screen/EditEmployeeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#020617' },
        }}>

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />

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
