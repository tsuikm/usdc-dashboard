import { ALGORAND_BASE_SERVER, PURESTAKE_API_KEY, API_BASE_URL } from '@/utils/constants';
import moment from 'moment';

export async function fetchAlgorand(query) {
  const request = await fetch(`${API_BASE_URL}/api/algorand` + '?' + (new URLSearchParams(query)).toString());
  return request.json();
}

export async function getCurrentRound() {
  const response = await fetchAlgorand({
    api: 'algod',
    request: 'supply',
  });
  
  return response.current_round;
}

const blockTimes = new Map();
export const fetchAge = async transaction => {
  if (!blockTimes.has(transaction['confirmed-round'])) {
    const block = await fetchAlgorand({
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
