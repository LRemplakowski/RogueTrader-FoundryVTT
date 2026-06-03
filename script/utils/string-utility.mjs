/**
 * Converts a string to camelCase.
 * @param {String} str 
 * @returns {String} camelCaseString
 */
export function toCamelCase(str) {
    if (!(typeof str === "string")) { 
        console.error("Expected a string for toCamelCase conversion, received:", str);
        return str;
    }
    return str
        .replace(/\s(.)/g, function (a) {
            return a.toUpperCase();
        })
        .replace(/\s/g, '')
        .replace(/^(.)/, function (b) {
            return b.toLowerCase();
        });
}