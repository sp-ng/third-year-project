import logo from '../logo.svg';
import '../App.css';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/joy/Button';
import '@fontsource/inter';
import { CssBaseline, Sheet, Textarea, Typography, Box } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';


export function Topics({sx, topics, position}) {
    //topics should be a nested list. first element of each sublist is the topic title.
    console.log(topics)
    let children = [];
    for (let topic of topics) {
        for (let index in topic) {
            if (index == 0) {
                children.push(<Typography level="body-lg" sx={{verticalAlign:'top'}}>{topic[index]}</Typography>)
            } else {
                children.push(<Typography level="body-md" sx={{marginLeft: '20px', verticalAlign:'top'}}>{topic[index]}</Typography>)
            }
        }     
    }

    return (
        <Box sx={sx}>
        {children}
        </Box>
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