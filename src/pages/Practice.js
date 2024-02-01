import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AQMultChoice from '../components/Questions';
//import QMultChoice from '../components/Questions';


function Practice() {
  const [topic, setTopic] = useState('');

  async function generateTopics() {
    alert(topic);
    const response = await fetch('http://localhost:5000/generateQuestion?' + new URLSearchParams({topic: topic}));
    console.log("WE GOT THE RESPONSE");
    console.log(response.json());
    console.log("did u see it?");
  }




  return (
    <AQMultChoice
     question={'What is the most popular pizza topping in the United States?'}
     wrong={['Mushrooms', 'Anchovies', 'Pepperoni', 'Pineapple']}
     correct={'Pepperoni'}
     />
  );
}

export default Practice;

//Need components for text input, multiple choice question
//