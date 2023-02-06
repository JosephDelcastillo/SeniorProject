const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// *** Helper Funcitons *** 
/**
 * String Like?
 * @param {String} haystack String to search in 
 * @param {string} needle String to search for 
 * @returns {boolean} If Needle is in hastack ( IGNORES CAPITALIZATION )
 */
const strLike = (haystack, needle) => (haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0); 

async function genId () { return await uuidv4(); }

async function hashing (password, salt) { return await bcrypt.hash(password, salt); } 
async function genSalt () { return await bcrypt.genSalt(10); }

function sanitize(obj={}) {
    const flags = ["token", "salt"];
    if(!obj || !Array.isArray(obj.keys())) return false;
    let output = {};
    obj.keys().forEach(key => {
        if (key[0] == "_") return;
        let valid = true;
        for (const flag in flags) if(key.includes(flags)) valid = false;
        if(valid) output[key] = obj[key];
    });
    return obj;
}

function sanatizeArr(arr=[]){
    let output = [];
    arr.forEach(e => output.push(sanatize(e)));
    return output;
}

module.exports = {
    sanatizeArr,
    sanitize,
    strLike, 
    genSalt, 
    hashing, 
    genId
}
