import { state } from '../index';

const BASE_URL = 'https://realtor.p.rapidapi.com';
const LOCATIONS_AUTOCOMPLETE_URL = BASE_URL + '/locations/auto-complete';
const PROPERTIES_FOR_SALE_URL = BASE_URL + '/properties/v2/list-for-sale';
const API_KEY = '38ab51c595mshb3b30b6eef3338ap1fa61cjsndc842b8881a4';

const propertiesBuffer = new Map();

export async function getSuggestions(location = 'a') {
  if (!location) location = 'a';

  try {
    const URL_PARAMS = encodeURI(`?input=${location}`);
    const X_RAPID_HOST = 'realtor.p.rapidapi.com';

    const res = await fetch(LOCATIONS_AUTOCOMPLETE_URL + URL_PARAMS, {
      headers: {
        'x-rapidapi-host': X_RAPID_HOST,
        'x-rapidapi-key': API_KEY,
      },
    });

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
    const URL_PARAMS = encodeURI(
      `?sort=relevance&city=${city}&limit=500&offset=0&state_code=${state_code}`
    );
    const X_RAPID_HOST = 'realtor.p.rapidapi.com';

    const res = await fetch(PROPERTIES_FOR_SALE_URL + URL_PARAMS, {
      headers: {
        'x-rapidapi-host': X_RAPID_HOST,
        'x-rapidapi-key': API_KEY,
      },
    });

    const data = await res.json();
    propertiesBuffer.set(mapKey, data.properties);
    state.properties = data.properties;
  } catch (e) {
    console.log(e);
  }
}
