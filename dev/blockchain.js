const uuid = require('uuid');
const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];

function Blockchain() {
    //this.transactionRequiredMineNumber = 1000
    //this.minePrefixNumber = '00';
    // this.genesisBlock = {
    //     index: 0,
    //     timestamp: 0,
    //     transactions: [],
    //     nonce:0,
    //     hash:0,
    //     previousBlockHash:0
    // };
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;

}

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid.v1().split('-').join('')
    };

    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
    this.pendingTransactions.push(transactionObj);

    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;
}

Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while (hash.substring(0, 2) != '00') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        console.log(hash);
    }

    return nonce;
}

Blockchain.prototype.chainIsValid = function (blockchain) {
    let validChain = true;

    for (let i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1];
        const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
        if (blockHash.substring(0, 2) !== '00')
            validChain = false;
        if (currentBlock['previousBlockHash'] !== prevBlock['hash'])
            validChain = false;
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPrevBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correntHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if (!correctNonce || !correctPrevBlockHash || !correntHash || !correctTransactions)
        validChain = false;

    return validChain;
}

Blockchain.prototype.getBlock = function (blockHash) {
    let currentBlock = null;

    //TODO optimize: stop the forEach when finding the block
    this.chain.forEach(block => {
        if (block.hash === blockHash)
            currentBlock = block;
    });
    return currentBlock;
}

Blockchain.prototype.getTransaction = function (transactionId) {
    let returnedTransaction = null;
    let returnedBlock = null;

    //TODO optimize: stop the forEach when finding the transaction
    //we assume the transactionId is unique, because, when adding a new transaction, we haven't checked if the generated uuid is unique inside the blockchain
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.transactionId === transactionId) {
                returnedTransaction = transaction;
                returnedBlock = block;
            }
        });
    });

    // this.pendingTransactions.forEach(transaction => {
    //     if (transaction.transactionId == transactionId) {
    //         returnedTransaction = transaction;
    //     }
    // });

    return {
        transaction: returnedTransaction,
        block: returnedBlock
    };
}

Blockchain.prototype.getAddress = function (addressId) {
    const addressTransactions = [];

    this.chain.forEach(block=>{
        block.transactions.forEach(transaction=>{
            if(transaction.sender === addressId || transaction.recipient === addressId)
                addressTransactions.push(transaction);
        });
    });

    // this.pendingTransactions.forEach(transaction => {
    //     if (transaction.sender === addressId || transaction.recipient === addressId) {
    //         addressTransactions.push(transaction);
    //     }
    // });

    let balance = 0;
    addressTransactions.forEach(transaction=>{
        if(transaction.recipient === addressId) balance += transaction.amount;
        else if(transaction.sender === addressId) balance -= transaction.amount;
    });

    return {
        addressBalance: balance,
        addressTransactions: addressTransactions
    };
}

module.exports = Blockchain;

// class Blockchain{
//     constructor(){
//         this.chain = [];
//         this.newTransactions = [];
//     }
// }
