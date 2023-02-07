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

async function hashing (token, salt) { return await bcrypt.hash(token, salt); } 
async function genSalt () { return await bcrypt.genSalt(10); }

function sanitizeObj(obj={}) {
    const flags = ["token", "salt", "pass"];
    if(!obj || !Array.isArray(Object.keys(obj))) return false;
    let output = {};
    Object.keys(obj).forEach(key => {
        if (key[0] == "_") return;
        if (!flags.some(flag => key.includes(flag))) output[key] = obj[key];
    });
    return output;
}

function sanitizeArr(arr=[]){
    if(!Array.isArray(arr)) return false;
    let output = [];
    arr.forEach(e => output.push(sanitizeObj(e)));
    return output;
}

/**
 * Sanitize Object or Array of Objects
 * 
 * @param {Object|Array} data Object or Array of Objects to Sanitize
 * @returns {Object|Array} Sanitized Object/Array of Objects
 */
function sanitize(data) {
    if(Array.isArray(data)) {
        if(data.length <= 0) return data;
        return sanitizeArr(data);
    } else if(Object.keys(data)) {
        if(Object.keys(data).length <= 0) return data;
        return sanitizeObj(data);
    } else {
        console.log("Else")
        return data;
    }
}

module.exports = {
    sanitize,
    strLike, 
    genSalt, 
    hashing, 
    genId
}
