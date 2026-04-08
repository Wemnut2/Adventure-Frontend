import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useFormWithValidation<T extends z.ZodObject<any>>(schema: T) {
  const [values, setValues] = useState<Partial<z.infer<T>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any) => {
    try {
      const fieldSchema = schema.shape[name];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [name]: '' }));
        return true;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.issues[0].message }));
        return false;
      }
      return true;
    }
  }, [schema]);

  const validateForm = useCallback(() => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};

        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });

        setErrors(newErrors);
        return false;
      }
      return false;
    }
  }, [schema, values]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    if (values[name as keyof typeof values]) {
      validateField(name, values[name as keyof typeof values]);
    }
  }, [values, validateField]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
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