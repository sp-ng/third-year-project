import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route
} from "react-router-dom";
import Practice from "./pages/Practice.js"
import Reading from "./pages/Reading.js"
//import Home from "./pages/Home.js"
import {HomePlaceholder, Home} from './pages/Home.js';


/*
Make home page, shows different topics generated, button to make new one
topic page shows the current practice/reading section you are on, sidebar/top bar with info. can have an overview page.
*/

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />}/>
          <Route path="practice" element={<Practice />} />
          <Route path="reading" element={<Reading />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//Need components for text input, multiple choice question
