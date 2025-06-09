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
  // Comprehensive value handling to prevent controlled/uncontrolled issues
  const safeValue = React.useMemo(() => {
    // Handle all falsy values except 0
    if (value === null || value === undefined) return '';
    // Convert numbers to strings for input compatibility
    if (typeof value === 'number') return value.toString();
    // Ensure we always return a string
    return String(value);
  }, [value]);
  
  // Enhanced event handler with comprehensive error protection
  const handleChange = React.useCallback((e) => {
    try {
      // Validate event object exists
      if (!e || !e.target) {
        console.warn('Input: Invalid event object received');
        return;
      }
      
      // Call onChange only if it's a valid function
      if (onChange && typeof onChange === 'function') {
        onChange(e);
      }
    } catch (error) {
      // Log error but don't crash the component
      console.error('Input: Error in onChange handler:', error);
    }
  }, [onChange]);

  // Build className safely
  const inputClassName = React.useMemo(() => {
    const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors';
    const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : '';
    const customClasses = className || '';
    
    return `${baseClasses} ${disabledClasses} ${customClasses}`.trim();
  }, [className, disabled]);

  // Prepare safe props object
  const safeProps = React.useMemo(() => {
    const inputProps = { ...props };
    
    // Add type-specific props safely
    if (type === 'number') {
      if (min !== undefined) inputProps.min = min;
      if (max !== undefined) inputProps.max = max;
      if (step !== undefined) inputProps.step = step;
    }
    
    // Add accessibility props
    if (ariaDescribedBy) inputProps['aria-describedby'] = ariaDescribedBy;
    if (required) inputProps.required = true;
    
    return inputProps;
  }, [props, type, min, max, step, ariaDescribedBy, required]);

  return (
    <input
      type={type}
      value={safeValue}
      onChange={handleChange}
      placeholder={placeholder || ''}
      className={inputClassName}
      disabled={disabled}
      {...safeProps}
    />
  );
};

export default Input;