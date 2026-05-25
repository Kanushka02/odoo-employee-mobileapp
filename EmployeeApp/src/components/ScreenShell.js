import React from 'react';
import { View } from 'react-native';

export default function ScreenShell({ children }) {
  return (
    <View className="flex-1 bg-slate-950 px-5 pt-4">
      <View className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-brand-500/20" />
      <View className="absolute -left-20 top-40 h-56 w-56 rounded-full bg-emerald-500/10" />
      {children}
    </View>
  );
}