const express = require('express');
const app = express();
const {stat} = require('fs');
const { promisify } = require('util');
const customStat = promisify(stat);
const fs = require('fs');
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', async (req, res) => {

    const { size } = await customStat(path.join(__dirname, 'video.mp4'));
    const { range } = req.headers;

    if(range) { 

        let [start, end] = range.replace(/bytes=/, '').split('-');
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size - 1;

        res.writeHead(206, {
            "content-range" : `bytes ${start}-${end}/${size}`,
            "accept-ranges" : 'bytes',
            'content-length': (end - start) - 1,
            'Content-Type': 'video/mp4'
        })

        fs.createReadStream(path.join(__dirname, 'video.mp4'), { start, end }).pipe(res);

    }else {
        res.writeHead(200, {
            'content-length': size,
            'Content-Type': 'video/mp4'
        })
    
    
        fs.createReadStream(path.join(__dirname, 'video.mp4'))
            .pipe(res)
            .on('error', console.error);
    }

});

app.listen(3000, () => {
    console.log('http://localhost:3000');
})