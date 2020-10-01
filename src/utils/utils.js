export function toHex(num) {
    return '0x' + (num).toString(16);
}
export function fromHex(num) {
    return parseInt(num);
}

export function padHex(hex, length) {
    return "0x" + hex.slice(2).padStart(length, "0");
}

export function removeLeadingZeros(num) {
    if (num[0] === '0' && num[1] === 'x') {
        let hex = num.slice(2);
        while (hex[0] === '0' && hex.length > 1) {
            hex = hex.slice(1)
        }
        return '0x' + hex;
    }
}

export function removeDuplicates(a, key) {
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}
