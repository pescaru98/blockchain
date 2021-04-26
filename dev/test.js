const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

//console.log(bitcoin.chain);
// bitcoin.createNewBlock(2441, "ATEATKN54325NEI", "WAKN5342rWNIANI");

// const prevBlockHash = 'GRSINGH483THE';
// const currentBlockData = [
//     {
//         amount:10,
//         sender:'EIWI5N233',
//         recipient:'REFWNIFFI325'
//     },
//     {
//         amount:15,
//         sender:'EIWI5NEETR233',
//         recipient:'REDFWNIRARWFFI32532'
//     }
// ];
//console.log(bitcoin.proofOfWork(prevBlockHash,currentBlockData));

//console.log(bitcoin.hashBlock(prevBlockHash,currentBlockData,nonce));

//console.log(bitcoin);
const bc1 =
{
    "chain": [
        {
            "index": 1,
            "timestamp": 1619461212866,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1619461244559,
            "transactions": [],
            "nonce": 363,
            "hash": "005c850455f8bf8801a8901d9908cb6acd33bc49c9d718fcf30867c3cbc91ee3",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1619461345352,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "0ab5a130a6bc11eb9a89ebf65ee59d38",
                    "transactionId": "1da38410a6bc11eb9a89ebf65ee59d38"
                },
                {
                    "amount": 40,
                    "sender": "zrgwijig543",
                    "recipient": "reatoj5234"
                },
                {
                    "amount": 45,
                    "sender": "zrgwijig543",
                    "recipient": "reatoj5234"
                },
                {
                    "amount": 46,
                    "sender": "zrgwijig543",
                    "recipient": "reatoj5234"
                }
            ],
            "nonce": 170,
            "hash": "0031b0fa7f22ed01618f713299093be3188a75237c31cecce60a0517df9c90f0",
            "previousBlockHash": "005c850455f8bf8801a8901d9908cb6acd33bc49c9d718fcf30867c3cbc91ee3"
        },
        {
            "index": 4,
            "timestamp": 1619461370348,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "0ab5a130a6bc11eb9a89ebf65ee59d38",
                    "transactionId": "59adb1b0a6bc11eb9a89ebf65ee59d38"
                },
                {
                    "amount": 556,
                    "sender": "zrgwijryr543",
                    "recipient": "reatoydtuj5234"
                },
                {
                    "amount": 5,
                    "sender": "ette64w",
                    "recipient": "re64y5ragaqt32"
                }
            ],
            "nonce": 134,
            "hash": "0014592227e3def55b33e1e51da1fe94f2f8f8c8e808184048b2a097287ec25c",
            "previousBlockHash": "0031b0fa7f22ed01618f713299093be3188a75237c31cecce60a0517df9c90f0"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "0ab5a130a6bc11eb9a89ebf65ee59d38",
            "transactionId": "6893ef00a6bc11eb9a89ebf65ee59d38"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
}

console.log(bitcoin.chainIsValid(bc1.chain));