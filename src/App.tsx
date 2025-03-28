import { useState } from 'react';
import { RegisterAreas } from './features/olympiads/pages/register-areas';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        {/*<Register/>*/}
        <RegisterAreas/>
      </div>
    </>
  );
}

export default App;
