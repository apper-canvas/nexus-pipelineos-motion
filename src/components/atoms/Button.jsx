import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', type = 'button', icon: Icon, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2';
  
  // Filter out non-HTML props like `icon` to avoid passing them to the DOM element
  const buttonProps = { ...props };
  delete buttonProps.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      type={type}
      {...buttonProps}
    >
      {Icon && Icon}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;