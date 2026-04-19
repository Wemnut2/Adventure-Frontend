// src/hooks/useFormWithValidation.ts
import { useState, useCallback } from 'react';
import { z } from 'zod';

// Type definitions
type FormValue = string | number | boolean | null | undefined;
type FormValues = Record<string, FormValue>;
type FormErrors = Record<string, string>;


interface UseFormWithValidationReturn {
  values: FormValues;
  errors: FormErrors;
  touched: Record<string, boolean>;
  handleChange: (name: string, value: FormValue) => void;
  handleBlur: (name: string) => void;
  validateForm: () => boolean;
  setFieldValue: (name: string, value: FormValue) => void;
  setFieldError: (name: string, error: string) => void;
  setValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

export function useFormWithValidation(schema: z.ZodObject<z.ZodRawShape>): UseFormWithValidationReturn {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Helper function to safely parse a value with a Zod schema
  const safeParseValue = (fieldSchema: unknown, value: FormValue): { success: boolean; message?: string } => {
    try {
      // Use type assertion to tell TypeScript this has a parse method
      const zodField = fieldSchema as { parse: (val: FormValue) => unknown; safeParse?: (val: FormValue) => { success: boolean; error?: { issues: Array<{ message: string }> } } };
      
      if (zodField.safeParse) {
        const result = zodField.safeParse(value);
        if (result.success) {
          return { success: true };
        } else {
          const message = result.error?.issues[0]?.message || 'Invalid value';
          return { success: false, message };
        }
      } else {
        zodField.parse(value);
        return { success: true };
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues[0]?.message || 'Invalid value';
        return { success: false, message };
      }
      return { success: true };
    }
  };

  const validateField = useCallback((name: string, value: FormValue): boolean => {
    try {
      const fieldSchema = schema.shape[name];
      if (fieldSchema) {
        const result = safeParseValue(fieldSchema, value);
        if (result.success) {
          setErrors(prev => ({ ...prev, [name]: '' }));
          return true;
        } else {
          setErrors(prev => ({ ...prev, [name]: result.message || 'Invalid value' }));
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return true;
    }
  }, [schema]);

  const validateForm = useCallback((): boolean => {
    try {
      // Use type assertion for the whole schema
      const zodSchema = schema as { parse: (val: FormValues) => unknown; safeParse?: (val: FormValues) => { success: boolean; error?: { issues: Array<{ message: string; path: (string | number)[] }> } } };
      
      if (zodSchema.safeParse) {
        const result = zodSchema.safeParse(values);
        if (result.success) {
          setErrors({});
          return true;
        } else {
          const newErrors: FormErrors = {};
          result.error?.issues.forEach((err) => {
            const fieldName = err.path[0]?.toString();
            if (fieldName) {
              newErrors[fieldName] = err.message;
            }
          });
          setErrors(newErrors);
          return false;
        }
      } else {
        zodSchema.parse(values);
        setErrors({});
        return true;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const fieldName = err.path[0]?.toString();
          if (fieldName) {
            newErrors[fieldName] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values]);

  const handleChange = useCallback((name: string, value: FormValue): void => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name: string): void => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = values[name];
    if (value !== undefined) {
      validateField(name, value);
    }
  }, [values, validateField]);

  const setFieldValue = useCallback((name: string, value: FormValue): void => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string): void => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setFieldValue,
    setFieldError,
    setValues,
  };
}