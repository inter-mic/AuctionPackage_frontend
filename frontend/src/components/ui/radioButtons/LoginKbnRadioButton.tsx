import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { texts } from '@/config/texts';

interface RadioButtonProps {
  pageLoginFlg: boolean;
  onChange: (value: boolean) => void;
}

export function LoginKbnRadioButton({ pageLoginFlg, onChange }: RadioButtonProps) {
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '1'; 
    onChange(value); 
  };

  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={pageLoginFlg ? '1' : '0'}
        onChange={handleRadioChange}
      >
        <FormControlLabel value="0" control={<Radio />} label={texts.page.loginAll} />
        <FormControlLabel value="1" control={<Radio />} label={texts.page.loginOnly} />
      </RadioGroup>
    </FormControl>
  );
}
