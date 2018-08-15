const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const applicationState = [];

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Oops thats bad');
});

// Create a new session
app.post("/app", function(req,res,next){
    let sessionId = createRandomUniqueSessionId();
    console.log(`Creating new sheard session  ${sessionId}`);
    let clientData = req.body;
    let session = {id:sessionId, data:clientData };
    applicationState.push(session);
    res.status(201).json(session).end();
});

// Update an existing session
app.put("/app/:Id", function(req,res,next){
    let sessionId = req.params.Id
    let session = retriveSharedSession(sessionId);
    if( session ){
        let clientData = req.body;
        session.data = clientData;
        res.status(200).json(session).end();
    }else{
        res.status(404).end();
    }
});

app.delete("/app/:id", function(req,res,next){
    let sessionId = req.params.Id
    if( deleteSharedSession(sessionId) ){
        res.status(200).json({}).end();
    } else{
        res.status(404).end();
    }
});

// Get info about an existing session
app.get("/app/:Id", function(req,res,next){
    let sessionId = req.params.Id
    let session = retriveSharedSession(sessionId);
    if(session){
        res.status(200).json(session).end();
    } else{
        res.status(404).end();
    }
});

app.listen(app.get('port'), function() {
    console.log('Simple Server Running', app.get('port'));
});

function deleteSharedSession(sessionId){
    let index = applicationState.findIndex(session => session.id == sessionId);
    if(index >= 0){
        applicationState = applicationState.splice(index,1);
        return true;
    }
    return false;
}

function retriveSharedSession(sessionId){
    return applicationState.find( session => session.id == sessionId);
}

function createRandomUniqueSessionId(){
    /// TODO: make certain that this is unique.
    return (Math.random()+1).toString(36).substr(2, 5);
}