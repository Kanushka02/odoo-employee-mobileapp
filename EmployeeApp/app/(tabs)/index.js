import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Employee App</ThemedText>
      <ThemedText type="subtitle">Dashboard</ThemedText>
      <ThemedText>
        This is now a clean JavaScript Expo app shell. Add employee features, API integration, and
        navigation here.
      </ThemedText>
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold">Next steps</ThemedText>
        <ThemedText>Connect your Odoo data source, then replace this placeholder with real data.</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    gap: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.08)',
  },
});