const express = require('express');
const bodyParser = require('body-parser');
require('isomorphic-fetch');

const app = express();
app.use(bodyParser.json());

const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const stateUrl = `http://localhost:${daprPort}/v1.0/state`;
const port = 3000;

// ======================== SERVICE INVOCATION ========================

/**
 * Other dapr microservices invoke this function by performing a GET request against http://localhost:<DAPR_PORT>/v1.0/nodeapp/method/function.
 * "nodeapp" is the name of this microservice (seen in the node.yaml manifest) and "function" is the name of this endpoint.
 */
app.get('/function', (_req, res) => {

});

/**
 * Other dapr microservices invoke this function by performing a POST request against http://localhost:<DAPR_PORT>/v1.0/nodeapp/method/function2
 */
app.post('/function2', (req, res) => {
    
});

// ============================== STATE ===============================

/**
 * An example of to persist a key value pair with dapr. Note that we're not waiting for an affirmation that state was persisted successfully. To enable this, we could add add a .then function to our promise or use async/await syntax to await the promise's resolution.
 * @param {string} key 
 * @param {any} value 
 */
const persistState = (key, value) => {
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
    fetch(stateUrl, options);
}

/**
 * An example of how to get state from dapr. 
 * @param {string} key 
 */
const getState = async (key) => {
    const response = await fetch(`${stateUrl}/${key}`);
    console.log(response);
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

app.listen(port, () => console.log(`Node App listening on port ${port}!`));