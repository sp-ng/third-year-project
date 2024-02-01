import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import { CssBaseline, Sheet, Typography } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';

/*
TODO:
Get the layout looking correct
Find the best way to automatically set the component fields
Functionality to press buttons to check answer
Figure out how right or wrong answer selected is propagated to the rest of the page and backend
*/

function QMultChoice() {
  return (
    <div>
        <CssBaseline />
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
            <div>

                <div><Button variant="outlined" fullWidth="true" sx={{ mt: 1 }}>Mushrooms</Button></div>
                <div><Button variant="outlined" fullWidth="true" sx={{ mt: 1 }}>Anchovies</Button></div>
                <div><Button variant="outlined" fullWidth="true" sx={{ mt: 1 }}>Pepperoni</Button></div>
                <div><Button variant="outlined" fullWidth="true" sx={{ mt: 1 }}>Pineapple</Button></div>
            </div>
        </Sheet>
    </div>
  );
}

function AQMultChoice({question, correct, wrong}) {
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
      <Typography level="h4">What is the most popular pizza topping in the United States?</Typography>
      <Typography level="body-sm">Pick one answer</Typography>
      <RadioGroup aria-label="Your plan" name="people" defaultValue="Individual">
      <List
        sx={{
          minWidth: 240,
          '--List-gap': '0.5rem',
          '--ListItem-paddingY': '1rem',
          '--ListItem-radius': '8px',
          '--ListItemDecorator-size': '32px',
        }}
      >
        {['Mushrooms', 'Anchovies', 'Pepperoni', 'Pineapple'].map((item, index) => (
          <ListItem variant="outlined" key={item} sx={{ boxShadow: 'sm' }}>
            <Radio
              overlay
              value={item}
              label={item}
              sx={{ flexGrow: 1, flexDirection: 'row-reverse' }}
              slotProps={{
                action: ({ checked }) => ({
                  sx: (theme) => ({
                    ...(checked && {
                      inset: -1,
                      border: '2px solid',
                      borderColor: theme.vars.palette.primary[500],
                    }),
                  }),
                }),
              }}
            />
          </ListItem>
        ))}
      </List>
      </RadioGroup>
    </Sheet>
    
  )

}

//export default QMultChoice;
//export {AQMultChoice};
export default AQMultChoice;
//Need components for text input, multiple choice question
//