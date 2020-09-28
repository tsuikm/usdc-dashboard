export function toHex(num) {
    return '0x' + (num).toString(16);
}
export function fromHex(num) {
    return parseInt(num, 16);
}

export function removeLeadingZeros(num) {
    if (!num || fromHex(num) === 0) {
        return '0x0000000000000000000000000000000000000000';
    }
    return '0x' + num.slice(2, num.length).replaceAll('0', '');
}

export function removeDuplicates(a, key) {
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}