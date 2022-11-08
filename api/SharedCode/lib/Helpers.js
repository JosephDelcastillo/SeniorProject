
// *** Helper Funcitons *** 
/**
 * String Like?
 * @param {String} haystack String to search in 
 * @param {string} needle String to search for 
 * @returns {boolean} If Needle is in hastack ( IGNORES CAPITALIZATION )
 */
const strLike = (haystack, needle) => (haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0); 

module.exports = {
    strLike,
}