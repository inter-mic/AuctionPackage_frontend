import React from 'react';

interface InputTextProps {
  id: string;
  name: string;
  value: string | undefined;
  className: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputText: React.FC<InputTextProps> = ({ id, name, value, className, onChange }) => {
  return (
    <input
        id={id}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={className}
      />
  );
};
