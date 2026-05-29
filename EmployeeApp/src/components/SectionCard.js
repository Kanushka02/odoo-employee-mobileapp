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
    <View className={`rounded-[32px] border border-white/10 bg-slate-900/95 p-5 shadow-2xl shadow-black/25 ${className}`}>
      <View className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-brand-500/10" />
      {eyebrow ? (
        <View className="mb-3 self-start rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
            {eyebrow}
          </Text>
        </View>
      ) : null}

      {title ? (
        <Text className="text-3xl font-black tracking-tight text-white">
          {title}
        </Text>
      ) : null}

      {description ? (
        <Text className="mt-3 text-sm leading-6 text-slate-300">
          {description}
        </Text>
      ) : null}

      <View className={title || description || eyebrow ? 'mt-5' : ''}>
        {children}
      </View>
    </View>
  );
}
