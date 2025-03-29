import { useState } from 'react';
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
