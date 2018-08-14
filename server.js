const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const games = [];

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Oops thats bad');
});

app.post("/game", function(req,res,next){
    let newGameId = createRandomUniqueGameId();
    let firstPlayer = req.body;
    let game = {gameId:newGameId, firstPlayer:firstPlayer, secondPlayer:null};
    games.push(game);
    res.json(JSON.stringify(game)).end();
});

app.put("/game/join/:gameId", function(req,res,next){
    let gameId = req.params.gameId
    let game =  data.games.find(item => item.gameid == gameId);
    if(game){
        game.secondPlayer = req.body;
        res.status(200).json(JSON.stringify(game)).end();
    } else{
        res.status(404).end();
    }
})

app.put("/game/:gameId", function(req,res,next){
    let gameId = req.params.gameId
    let game =  data.games.find(item => item.gameid == gameId);
    let player = req.body;
    if( game){
        
        if(game.firstPlayer.name === player.name){
            game.firstPlayer = player;
        } else{
            game.secondPlayer = player;
        }
        
        res.status(200).json(JSON.stringify(game)).end();

    }else{
        res.status(404).end();
    }
});

app.get("/game/:gameId", function(req,res,next){
    let game =  data.games.find(item => item.gameid == gameId);
    if(game){
        res.status(200).json(JSON.stringify(game)).end();
    } else{
        res.status(404).end();
    }
});

app.listen(app.get('port'), function() {
    console.log('Rock, Paper, Scissors server running', app.get('port'));
});

function createRandomUniqueGameId(){
    /// TODO: make certain that this is unique.
    return (Math.random()+1).toString(36).substr(2, 5);
}