import { state } from '../index';
import { renderError } from './view';

const BASE_URL = 'https://realtor.p.rapidapi.com';
const LOCATIONS_AUTOCOMPLETE_URL = BASE_URL + '/locations/auto-complete';
const PROPERTIES_FOR_SALE_URL = BASE_URL + '/properties/v2/list-for-sale';
const API_KEY = '897733c2d3msh13b53444c4f53c4p152d7fjsn04123a994089';
const X_RAPID_HOST = 'realtor.p.rapidapi.com';

const propertiesBuffer = new Map();

export async function getSuggestions(location = 'a') {
  if (!location) location = 'a';

  try {
    const urlParams = encodeURI(`?input=${location}`);
    const timeout = new Promise((resolve, reject) => setTimeout(() => reject('server timeout'), 10000));
    const res = fetch(LOCATIONS_AUTOCOMPLETE_URL + urlParams, {
      headers: {
        'x-rapidapi-host': X_RAPID_HOST,
        'x-rapidapi-key': API_KEY,
      },
    })
      .then(res => res.json())
      .then(data => (state.suggestions = data.autocomplete));
    Promise.race([timeout, res]);
  } catch (e) {
    renderError(e);
  }
}

export async function getProperties() {
  const { city, state_code } = state.currentSearchListItem;
  const mapKey = JSON.stringify({ city, state_code });

  if (propertiesBuffer.has(mapKey)) {
    return (state.properties = propertiesBuffer.get(mapKey));
  }

  try {
    const urlParams = encodeURI(`?sort=relevance&city=${city}&limit=500&offset=0&state_code=${state_code}`);
    const index = setTimeout(() => renderError('server timeout'), 10000);
    const res = await fetch(PROPERTIES_FOR_SALE_URL + urlParams, {
      headers: {
        'x-rapidapi-host': X_RAPID_HOST,
        'x-rapidapi-key': API_KEY,
      },
    });

    const data = await res.json();
    propertiesBuffer.set(mapKey, data.properties);
    clearTimeout(index);
    state.properties = data.properties;
  } catch (e) {
    console.log(e);
    renderError();
  }
}
