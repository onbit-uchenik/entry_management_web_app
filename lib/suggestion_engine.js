class Node {
    prefix;
    words = [];
    children = [];
};


Node.prototype.init = function() {
    this.prefix = 0;
    for(let i=0;i<27;i++) {
        this.children[i] = null;
    }
}

function insert(str,i,parent,index) {
    if(i<str.length){
        
        let j = str.charCodeAt(i);
        if(j === 32)  j = 26;
        else j -= 97;
        (parent.prefix)++;
        //console.log(j);
        if(parent.children[j] === null) {
            parent.children[j]  = new Node;
            parent.children[j].init();
        }
        insert(str,i+1,parent.children[j],index);
    }
    else {
        parent.words.push(index);
    }
}


function suggest(str,i,parent,ans) {
    if(parent === null) {
        return -1;
    }
    else{
        if(i <  str.length ){
            //console.log(parent);
            let j = str.charCodeAt(i);
            if(j === 32)  j = 26;
            else j -= 97;
            suggest(str,i+1,parent.children[j],ans);
        }
        else{
           // console.log(parent.prefix);
            suggestWords(parent,ans);
        }
    }
}


function suggestWords(parent,ans) {
    if(parent.words  !== []) {
        for(let i=0;i<parent.words.length;i++) {
            ans.push(parent.words[i]);
        }
    }
    for(let i=0;i<27;i++) {
        if(parent.children[i] !== null) {
            suggestWords(parent.children[i],ans);
        }
    }
}

module.exports.insert = insert;
module.exports.Node = Node;
module.exports.suggest = suggest;