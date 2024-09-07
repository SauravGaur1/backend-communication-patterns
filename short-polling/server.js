const express = require('express');
const app = express();

const jobs = {}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/create', (req, res) => {
    const jobId = `task:${Date.now()}`;
    jobs[jobId] = 0; //progress
    someHeavyOperationSimulation(jobId);
    res.end(`Job Created : ${jobId}`);
})

app.get('/status', (req, res) => {
    const { jobId } = req.query;
    if(!!!jobId) {
        res.end(`No Job with job id ${jobId} exists`);
    }
    const progress = jobs[jobId];

    res.end(`Status: ${progress}%`);
})

function someHeavyOperationSimulation(jobId) {
    let progress = jobs[jobId];
    if(progress == 100) return;
    setTimeout(() => {
        jobs[jobId] += 10;
        someHeavyOperationSimulation(jobId);
    }, 2000);
}

app.listen(3000, () => {
    console.log("http://localhost:3000");
})