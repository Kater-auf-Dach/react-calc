import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import ActionStars from 'material-ui/svg-icons/action/stars';

import styles from '../app.styl';

const History = props => {

    function handleDelete(id) {
        props.onDelete(id)
    }

    return (
        <Paper zDepth={4}>
            <List>
                {props.memories.map(memoryItem =>
                    <ListItem key={memoryItem._id} id={memoryItem._id} onClick={() => handleDelete(memoryItem._id)} leftIcon={<ActionStars />}>
                        <p><b>Date:</b> {memoryItem.date}</p>
                        <p><b>Operation:</b> {memoryItem.operation}</p>
                    </ListItem>
                )}
            </List>
        </Paper>
    )


}


export default History;