import { state } from '../index';

const API_KEY = '897733c2d3msh13b53444c4f53c4p152d7fjsn04123a994089';
const propertiesBuffer = new Map();

export async function getSuggestions(location = 'a') {
  if (!location) location = 'a';

  try {
    const BASE_URL = 'https://realtor.p.rapidapi.com';
    const LOCATIONS_AUTOCOMPLETE_URL = BASE_URL + '/locations/auto-complete';

    const res = await fetch(
      encodeURI(`${BASE_URL + LOCATIONS_AUTOCOMPLETE_URL}?input=${location}`),
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'realtor.p.rapidapi.com',
          'x-rapidapi-key': API_KEY,
        },
      }
    );

    const data = await res.json();

    state.suggestions = data.autocomplete;
  } catch (e) {
    console.log(e);
  }
}

export async function getProperties() {
  const { city, state_code } = state.currentSearchListItem;
  const mapKey = JSON.stringify({ city, state_code });
  if (propertiesBuffer.has(mapKey)) {
    return (state.properties = propertiesBuffer.get(mapKey));
  }

  try {
    const BASE_URL = 'https://realtor.p.rapidapi.com';
    const PROPERTIES_FOR_SALE_URL = BASE_URL + '/properties/v2/list-for-sale';

    const res = await fetch(
      `${BASE_URL + PROPERTIES_FOR_SALE_URL}?sort=relevance&city=${encodeURI(
        city
      )}&limit=500&offset=0&state_code=${encodeURI(state_code)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'realtor.p.rapidapi.com',
          'x-rapidapi-key': API_KEY,
        },
      }
    );

    const data = await res.json();
    propertiesBuffer.set(mapKey, data.properties);
    state.properties = data.properties;
  } catch (e) {
    console.log(e);
  }
}
