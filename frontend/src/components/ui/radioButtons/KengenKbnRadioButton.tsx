import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { texts } from "@/config/texts.ja";

interface RadioButtonProps {
  kengenKbn: number;
  onChange: (value: number) => void;
}

export function KengenKbnRadioButton({ kengenKbn, onChange }: RadioButtonProps) {
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value)); // Call onChange with the new value
  };

  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={kengenKbn?.toString() || ""}
        onChange={handleRadioChange}
      >
        <FormControlLabel value="0" control={<Radio />} label={texts.kengen.hidden} />
        <FormControlLabel value="1" control={<Radio />} label={texts.kengen.readOnly} />
        <FormControlLabel value="2" control={<Radio />} label={texts.kengen.allowAll} />
      </RadioGroup>
    </FormControl>
  );
}
