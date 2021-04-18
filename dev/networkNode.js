const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const BlockChain = require('./blockchain');
const uuid = require('uuid');
const port = process.argv[2];
const reqPromise = require('request-promise');

const bitcoin = new BlockChain();
const nodeAddress = uuid.v1().split('-').join('');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ code: 1, response: "Added!" });
});

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    bitcoin.createNewTransaction(12.5, "00", nodeAddress); //if we add this at the end, the hash won't have x zeroes at the start.

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash);

    res.json(newBlock);
});

// register a node and broadcast in the network
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bitcoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        }
        regNodesPromises.push(reqPromise(requestOptions));
    });

    Promise.all(regNodesPromises).
        then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
                json: true
            };
            return reqPromise(bulkRegisterOptions);
        }).
        then(data => {
            res.json({ code: 1, response: "Added to the network!" })
        });
});

//register a node with the network
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl);
        res.json({ code: 1, response: `Added node ${newNodeUrl}` });
    } else {
        res.json({ code: 2, response: `Error adding ${newNodeUrl}. This node could be already added, or i am the ${newNodeUrl}!` });
    }
});

//register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
    const responsesArray = [];
    req.body.allNetworkNodes.forEach(nodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(nodeUrl) == -1;
        const nodeNotCurrentNode = bitcoin.currentNodeUrl !== nodeUrl;
        if(nodeNotAlreadyPresent && nodeNotCurrentNode){
            bitcoin.networkNodes.push(nodeUrl);
            responsesArray.push({code:1, response: `Succes!`});
        }else{
            responsesArray.push({code:2, response: "Failed!"});
        }
    });

    res.json(responsesArray);
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});