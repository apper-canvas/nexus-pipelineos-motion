import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', ...props }) => {
  // Prevent controlled/uncontrolled component issues
  const safeValue = value ?? '';
  
  // Safe event handler to prevent crashes
  const handleChange = (e) => {
    if (onChange && typeof onChange === 'function') {
      onChange(e);
    }
  };

  return (
    <input
      type={type}
      value={safeValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${className}`}
      {...props}
    />
  );
};

export default Input;