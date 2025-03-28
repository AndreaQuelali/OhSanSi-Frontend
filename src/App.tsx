import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Button, Dropdown, InputText } from './components';
import FormAreas from './features/olympiads/form-areas/components/form-areas'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <FormAreas
        />
      </div>
    </>
  );
}

export default App;
