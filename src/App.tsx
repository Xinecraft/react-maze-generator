import React from 'react';
import { Board } from './Board';

function App() {
  return (
    <div className="App bg-gray-900 flex flex-col h-screen items-center justify-center w-full">
      <Board rows={25} columns={25} />
    </div>
  );
}

export default App;
