import React, { useEffect, useState } from "react";
import Select from "react-select";

export type Option = {
  value: string;
  label: string;
  isDisabled?: boolean; 
};

export interface SelectProps {
  options: Option[];
  defaultValue?: Option;
  className?: string;
  styles?: any;
  value?: any;
  onChange?: (selectedOption: Option | null) => void;
  disabled?: boolean
}

const CommonSelect: React.FC<SelectProps> = ({ options, defaultValue, className, onChange , value , disabled }) => {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(defaultValue);

  const handleChange = (option: Option | null) => {
    setSelectedOption(option || undefined); // Update the local state
    if (onChange) {
      onChange(option); // Pass the selected option to the parent
    }
  };

  useEffect(() => {
    setSelectedOption(defaultValue || value ||  undefined); // Update local state on prop change
  }, [defaultValue ,value]);
  return (
    <Select
      classNamePrefix="react-select"
      className={className}
      options={options}
      value={ selectedOption}
      onChange={handleChange}
      placeholder="Select"
      isDisabled={disabled}
      
    />
  );
};

export default CommonSelect;
