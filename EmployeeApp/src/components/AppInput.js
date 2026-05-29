import React from 'react';
import { TextInput } from 'react-native';

const baseClassName = 'rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-base text-white shadow-inner shadow-black/10';

export default function AppInput({ className = '', ...props }) {
  return (
    <TextInput
      placeholderTextColor="#94a3b8"
      className={`${baseClassName} ${className}`}
      {...props}
    />
  );
}