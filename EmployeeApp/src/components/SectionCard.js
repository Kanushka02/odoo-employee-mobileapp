import React from 'react';
import { Text, View } from 'react-native';

export default function SectionCard({
  eyebrow,
  title,
  description,
  children,
  className = '',
}) {
  return (
    <View className={`rounded-[32px] border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-black/25 ${className}`}>
      {eyebrow ? (
        <Text className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
          {eyebrow}
        </Text>
      ) : null}

      {title ? (
        <Text className="mt-2 text-4xl font-black text-white">
          {title}
        </Text>
      ) : null}

      {description ? (
        <Text className="mt-2 text-sm leading-6 text-slate-300">
          {description}
        </Text>
      ) : null}

      {children}
    </View>
  );
}