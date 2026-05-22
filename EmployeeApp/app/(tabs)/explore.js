import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">More</ThemedText>
      <ThemedText>
        Use this tab for settings, employee utilities, or quick links as the app grows.
      </ThemedText>
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold">Suggested sections</ThemedText>
        <ThemedText>Profile, attendance, leave requests, and notifications.</ThemedText>
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