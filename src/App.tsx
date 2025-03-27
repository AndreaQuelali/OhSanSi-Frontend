import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Button, Dropdown, InputText } from './components';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl">Vite + React</h1>
      <div className="card">
        <Button
          label="Click mee"
          onClick={() => setCount((count) => count + 1)}
        />
        count is: {count}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <Dropdown
          name="dropdown"
          label="Dropdown"
          options={[{ id: 1, name: 'Option 1' }]}
          value={1}
          onChange={() => {}}
          displayKey={'1,2,3'}
          valueKey={'r,t,y'}
        />
        <InputText
          label="Input"
          name="input"
          placeholder="Type something"
          type="text"
          className="input"
          register={() => {}}
          errors={{}}
          onChange={() => {}}
          value=""
          validationRules={{}}
        />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
