import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';

export default function ScreenShell({
  children,
  eyebrow,
  title,
  description,
  rightSlot,
  scrollable = true,
}) {
  const content = (
    <View className="flex-1 px-5 pt-3">
      <View className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-brand-500/20" />
      <View className="absolute -left-20 top-40 h-56 w-56 rounded-full bg-emerald-500/10" />
      <View className="absolute right-10 top-24 h-20 w-20 rounded-full bg-cyan-400/10" />

      {(eyebrow || title || description || rightSlot) ? (
        <View className="mb-5 rounded-[30px] border border-white/10 bg-slate-900/95 px-5 py-5 shadow-2xl shadow-black/25">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 pr-2">
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
            </View>

            {rightSlot ? <View>{rightSlot}</View> : null}
          </View>
        </View>
      ) : null}

      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {scrollable ? (
        <ScrollView
          className="flex-1"
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
