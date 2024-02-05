import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import TopicCard from '../components/TopicCard';
import { Grid, Sheet } from '@mui/joy';

/*
Make home page, shows different topics generated, button to make new one
Make a grid of TopicCard components, obtain this from backend when ready. -- DONE
Make top bar with stuff in it -- DONE
Have a button to make a new topic. -- DONE

Make buttons send you to practice page

seperate progress bar and the topic overview into seperate subcomponents. good chance to improve the topic overview

center the boxes...

*/



export function Home() {
  let empty = Array.apply(null, Array(5)).map(function () {})

  return (
    <>
      <Sheet sx={{minHeight: 50, backgroundColor: 'background.level2'}}>
        <Button sx={{margin: 1}}>Create new</Button>
      </Sheet>
      <Grid container spacing={3} sx={{ flexGrow: 1, padding: 3}}>
      {empty.map((item, index) => (
        <Grid>
        <TopicCard title='Pizza' currentTopic='Pizza dough' nextTopics={['Rolling dough', 'Pizza sauce', 'Pizza toppings']} numDone={5} numTotal={12}/>
        </Grid>
      ))}
    </Grid>
    </>





     
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