import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ label, type = 'text', options, value, onChange, placeholder, id, required = false, className = '', ...props }) => {
  const InputComponent = type === 'select' ? Select : Input;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-error">*</span>}
        </Label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={props.rows || 3}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          {...props}
        />
      ) : (
        <InputComponent
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          options={options}
          required={required}
          {...props}
        />
      )}
    </div>
  );
};

export default FormField;