import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import { Box, CssBaseline, Divider, Sheet, Typography, LinearProgress, Stepper, Step, StepIndicator } from '@mui/joy';
import '@fontsource/inter';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {AQMultChoice, FreeResponse} from '../components/Questions';
import {Topics, Steps} from '../components/Common';
import Reading from './Reading';
import Check from '@mui/icons-material/Check';
import { DonutLargeSharp } from '@mui/icons-material';
import { useParams } from 'react-router-dom'

/* 
Make sidebar showing list of things to do -- DONE
Show a question or reading material in the center -- DONE
have buttons to go to next item -- DONE
need somewhere to track progress and have a return to menu button -- DONE
make components for free response and random reading material -- DONE

setup props for free response and reading material -- DONE

turn topic list into a component? accepts nested list and some indicator of current position
can do the same for the stepper


make a component for the progress bar

Add some functionality: 
Go back link works correctly
Fill in sidebar based on variables





PRACTICE PAGE:
Set topics on left side -- DONE
Set steps on top -- DONE
show main content (need small change to backend to save what type of content it is)
implement previous and next buttonsz



*/



function Practice() {
  const [topic, setTopic] = useState('');
  const courseID = useParams()['courseID']
  const itemID = useParams()['itemID']
  if (itemID == undefined) {
    itemID = 1
  }
  const [course, setCourse] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [steps, setSteps] = useState(['Loading']);
  const [item, setItem] = useState([]);

  //get list of subtopics for use in the topic component
  function getTopicList(course) {
    let limit = 20
    let counter = 0
    let courseRaw = course['data'][1]
    let processedList = []
    for (let item of courseRaw) {
      let tempList = []
      tempList.push(item[0])
      for (let subtopic of item[1]) {
        counter++
        tempList.push(subtopic[0])
      }
      processedList.push(tempList)
      if (counter > limit) {
        return processedList
      }

    }
    return processedList
  }
  //given a course and a leaf dataID it will return the steps at that leaf and the position 
  function getSteps(course, ID) {
    console.log('getting steps')
    let courseRaw = course['data'][1]
    let processedList = []
    for (let topic of courseRaw) {
      for (let subTopic of topic[1]) {
        let steps = subTopic[1].map(([firstItem]) => firstItem)
        for (let step in subTopic[1]) {
          if (subTopic[1][step][1] == ID) {
            console.log('returning steps and position')
            console.log([steps, step])
            return [steps, step]
          }
        }
      }
    }
    return []
  }



  //if itemID is undefined find the first element in the tree and go to it
  async function getCourse(ID) {
    const response = await fetch('http://localhost:5000/getCourse?' + new URLSearchParams({courseID: ID}));
    //console.log("WE GOT THE RESPONSE");
    let result = await response.json()
    //console.log(result);
    return(result)    
  }  
  async function getItem(ID) {
    const response = await fetch('http://localhost:5000/getData?' + new URLSearchParams({dataID: ID}));
    //console.log("WE GOT THE RESPONSE");
    let result = await response.json()
    //console.log(result);
    return(result)    
  }  
  if (course.length == 0) {
    getCourse(courseID).then(course => {
      setCourse(course)
      setTopicList(getTopicList(course))
      console.log("thing")
      let stepTemp = getSteps(course, itemID)
      console.log(stepTemp)
      setSteps(stepTemp)      
      console.log(course)
      console.log('steps')
      console.log(steps)
      console.log(getTopicList(course))


      console.log("stufff")
    })
  }
  if (item.length == 0) {
    getItem(itemID).then(item => {
      setItem(item)
      //console.log("thing")
      //console.log(item)
      //console.log("stufff")
    })
  }
  //console.log('topiclist:')
  //console.log(topicList)




  async function generateTopics() {
    alert(topic);
    const response = await fetch('http://localhost:5000/generateQuestion?' + new URLSearchParams({topic: topic}));
    console.log("WE GOT THE RESPONSE");
    console.log(response.json());
    console.log("did u see it?");
  }
  /*
  Pizza Dough:

Types of Flour for Pizza Dough
Kneading Techniques
Rolling Dough:

Rolling Pin Techniques
Tips for a Crispy Crust
Pizza Sauce:

Homemade Tomato Sauce
Herb and Spice Infusions
Pizza Toppings:

Classic vs. Creative Toppings
Balancing Flavors and Textures
Baking Pizza:

Choosing the Right Oven Temperature
Baking Surfaces (Stone, Steel, Pan)
  */



  return (
    <div style={{display: 'flex', height: '100vh', justifyContent: 'space-between', alignContent: "stretch"}}>
      <Box sx={{position: 'sticky', top: '0', backgroundColor: 'background.level2', height: '100vh', width: '300px', borderColor: 'background.level3', borderWidth: '1px', display: 'flex', flexDirection: 'column'}}>
        <Box>
          <Typography level="h2" sx={{verticalAlign:'top', textAlign: 'center' }}>Pizza</Typography>
          <Divider />
          <LinearProgress determinate value={(0/5)*100} thickness={28} sx={{margin: '10px'}}>
              <Typography 
              level="body-sm"
              fontWeight="medium"
              textColor="common.black"
              sx={{ mixBlendMode: 'multiply' }}>
              0/5 Topics Completed
              </Typography>
          </LinearProgress>
          <Divider />
          <div style={{paddingLeft: '20px', marginBottom: 'auto'}}>
          {/*
          <Typography level="title-lg" sx={{verticalAlign:'top'}}>Pizza dough</Typography>
          <Typography level="title-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Types of Flour for Pizza Dough</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Kneading Techniques</Typography>
          <Typography level="body-lg" sx={{verticalAlign:'top'}}>Rolling dough</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Rolling Pin Techniques</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Tips for a Crispy Crust</Typography>
          <Typography level="body-lg" sx={{verticalAlign:'top'}}>Pizza sauce</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Homemade Tomato Sauce</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Herb and Spice Infusions</Typography>
          <Typography level="body-lg" sx={{verticalAlign:'top'}}>Pizza toppings</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Classic vs. Creative Toppings</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Balanacing Flavors and Textures</Typography>
          <Typography level="body-lg" sx={{verticalAlign:'top'}}>Baking Pizza</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Oven Temperature</Typography>
          <Typography level="body-md" sx={{verticalAlign:'top', marginLeft: '10px'}}>Baking Surfaces</Typography>
          */}
          <Topics topics={topicList}/>
          {/*
          <Topics topics={[['Pizza Dough', 'Types of Flour'],['Rolling Dough', 'Rolling Pin Techniques', 'Tips for a Crispy Crust'],['Pizza Sauce', 'Homemade Tomato Sauce', 'Herb and Spice Infusions']]}/>
          */}
          </div>

          
          
        </Box>        
        <Button variant='outlined' sx={{margin: 'auto auto 20px 20px'}}>Go back</Button>     
        
        

      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: '1'}}>
        <Box sx={{backgroundColor: 'background.level2', padding: '20px'}}>
          <Typography level="title-lg" sx={{marginBottom: '5px', textAlign: 'center'}}>Types of Flour for Pizza Dough</Typography>
          {/*
          <Stepper size="sm">
          <Step
            indicator={
              <StepIndicator variant="solid" color="primary"><Check /></StepIndicator>
            }
          >
            Read
          </Step>
          <Step indicator={<StepIndicator variant="solid" color="primary"><Check /></StepIndicator>}>Free Response</Step>
          <Step indicator={<StepIndicator variant="solid" color="neutral">3</StepIndicator>}>Read</Step>
          <Step indicator={<StepIndicator>4</StepIndicator>}>Free Response</Step>
          <Step indicator={<StepIndicator>5</StepIndicator>}>Multiple Choice</Step>
          </Stepper>
          */}
          <Steps steps={steps[0]} position={steps[1]} />
        </Box>
        <div style={{margin: '0 auto'}}>
          <AQMultChoice
          question={'What is the most popular pizza topping in the United States?'}
          wrong={['Mushrooms', 'Anchovies', 'Pineapple']}
          correct={'Pepperoni'}/>
          <FreeResponse question={"Explain the optimal method of putting toppings on pizza"}></FreeResponse>
          <Reading title={"How to make pizza dough"} text={"To craft the perfect pizza dough, start by combining all-purpose flour, warm water, active dry yeast, salt, and a drizzle of olive oil in a mixing bowl. Allow the yeast to activate, forming a frothy layer on the water's surface. Gradually incorporate the flour and knead the mixture until it transforms into a smooth and elastic dough. Let it rest, covered, to let the yeast work its magic in rising the dough. Once it doubles in size, punch it down, shape it into your desired crust, and voilà—a homemade pizza dough ready to be adorned with your favorite toppings before a flavorful trip to the oven."}></Reading>
          <Box sx={{display: 'flex', padding: '0px 10px', justifyContent: 'space-between'}}>
          <Button>Previous</Button>
          <Button>Next</Button>
          </Box>
        </div>
      </Box>
      

    </div>

  );
}

export default Practice;

//Need components for text input, multiple choice question
//