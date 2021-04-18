const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

console.log(bitcoin.chain);
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