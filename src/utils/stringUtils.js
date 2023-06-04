
/**
 * Encode string to Html entities
 *
 * @param {string} str Input strin.
 * @return {string} Encoded string.
 */

export default function htmlentities(str) {
   return str.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
      return '&#' + i.charCodeAt(0) + ';';
   });
}