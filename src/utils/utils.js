export function toHex(num) {
    return '0x' + (num).toString(16);
} 

export function fromHex(num) {
  return parseInt(num, 16);
}