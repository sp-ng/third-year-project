import logo from '../logo.svg';
import '../App.css';
import { useState, useEffect } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import { Card, CssBaseline, Divider, Sheet, Typography, autocompleteClasses } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import LinearProgress from '@mui/joy/LinearProgress';
import { Link } from 'react-router-dom';
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
TODO:
Make the button actually work
add more details to topics section (maybe dont handle here...)
make topics section look nicer
*/

function TopicCard({title, currentTopic, nextTopics, courseID, numDone, numTotal, link}) {
  const [progress, setProgress] = useState([1,1]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/getCourseProgress?courseID=' + courseID.toString());
        const result = await response.json();
        setProgress(result);
      } catch (error) {
        console.log("error")
        console.log(error)
      } finally {
      }
    };

    fetchData();
  }, [courseID]);




  return (
    <Card
    variant='outlined'
    sx={{
        //margin: 3,
        maxWidth: 400,
        width: 300,
        minWidth: 200,
        //padding: 1.5
    }}
    >
        <div>
        <Typography level="h4" sx={{verticalAlign:'top'}}>{title}</Typography>
        <Divider />
        <Typography level="title-md" sx={{padding: 0}}>Topics:</Typography>
        <Sheet variant="soft" sx={{ padding: 0.5, borderRadius: 3 }}>
          
          <Typography level="body-md" textColor="neutral.700">
          <b>{currentTopic}</b><br />
          {nextTopics.map((item, index) => (
            <>
              {item} <br />
            </>
          ))}

          </Typography>
        </Sheet>
        </div>

        <LinearProgress determinate value={(progress[1]/progress[0])*100} thickness={28}>
            <Typography 
            level="body-sm"
            fontWeight="medium"
            textColor="common.black"
            sx={{ mixBlendMode: 'multiply' }}>
            {progress[1]}/{progress[0]} Subtopics Completed
            </Typography>
        </LinearProgress>
        <Link reloadDocument={true} to={link}>
          <Button>Continue</Button>
        </Link>
        
    </Card>
  );
}

export default TopicCard;
