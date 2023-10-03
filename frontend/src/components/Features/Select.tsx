import {useEffect, useRef, useState} from 'react';
import {InputLabel} from '@mui/material';
import {MenuItem} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import {Select, SelectChangeEvent } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';

export default function CustomSelect() {
  const [subjects, setSubject] = useState('');
  const inputComponent = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    setPosition(inputComponent.current? (inputComponent.current.getBoundingClientRect().left + 30): 0);
  }, [inputComponent]);

  const subjectsData = ["Mathematics", "Physics", "Computer Science", "Chemistry", "Biology"];

  const handleChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setSubject(event.target.value);
  };

  return (
      <FormControl sx={{width: 200}}>
        {/* Supplies text for label */}
        {subjects ? <InputLabel id="custom-select-label">subjects</InputLabel> : ''}
        <Select
          ref={inputComponent}
          labelId="custom-select-label"
          id="custom-select"
          value={subjects}
          label={subjects ? "Subject" : ""} //This tells Select to have gap in border
          onChange={handleChange}
          displayEmpty
          renderValue={(value) => value ? value : <em>Nothing Selected</em>}
          MenuProps={{
            PaperProps: {sx: {left: `${position}px !important`}}
          }}
        >
          {/*Don't add a placeholder, instead use renderValue to control emptry value text */}
          {subjectsData.map((subjectsValue) => {
            return <MenuItem value={subjectsValue}>{subjectsValue}</MenuItem>
          })}
        </Select>
        <FormHelperText sx={{marginLeft: 0}}>With TypeScript!</FormHelperText>
      </FormControl>
  );
}