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

async function genId () {
    return await uuidv4();
}

async function hashing (password, salt) {
    return await bcrypt.hash(password, salt); 
} 

async function genSalt () {
    return await bcrypt.genSalt(10);
}


module.exports = {
    strLike, genSalt, hashing, genId
}