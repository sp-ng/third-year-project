import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import TopicCard from '../components/TopicCard';
import { Grid, Sheet } from '@mui/joy';
import Textarea from '@mui/joy/Textarea';

/*
TODO:
NOW:
setup api routes for progress info: -- DONE
set and get progress of specific item -- DONE
get progress over entire course or maybe over a subtopic -- DONE
merge the tables? -- DONE

OVERALL:
reorganize frontend code:
split neatly into API calls, data processing, and page interactions

MAIN PAGE:
Implement the create new button -- DONE
Make the progress bar work (need to implement a backend route for that) -- DONE
Make topic overview component for the topicCard (just to make it look better)?

PRACTICE PAGE:
Default URL for course
Make topic list not look garbage, implement position indicator
clickable topic list
progressbar on top left (same as main page)
get forward and back buttons on the practice page working better
implement assessment for mult choice and free response
Clickable topic list

BACKEND:
Use more information than just the subtopic name to generate content. subtopic name is often not enough
Setup smarter generation of the types of questions -- DONE
sort out overall course title. this probably needs to be a generated field -- DONE, just used the topic the user chose lol

EXTRA:
Chat for feedback and questioning
Content regeneration
RAG
research wtf ur doing lol
make a not shit database
*/





export function Home() {
  let empty = Array.apply(null, Array(2)).map(function () {})
  const [topic, setTopic] = useState('');
  
  const handleClick = () => {
    // Make the GET request
    console.log("HOLY FUCK JUST FETCH")
    fetch('http://127.0.0.1:5000/makeCourse?' + new URLSearchParams({topic: topic}))
      .then(response => {
        // Handle response as needed
        if (response.ok) {
          // If response is successful, refresh the page
          window.location.reload();
        } else {
          // Handle error response
          console.error('Error:', response.statusText);
        }
      })
      .catch(error => {
        // Handle network errors
        console.error('Error:', error);
      });
  };

  async function getCourses() {
    let topic = "goofy"
    const response = await fetch('http://localhost:5000/getCourses');
    //console.log("WE GOT THE RESPONSE");
    let result = await response.json()
    //console.log(result);
    return(result)    
    //console.log(result['PromiseResult']);
    console.log("did u see it?");
  }
  
  const [courseList, setCourseList] = useState([]);
  if (courseList.length == 0) {
    getCourses().then(courses => {
      setCourseList(courses)
      //console.log("thing")
      //console.log(courses)
      //console.log("stufff")
    })
  }
  //console.log("BRUH")
  //console.log(courseList)
  //console.log("pls just work")
  return (
    <>
      <Sheet sx={{minHeight: 50, backgroundColor: 'background.level2', display: 'flex', justifyContent: 'center'}}>
        
        
        <Textarea maxRows={1} placeholder="Topic to generate..." label="Topic" value={topic} onChange={e => setTopic(e.target.value)} sx={{width: '400px',marginRight: 1, marginTop: 'auto', marginBottom: 'auto', maxHeight: '10px'}}/>
        <Button sx={{margin: 1}} onClick={handleClick}>Create new</Button>
      </Sheet>
      <Grid container spacing={3} sx={{ flexGrow: 1, padding: 3}}>
      
      {/*empty.map((item, index) => (
        <Grid>
        <TopicCard title='Pizza' currentTopic='Pizza dough' nextTopics={['Rolling dough', 'Pizza sauce', 'Pizza toppings']} numDone={5} numTotal={12}/>
        </Grid>
      ))*/}

      {courseList.map((item, index) => (
        <Grid>
        <TopicCard courseID={item['courseID']} title={item['data'][0]} link={item['courseID'] + "/" + item['data'][1][0][1][0][1][0][1]} nextTopics={item['data'][1].map(([firstItem]) => firstItem)} numDone={5} numTotal={12}/>
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