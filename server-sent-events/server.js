const express = require("express");
const { createReadStream } = require("fs");
const path = require("path");
const app = express();

const data = `
Server Sent Events
    The server maintains a continuous connection to send updates to the client as soon as new data is available. This allows the client to receive real-time data with minimal latency.
Pros:
    => Efficient Data Delivery: The server pushes updates to the client only when new data is available, reducing unnecessary network traffic.
    => Simple Implementation: Easy to implement over HTTP, with no need for complex protocols or bidirectional communication.
    => Real-Time Updates: Provides real-time data delivery, ideal for applications that require live updates like stock tickers, notifications, or live feeds.

Cons:
    => Limited Browser Connections: Browsers like Chrome limit the number of SSE connections per domain (e.g., Chrome allows only six concurrent connections).
    => Single-Direction Communication: SSE supports only server-to-client communication, which can be a limitation if bidirectional data exchange is needed.
    => Scalability Concerns: Managing a large number of persistent connections can strain server resources and impact performance, especially with many concurrent clients.
`;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/stream', async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    for(let i = 0; i < data.length; i++) {
        res.write(`data: ${data[i]}\n\n`);
        await wait(10); //simulates some event delay
    }
    res.end();
});

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.listen(3000, () => {
    console.log("http://localhost:3000");
});