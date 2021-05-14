const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.argv[2];

const app = express()
app.use(bodyParser.json())

app.post('/fileupload', (req, res) => {
    console.log(req)
    res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})