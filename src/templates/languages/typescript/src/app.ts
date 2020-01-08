import * as express from 'express';
const bodyParser = require('body-parser');
require('isomorphic-fetch');

const app = express();
app.use(bodyParser.json());

const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const stateUrl = `http://localhost:${daprPort}/v1.0/state`;
const port = 3001;

// ======================== SERVICE INVOCATION ========================

/**
 * Returns a random number to the caller.
 * Other dapr microservices invoke this function by performing a GET request against http://localhost:<DAPR_PORT>/v1.0/invoke/javascript-microservice/method/randomNumber.
 * "javascript-microservice" is the name of this microservice (seen in the javascript.yaml manifest or specified in dapr run command) and "randomNumber" is the name of this endpoint.
 */
app.get('/randomNumber', (_req, res) => {
    res.status(200).send({
        randomNumber: Math.ceil(Math.random() * 100)
    });
});

/**
 * Returns the current set number. If no number has been set, returns a 404 with an error message.
 */
app.get('/savedNumber', async (_req, res) => {
    try {
        let number = await getState("currentNumber");
        res.send({
            currentNumber: number
        });
    } catch (err) {
        res.status(404).send("Could not get current number. Have you set a number?");
    }
});

/**
 * Sets the current number, taking a JSON object with a "number" property. 
 * Other dapr microservices invoke this function by performing a POST request against http://localhost:<DAPR_PORT>/v1.0/invoke/javascript-microservice/method/persistNumber
 */
app.post('/saveNumber', async (req, res) => {
    try {
        const response = await persistState("currentNumber", req.body.number);
        res.send(response.status ? 200 : response.status);
    } catch (err) {
        res.status(404).send(`Could not persist number to ${stateUrl}. Did you set up dapr and configure a state store?`);
    }
});

// ============================== STATE ===============================

/**
 * A demonstration of persisting a key value pair with dapr
 * @param {string} key 
 * @param {any} value 
 */
const persistState = async (key: string, value: any) => {
    const options = {
        method: "POST",
        body: JSON.stringify([{
            key,
            value
        }]),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch(stateUrl, options);
    return response;
}

/**
 * An example of how to get state from dapr. 
 * @param {string} key 
 */
const getState = async (key: string) => {
    const response = await fetch(`${stateUrl}/${key}`);
    return await response.json();
}

// ============================== PUBSUB ==============================
/**
 * This GET endpoint illustrates how we subscribe to messages. Here we're subscribing to messages of topic A and B.
 * Messages are published by making a POST request with a JSON body against http://localhost:<DAPR_PORT>/v1.0/<TOPIC_NAME>.
 */
app.get('/dapr/subscribe', (_req, res) => {
    res.json([
        'A',
        'B'
    ]);
});

app.post('/A', (req, _res) => {
    console.log("Got message of topic 'A'");
    console.log(req.body);
});

app.post('/B', (req, _res) => {
    console.log("Got message of topic 'B'");
    console.log(req.body);
});

app.listen(port, () => console.log(`Node App listening on port ${port}!`));