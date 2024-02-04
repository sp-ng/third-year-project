import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import { Box, CssBaseline, Divider, Sheet, Typography, LinearProgress } from '@mui/joy';
import '@fontsource/inter';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AQMultChoice from '../components/Questions';

/* 
Make sidebar showing list of things to do -- DONE
Show a question or reading material in the center -- DONE
have buttons to go to next item -- DONE
need somewhere to track progress and have a return to menu button -- DONE
make components for free response and random reading material
Add some functionality: 
Go back link works correctly
Fill in sidebar based on variables
*/

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
    <div style={{display: 'flex', height: '100vh'}}>
      <Box sx={{backgroundColor: 'background.level2', width: '300px', borderColor: 'background.level3', borderWidth: '1px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <Box>
          <Typography level="h2" sx={{verticalAlign:'top', textAlign: 'center' }}>Pizza</Typography>
          <Divider />
          <LinearProgress determinate value={(5/12)*100} thickness={28} sx={{margin: '10px'}}>
              <Typography 
              level="body-sm"
              fontWeight="medium"
              textColor="common.black"
              sx={{ mixBlendMode: 'multiply' }}>
              5/12 Topics Completed
              </Typography>
          </LinearProgress>
          <Divider />
          <div style={{paddingLeft: '20px', marginBottom: 'auto'}}>
          <Typography level="title-lg" sx={{verticalAlign:'top'}}>Pizza dough</Typography>
          <Typography level="body-lg" sx={{verticalAlign:'top'}}>Rolling dough</Typography>
          <Typography level="body-lg" sx={{verticalAlign:'top'}}>Pizza sauce</Typography>
          <Typography level="body-lg" sx={{verticalAlign:'top'}}>Pizza toppings</Typography>
          </div>
        </Box>        
        <Button variant='outlined' sx={{margin: 'auto auto 20px 20px'}}>Go back</Button>
        
        
        

      </Box>
      <div style={{margin: '0 auto'}}>
        <AQMultChoice
        question={'What is the most popular pizza topping in the United States?'}
        wrong={['Mushrooms', 'Anchovies', 'Pineapple']}
        correct={'Pepperoni'}/>
        <Box sx={{display: 'flex', padding: '0px 10px', justifyContent: 'space-between'}}>
        <Button>Previous</Button>
        <Button>Next</Button>
        </Box>
      </div>

    </div>

  );
}

export default Practice;

//Need components for text input, multiple choice question
//