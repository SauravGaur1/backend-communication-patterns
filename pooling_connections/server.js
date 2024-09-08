const express = require('express');
const app = express();

// KINDLY READ THE README FILE TO UNDERSTAND THIS AS ITS EXAMPLE IS SAME AS LONG_POLLING

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

app.get('/status', async (req, res) => {
    const { jobId } = req.query;
    if(!!!jobId) {
        res.end(`No Job with job id ${jobId} exists`);
    }
    while(await checkStatus(jobId) == false);
    const progress = jobs[jobId];

    res.end(`Status: ${progress}%`);
})

async function checkStatus(jobId) {
    return new Promise((resolve, reject) => {
        if(jobs[jobId] < 100) {
            setTimeout(() => resolve(false), 100);
        } else {
            resolve(true);
        }
    })
}

function someHeavyOperationSimulation(jobId) {
    let progress = jobs[jobId];
    if(progress == 100) return;
    setTimeout(() => {
        jobs[jobId] += 10;
        someHeavyOperationSimulation(jobId);
    }, 500);
}

app.listen(3000, () => {
    console.log("http://localhost:3000");
})