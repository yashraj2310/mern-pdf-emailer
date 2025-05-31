import React from 'react';

import './App.css'; 
import SubmissionForm from './components/SubmissionForm';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{backgroundColor: '#282c34', padding: '20px', color: 'white', textAlign: 'center'}}>
        <h1>Workflow System</h1>
      </header>
      <main style={{padding: '20px'}}>
        <SubmissionForm />
      </main>
    </div>
  );
}

export default App;