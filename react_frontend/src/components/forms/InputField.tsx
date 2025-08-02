import { AlertCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  type?: string;
  field: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
}

const InputField = ({
  label,
  type = 'text',
  field,
  placeholder,
  required = true,
  className = '',
  value,
  error,
  touched,
  onChange,
  onBlur
}: InputFieldProps) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      onBlur={() => onBlur(field)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
        error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-purple-400 hover:border-gray-300'
      }`}
    />
    {error && touched && (
      <div className="flex items-center gap-2 text-red-600 text-sm">
        <AlertCircle size={16} />
        {error}
      </div>
    )}
  </div>
);

export default InputField;
