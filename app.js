var { YoutubeSubs } = require('youtube-subs');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/subs', (req, res) => {
    let id = req.body.id
    YoutubeSubs.getSubs(id).then(subs => {
        res.send({ subs: subs })
        console.log("fetched !");
    })
});

app.listen(port, () => {
    console.log(`Le serveur est en écoute sur le port ${port}`);
});