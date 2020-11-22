export function toHex(num) {
  return '0x' + (num).toString(16);
}
export function fromHex(num) {
  return parseInt(num);
}

export function padHex(hex, length) {
  return '0x' + hex.slice(2).padStart(length, '0');
}

export function removeLeadingZeros(hex) {
  if (hex[0] !== '0' || hex[1] !== 'x') {
    throw new Error(hex + ' is not a hex string');
  }

  let i = 2;
  for (; hex[i] === '0' && i < hex.length - 1; i++);
  return '0x' + hex.slice(i);
}

export function removeDuplicates(a, key) {
  let seen = new Set();
  return a.filter(item => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

export function roundToNearest(num, decimalPlaces) {
  return Math.round(num * 10**decimalPlaces)/(10**decimalPlaces);
}

export function pushAll(dst, src) {
  for (const elem of src) {
    dst.push(elem);
  }
  return dst;
}

export function basePathFromPath(path) {
  if (path.includes('/solana')) {
    return '/solana';
  } else if (path.includes('/algorand')) {
    return '/algorand';
  }

  return '';
}

export async function finishPromises() {
  return new Promise(resolve => setTimeout(resolve, 0));
} 
