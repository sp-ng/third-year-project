import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
function App() {
  const [topic, setTopic] = useState('');

  async function generateTopics() {
    alert(topic);
    const response = await fetch('http://localhost:5000/generateQuestion?' + new URLSearchParams({topic: topic}));
    console.log(response.json());
  }




  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h1>{topic}</h1>
        <label>
          <input value={topic} onChange={e => setTopic(e.target.value)} />
        </label>
        <button onClick={generateTopics}>Do shit</button>
      </header>
    </div>
  );
}

export default App;

//Need components for text input, multiple choice question
//