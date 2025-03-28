import { useState } from 'react';
import FormAreas from './features/olympiads/components/form-areas'

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
