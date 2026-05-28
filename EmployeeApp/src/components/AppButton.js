import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const variants = {
  primary: 'bg-brand-500',
  secondary: 'bg-slate-700',
  danger: 'bg-rose-600',
};

export default function AppButton({
  children,
  onPress,
  disabled = false,
  variant = 'primary',
  className = '',
}) {
  const resolvedVariant = variants[variant] || variants.primary;
  const disabledClassName = disabled ? 'opacity-60' : 'shadow-lg shadow-black/20';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className={`flex-row items-center justify-center rounded-2xl px-4 py-4 ${resolvedVariant} ${disabledClassName} ${className}`}>
      <Text className="text-center text-base font-semibold tracking-wide text-white">
        {children}
      </Text>
    </TouchableOpacity>
  );
}