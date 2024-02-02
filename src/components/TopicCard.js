import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import { Card, CssBaseline, Divider, Sheet, Typography } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import LinearProgress from '@mui/joy/LinearProgress';
/*
A card that will show details about each topic, clicking on it or on a button will direct you to that course
Deatils:
topics name
current topic
overall progress
a button to take you there
need to improve topics screen:
contain the topics together better in some kind of box
clearly indicate the current topic
show any per topic information, number of exercises left or something. Do later
*/

function TopicCard({topic}) {
  return (
    <Card
    variant='outlined'
    sx={{
        margin: 3,
        maxWidth: 400,
        //padding: 1.5
    }}
    >
        <div>
        <Typography level="h4" sx={{verticalAlign:'top'}}>{topic}</Typography>
        <Divider />
        <Typography level="title-md" sx={{padding: 0}}>Current Topics:</Typography>
        <Sheet variant="soft" sx={{ padding: 0.5, borderRadius: 3 }}>
          
          <Typography level="body-md" textColor="neutral.700">
          <b>Pizza dough</b><br />
          Rolling dough<br />
          Pizza sauce<br />
          Pizza toppings</Typography>
        </Sheet>
        </div>

        <LinearProgress determinate value={50} thickness={28}>
            <Typography 
            level="body-sm"
            fontWeight="medium"
            textColor="common.black"
            sx={{ mixBlendMode: 'multiply' }}>
            5/10 Topics Completed
            </Typography>
        </LinearProgress>
        <Button>Continue</Button>
    </Card>
  );
}

export default TopicCard;
