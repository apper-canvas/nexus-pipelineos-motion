import React from 'react';

const Input = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  disabled = false,
  required = false,
  min,
  max,
  step,
  'aria-describedby': ariaDescribedBy,
  ...props 
}) => {
  // Simple value handling to prevent controlled/uncontrolled issues
  const safeValue = value === null || value === undefined ? '' : String(value);
  
  // Simple event handler without complex error catching
  const handleChange = (e) => {
    if (onChange && typeof onChange === 'function') {
      onChange(e);
    }
  };

  // Build className
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : '';
  const inputClassName = `${baseClasses} ${disabledClasses} ${className}`.trim();

  // Prepare props object
  const inputProps = {};
  
  // Add type-specific props
  if (type === 'number') {
    if (min !== undefined) inputProps.min = min;
    if (max !== undefined) inputProps.max = max;
    if (step !== undefined) inputProps.step = step;
  }
  
  // Add accessibility props
  if (ariaDescribedBy) inputProps['aria-describedby'] = ariaDescribedBy;
  if (required) inputProps.required = true;

return (
    <input
      type={type}
      value={safeValue}
      onChange={handleChange}
      placeholder={placeholder || ''}
      className={inputClassName}
      disabled={disabled}
      {...inputProps}
      {...props}
    />
  );
};

export default Input;