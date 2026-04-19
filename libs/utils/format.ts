// src/utils/format.ts
import { format } from 'date-fns';

export const formatCurrency = (amount: number | string | null | undefined): string => {
  // Handle null/undefined
  if (amount === null || amount === undefined) return '$0.00';
  
  // Convert string to number if needed
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number
  if (isNaN(num) || !isFinite(num)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};