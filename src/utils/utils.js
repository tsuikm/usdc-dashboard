import { ALGORAND_BASE_SERVER } from '@/utils/constants';

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

/**
 * @param {String} url
 * @param {Object} query
 */
export async function fetchAlgorand(url, query) {
  // while (true) {      
  //   try {
      const request = await fetch(ALGORAND_BASE_SERVER + url + '?' + (new URLSearchParams(query)).toString(), {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': PURESTAKE_API_KEY,
        },
      });

      const reader = await request.body.getReader();
      const value = (await reader.read()).value;
      const decoder = new TextDecoder('utf8');

      const response = JSON.parse(decoder.decode(value));
      
      if (response.message === "Too Many Requests") {
        throw new Error();
      }
      return response;
    // }
    // catch {
    //   continue;
    // }
  // }
}
