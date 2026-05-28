import 'react-native-gesture-handler';
import './global.css';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <AppNavigator />
    </>
  );
}
