/**
 *  Helpers
 *  
 *  A Mix of Helper Functions 
 */

/**
 * @param {object}  data    - Data to sent 
 * @param {boolean} success - ONLY MARK TRUE if succeeded, otherwise ignore
 * @param {string}  point   - String description of what happened 
 * 
 * @property {boolean}  success - Whether this is success data - Default: FALSE
 * @property {string}   message - String message to describe what happened
 * @property {string}   point   - String message to describe where this is called from | Default - Query
 * @property {object}   data    - Data to Reply with 
*/
module.exports = function Reply ({ data, success, point }) { 
    this.success = success ?? false;
    this.message = `${(success ?? false) ? 'Succeeded' : 'Failed'} at ${point ?? 'Query'}`;
    this.data = data ?? null;
}