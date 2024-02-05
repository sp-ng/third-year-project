import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import { CssBaseline, Sheet, Textarea, Typography } from '@mui/joy';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

export function Reading() {
  return (
    <Sheet
    sx={{
      width: 600,
      mx: 'auto', // margin left & right
      my: 4, // margin top & bottom
      py: 3, // padding top & bottom
      px: 2, // padding left & right
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      borderRadius: 'sm',
      boxShadow: 'md',
    }}
    variant="outlined"
    >
      <Typography level="h4">How to make pizza dough</Typography>
      <Sheet variant="outlined" sx={{ padding: 0.5, borderRadius: 3 }}>
        <Typography level="body-md" textColor="neutral.700">
        To craft the perfect pizza dough, start by combining all-purpose flour, warm water, active dry yeast, salt, and a drizzle of olive oil in a mixing bowl. Allow the yeast to activate, forming a frothy layer on the water's surface. Gradually incorporate the flour and knead the mixture until it transforms into a smooth and elastic dough. Let it rest, covered, to let the yeast work its magic in rising the dough. Once it doubles in size, punch it down, shape it into your desired crust, and voilà—a homemade pizza dough ready to be adorned with your favorite toppings before a flavorful trip to the oven.  
        </Typography>
      </Sheet>
    </Sheet>
  )
}


export function ReadingTest() {
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
          Edit <code>src/App.js,</code> and save to reload. reading
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

export default Reading;

//Need components for text input, multiple choice question
//