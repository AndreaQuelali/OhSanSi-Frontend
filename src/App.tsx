import { useState } from 'react';
import { Button, Dropdown, InputText } from './components';
import { Register } from './features/olympiads/pages/register-info';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Register/>
    </>
  );
}

export default App;
