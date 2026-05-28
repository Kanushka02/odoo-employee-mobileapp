import React from 'react';
import { Text, View } from 'react-native';

export default function ScreenShell({
  children,
  eyebrow,
  title,
  description,
  rightSlot,
}) {
  return (
    <View className="flex-1 bg-slate-950 px-5 pt-4">
      <View className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-brand-500/20" />
      <View className="absolute -left-20 top-40 h-56 w-56 rounded-full bg-emerald-500/10" />

      {(eyebrow || title || description || rightSlot) ? (
        <View className="mb-5 rounded-[28px] border border-white/10 bg-slate-900/95 px-5 py-4 shadow-2xl shadow-black/25">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 pr-2">
              {eyebrow ? (
                <Text className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
                  {eyebrow}
                </Text>
              ) : null}

              {title ? (
                <Text className="mt-2 text-3xl font-black text-white">
                  {title}
                </Text>
              ) : null}

              {description ? (
                <Text className="mt-2 text-sm leading-6 text-slate-300">
                  {description}
                </Text>
              ) : null}
            </View>

            {rightSlot ? <View>{rightSlot}</View> : null}
          </View>
        </View>
      ) : null}

      {children}
    </View>
  );
}