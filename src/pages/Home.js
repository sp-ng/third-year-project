import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import TopicCard from '../components/TopicCard';
/*
Make home page, shows different topics generated, button to make new one
Will be a grid of cards showing details of each topic. will need a card component
*/



export function Home() {


    return (
        <TopicCard title='Pizza' currentTopic='Pizza dough' nextTopics={['Rolling dough', 'Pizza sauce', 'Pizza toppings']} numDone={5} numTotal={12}/>
    )
}







function HomePlaceholder() {
    const [topic, setTopic] = useState('');
  
    async function generateTopics() {
      alert(topic);
      const response = await fetch('http://localhost:5000/generateQuestion?' + new URLSearchParams({topic: topic}));
      console.log("WE GOT THE RESPONSE");
      console.log(response.json());
      console.log("did u see it?");
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
          <Button variant="solid" onClick={generateTopics}>Do shit</Button>
        </header>
      </div>
    );
  }


  export default HomePlaceholder;