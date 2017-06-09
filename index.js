const fs = require('fs');
const Markov = require('./markov.js');
let obj = new Markov() //pass data.json as parameter if applicable;

//train the bot from training.txt and print out a sample
const words = fs.readFileSync('training.txt', 'utf8').split(' ');
obj.train(words); 
console.log('sample: ' + obj.chain())