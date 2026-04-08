// src/components/ui/PasswordInput.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input';

interface PasswordInputProps {
  label: string;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
}

export function PasswordInput({ 
  label, 
  error, 
  value, 
  onChange, 
  onBlur, 
  placeholder 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        error={error}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}