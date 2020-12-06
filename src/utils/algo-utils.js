import { ALGORAND_BASE_SERVER, ALGORAND_USDC_ASSET_ID, PURESTAKE_API_KEY, API_BASE_URL } from '@/utils/constants';

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
