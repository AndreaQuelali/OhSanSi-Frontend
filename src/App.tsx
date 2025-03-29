import { useState } from 'react';
import { Button, Dropdown, InputText } from './components';
import { RegisterLevels } from './features/olympiads/pages/register-levels';
import FormLevels from './features/olympiads/components/form-levels';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RegisterLevels/>
    </>
  );
}

export default App;
