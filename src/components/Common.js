import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import { CssBaseline, Sheet, Textarea, Typography, Box, Stepper, Step, StepIndicator  } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Check from '@mui/icons-material/Check';


export function Topics({topics, position}) {
    //topics should be a nested list. first element of each sublist is the topic title.
    console.log('RUNNING TOPICS WITH')
    console.log(topics)
    return (
        <Box>
        {   topics.map((sublist, index) => (
                sublist.map((item, subIndex) => (
                    <Typography
                        key={subIndex}
                        level={subIndex === 0 ? 'body-lg' : 'body-md'}
                        sx={{
                            verticalAlign: 'top',
                            marginLeft: subIndex === 0 ? '0' : '12px', // Apply margin only if not the first element
                        }}
                    >
                        {item}
                    </Typography>
                ))

            ))
        }
        </Box>
    )
}

export function Steps({steps, position}) {
    //position = 3
    if (!Array.isArray(steps)) {
        steps = ['Loading'];
    }
    return (
        <Stepper size="sm">
            {
                steps.map((step, index) => (
                    <Step indicator={<StepIndicator color={index < position ? "primary" :"neutral"} variant={index <= position ? "solid" : "soft"}>{index < position ? <Check /> : index}</StepIndicator>}>{step}</Step>
                ))
            }
        </Stepper>
    )
}

export function StepsExample({steps, posistion}) {
    return (
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
    )
}


function Test() {
    return (
        <div style={{paddingLeft: '20px', marginBottom: 'auto'}}>
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
        </div>
    )
}