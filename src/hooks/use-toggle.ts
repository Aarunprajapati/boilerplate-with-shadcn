import { useState } from 'react';

export const useToggle = ({ initialState = false }: { initialState?: boolean }) => {
  const [value, setValue] = useState(initialState);

  const toggleType = {
    OPEN: 'open',
    CLOSE: 'close'
  };

  const toggle = () => setValue((prev) => !prev);

  const setToggle = (prompt: string) => setValue(prompt === 'open');

  return { value, toggle, setToggle, toggleType };
};
