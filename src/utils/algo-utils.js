import { ALGORAND_BASE_SERVER, PURESTAKE_API_KEY, API_BASE_URL } from '@/utils/constants';
import moment from 'moment';

/**
 * @param {String} url
 * @param {Object} query
 */
export async function fetchAlgorand(url, query) {

  // Temporary fix for rate limiting: keep requesting until a response is given.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const request = await fetch(ALGORAND_BASE_SERVER + url + '?' + (new URLSearchParams(JSON.stringify(query))).toString(), {
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
      if (response.message === 'Too Many Requests') {
        throw new Error();
      }
      return response;
    }
    catch {
      continue;
    }
  }
}
export async function fetchAlgorandAPI(query) {
  const request = await fetch(`${API_BASE_URL}/api/algorand` + '?' + (new URLSearchParams(query)).toString());
  return request.json();
  // const reader = await request.body.getReader();
  // const value = (await reader.read()).value;
  // const decoder = new TextDecoder('utf8');

  // const response = JSON.parse(decoder.decode(value));
}

export async function getCurrentRound() {
  const response = await fetchAlgorand('/ps2/v2/ledger/supply');
  return response.current_round;
}

const blockTimes = new Map();
export const fetchAge = async transaction => {
  if (!blockTimes.has(transaction['confirmed-round'])) {
    const block = await fetchAlgorandAPI({
      api: 'indexer',
      request: 'blocks',
      param: transaction['confirmed-round']
    });
    const blockTime = moment.unix(block.timestamp);
    blockTimes.set(transaction['confirmed-round'], blockTime);
  }

  const blockTime = blockTimes.get(transaction['confirmed-round']);
  const age = moment.duration(moment().diff(blockTime));

  const seconds = age.seconds();
  const minutes = age.minutes();
  const hours = age.hours();
  const days = age.days();

  if (days == 0 && hours == 0 && minutes == 0) {
    return `${seconds} s ago`;
  } else if (days == 0 && hours == 0) {
    return `${minutes} mins ${seconds} s ago`;
  } else if (days == 0) {
    return `${hours} hrs ${minutes} mins ago`;
  } else {
    return `${days} days ${hours} hrs ago`;
  }
};
