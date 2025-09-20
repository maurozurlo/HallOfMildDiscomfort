/**
 * Calculates the length of a null-terminated string, like C's strlen.
 * @param {string} str 
 * @returns {number}
 */
function XL_StringLength(str) {
    let len = 0;
    while (len < str.length && str[len] !== '\0') {
        len++;
    }
    return len;
}

/**
 * Copies `count` bytes from `src` to `dst` (both Uint8Array),
 * returns the index in dst after the copied bytes.
 * @param {Uint8Array} src 
 * @param {Uint8Array} dst 
 * @param {number} count 
 * @param {number} dstOffset Optional, default 0
 * @returns {number} next index in dst
 */
function XL_CopyArray(src, dst, count, dstOffset = 0) {
    if (count === 0) return dstOffset;

    // If src and dst overlap and src starts before dst, copy backwards
    if (src.byteOffset <= dst.byteOffset) {
        for (let i = count - 1; i >= 0; i--) {
            dst[dstOffset + i] = src[i];
        }
    } else {
        // Normal forward copy
        for (let i = 0; i < count; i++) {
            dst[dstOffset + i] = src[i];
        }
    }

    return dstOffset + count;
}

// Example usage:
const src = new Uint8Array([1, 2, 3, 4, 5]);
const dst = new Uint8Array(5);
XL_CopyArray(src, dst, src.length);
console.log(dst); // Uint8Array(5) [1,2,3,4,5]
