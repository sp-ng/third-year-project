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

/*
eval day TODO:
link everything to backend:
1. display all courses on front page
2. set routing for the practice pages: page/courseID/dataID will link to each item
3. link everything on the course pages to backend

MAIN PAGE:
Make the continue button actually functional
Implement the create new button
Make the progress bar work (need to implement a backend route for that)

PRACTICE PAGE:
setup routing + default URL -- DONE
show topics on left
show steps up top
progressbar on top left (same as main page)
request and show the main content (with different elements based on the DB response)

implement assessment for mult choice and free response


ESSENTIAL TODO:
MAIN PAGE:
Make the continue button actually functional
Implement the create new button

PRACTICE PAGE:
Set topics on left side
Set steps on top
show main content (need small change to backend to save what type of content it is)
implement previous and next buttons




*/





export function Home() {
  let empty = Array.apply(null, Array(2)).map(function () {})
  async function getCourses() {
    let topic = "goofy"
    const response = await fetch('http://localhost:5000/getCourses');
    console.log("WE GOT THE RESPONSE");
    let result = await response.json()
    console.log(result);
    return(result)    
    //console.log(result['PromiseResult']);
    console.log("did u see it?");
  }
  
  const [courseList, setCourseList] = useState([]);
  if (courseList.length == 0) {
    getCourses().then(courses => {
      setCourseList(courses)
      console.log("thing")
      console.log(courses)
      console.log("stufff")
    })
  }
  console.log("BRUH")
  console.log(courseList)
  console.log("pls just work")
  return (
    <>
      <Sheet sx={{minHeight: 50, backgroundColor: 'background.level2'}}>
        <Button sx={{margin: 1}}>Create new</Button>
      </Sheet>
      <Grid container spacing={3} sx={{ flexGrow: 1, padding: 3}}>
      
      {/*empty.map((item, index) => (
        <Grid>
        <TopicCard title='Pizza' currentTopic='Pizza dough' nextTopics={['Rolling dough', 'Pizza sauce', 'Pizza toppings']} numDone={5} numTotal={12}/>
        </Grid>
      ))*/}

      {courseList.map((item, index) => (
        <Grid>
        <TopicCard title={item['data'][0]} currentTopic='Pizza dough' nextTopics={item['data'][1].map(([firstItem]) => firstItem)} numDone={5} numTotal={12}/>
        </Grid>
      ))}
      

      {/*
        () => {
            console.log(topics)
            let children = [];
            for (let topic of topics) {
                console.log(topic)
                children.push(<Typography level="body-lg" sx={{verticalAlign:'top'}}>{topic[0]}</Typography>)
            }
            return children;
        }       
      */}
      {/*
      <Grid>
      <TopicCard title='Pizza' currentTopic='Pizza dough' nextTopics={['Rolling dough', 'Pizza sauce', 'Pizza toppings']} numDone={1} numTotal={5}/>
      </Grid>
      <Grid>
      <TopicCard title='Photography Basics' currentTopic='Camera types' nextTopics={['Understanding exposure', 'Composition techniques', 'Editing software']} numDone={0} numTotal={4} />

      </Grid>
      <Grid>
      <TopicCard title='Fitness Routine' currentTopic='Warm-up exercises' nextTopics={['Strength training', 'Cardio workouts', 'Cool-down stretches']} numDone={1} numTotal={4} />

      </Grid>
    */}
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