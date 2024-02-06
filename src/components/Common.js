import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import { CssBaseline, Sheet, Textarea, Typography, Box, Stepper, Step, StepIndicator, LinearProgress} from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Check from '@mui/icons-material/Check';

export function Topics({sx, topics, position}) {
    //topics should be a nested list. first element of each sublist is the topic title.
    //position refers only to position of topics not subtopics
    let totalPos = 0;
    console.log(topics)
    let children = [];
    for (let topic of topics) {
        for (let index in topic) {
            if (index == 0) {
                if (totalPos == position) {
                    children.push(<Typography level="title-lg" sx={{verticalAlign:'top'}}>{topic[index]}</Typography>)
                } else {
                    children.push(<Typography level="body-lg" sx={{verticalAlign:'top'}}>{topic[index]}</Typography>)
                }
                
            } else {
                children.push(<Typography level="body-md" sx={{marginLeft: '20px', verticalAlign:'top'}}>{topic[index]}</Typography>)
            }
        }   
        totalPos++;  
    }

    return (
        <Box sx={sx}>
        {children}
        </Box>
    )
}

export function ProgressStepper({sx, items, position}) {
    //Takes list of items, puts it into a stepper, indicates current progress at an item based on position
    let curPos = 0;
    let children = [];
    for (let index in items) {
        
        if (curPos < position) {
            children.push(<Step indicator={<StepIndicator variant="solid" color="primary"><Check /></StepIndicator>}>{items[index]}</Step>)
        } else if (curPos == position) {
            children.push(<Step indicator={<StepIndicator variant="solid" color="neutral">{+index + 1}</StepIndicator>}>{items[index]}</Step>)
        } else {
            children.push(<Step indicator={<StepIndicator>{+index + 1}</StepIndicator>}>{items[index]}</Step>)
        }
        curPos++;
    }


    return (
        <Stepper sx={sx} size="sm">
            {children}
        </Stepper>
    )
}

export function ProgressBar({sx, numDone, numTotal}) {
    return (
        <LinearProgress sx={sx} determinate value={(numDone/numTotal)*100} thickness={28}>
            <Typography 
            level="body-sm"
            fontWeight="medium"
            textColor="common.black"
            sx={{ mixBlendMode: 'multiply' }}>
            {numDone}/{numTotal} Topics Completed
            </Typography>
        </LinearProgress>
    )
}




/*
<Stepper size="sm">
<Step
indicator={
    <StepIndicator variant="solid" color="primary"><Check /></StepIndicator>
}
>
Read
</Step>
<Step indicator={<StepIndicator variant="solid" color="primary"><Check /></StepIndicator>}>Free Response</Step>
<Step indicator={<StepIndicator variant="solid" color="primary"><Check /></StepIndicator>}>Read</Step>
<Step indicator={<StepIndicator variant="solid" color="primary"><Check /></StepIndicator>}>Free Response</Step>
<Step indicator={<StepIndicator variant="solid" color="neutral">5</StepIndicator>}>Multiple Choice</Step>
</Stepper>
*/