'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const memory = [];
let nextId = 0;

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/memory', (req, res) => {
    res.send(memory);
});

app.post('/api/memory', (req, res) => {
    const memoryItem = {
        id: nextId++,
        date: req.body.date,
        operation: req.body.operation
    };

    memory.push(memoryItem);
    res.send(memoryItem);
});

app.put('/api/memory/:id', (req, res) => {
    
    const memoryItem = memory.find(memoryItem => memoryItem.id == req.params.id);
    if (!memoryItem) return res.sendStatus(404);
    memoryItem.operation = req.body.operation || memoryItem.operation;

    res.json(memoryItem);
});

app.delete('/api/memory/:id', (req, res) => {

    const index = memory.findIndex(memoryItem => memoryItem.id == req.params.id);    
    if (index === -1) return res.sendStatus(404);
    memory.splice(index, 1);

    res.sendStatus(204);
});

app.get('*', (req, res) => {
    
    fs.readFile(`${__dirname}/public/index.html`, (error, html) => {
        if (error) throw error;

        res.setHeader('Content-Type', 'text/html');
        res.end(html);
    });
});

app.listen(app.get('port'), () => console.log(`Server is listening: http://localhost:${app.get('port')}`));