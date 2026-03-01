import React from 'react';

interface ValidationMessageProps {
  message?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <span className="validation-message" style={{
      color: '#dc3545',
      fontSize: '0.75rem',
      marginTop: '2px',
      display: 'block'
    }}>
      {message}
    </span>
  );
};

export default ValidationMessage;