
import { ValidationError } from 'yup';

export const mapYupErrors = (error: ValidationError): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (error.inner) {
    error.inner.forEach((err) => {
      if (err.path) errors[err.path] = err.message;
    });
  }
  return errors;
};
