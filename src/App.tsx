import { useState } from 'react';
import { RegisterLevels } from './features/olympiads/pages/register-levels';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RegisterLevels/>
    </>
  );
}

export default App;
