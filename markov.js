const fs = require('fs');

class Markov {
    constructor(path) {
        if (path) {
            this.cache = JSON.parse(fs.readFileSync(path, 'utf8'));
        } else {
            this.cache = {
                starters: [],
                links: {},
            };
        }        
    }

    //yields a key-value pair for each pair of consecutive words 
    * link(words) {
        for (let i = 0; i < words.length - 1; i++) {
            let kv = [words[i], words[i+1]]; 
            yield kv;
        }
    }   

    train(words) {
        const gen = this.link(words);
        let data = gen.next();
        let key, val;

        //register the first link as an eligible starting link
        if (!data.done)
            this.cache.starters.push(data.value[0]);        
        
        //register the key-value pairs from the link generator as eligible consecutive links
        while (!data.done) {
            [key, val] = data.value;
            if (!this.cache.links[key])
                this.cache.links[key] = [val];
            else
                this.cache.links[key].push(val);
            data = gen.next();
        }  
        
        fs.writeFileSync('data.json', JSON.stringify(this.cache), 'utf8');
    }

    chain() {
        //pick a random eligible starting link to begin our chain
        let seed = this.cache.starters[Math.floor(Math.random() * this.cache.starters.length)];
        let chain = seed;
        
        //keep chaining until no more eligible consecutive links are found
        while(this.cache.links[seed]) {    
            let vals = this.cache.links[seed];     
            let str = vals[Math.floor(Math.random() * vals.length)];        
            chain += ' ' + str;
            seed = str;
        }
        
        return chain;
    }
}

module.exports = Markov;
