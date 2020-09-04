import {
  state
} from './index';
import {
  renderError
} from './view';

const BASE_URL = 'https://realtor.p.rapidapi.com';
const LOCATIONS_AUTOCOMPLETE_URL = BASE_URL + '/locations/auto-complete';
const PROPERTIES_FOR_SALE_URL = BASE_URL + '/properties/v2/list-for-sale';
const API_KEY = '111f4ef646msh0edca9349d6475cp1b2e0cjsn85aad4b1d986';
const X_RAPID_HOST = 'realtor.p.rapidapi.com';

const propertiesBuffer = new Map();

export async function http(
  url,
  urlParams = ''
) {
  const headers = {
    'x-rapidapi-host': X_RAPID_HOST,
    'x-rapidapi-key': API_KEY,
  };

  function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  try {
    const timeout = async (time = 30000) => {
      await wait(time);
      throw Error('Session timeout');
    };

    const query = () =>
      fetch(url + urlParams, {
        headers,
      });

    const response = await Promise.race([query(), timeout()]);
    const data = await response.json();

    return data;
  } catch (e) {
    renderError(e);
  }
}


export async function getSuggestions(location = 'a') {
  if (!location) location = 'a';

  const urlParams = encodeURI(`?input=${location}`);
  const data = await http(LOCATIONS_AUTOCOMPLETE_URL, urlParams);

  state.suggestions = data.autocomplete;
}

export async function getProperties() {
  const {
    city,
    state_code
  } = state.currentSearchListItem;

  const mapKey = JSON.stringify({
    city,
    state_code
  });

  if (propertiesBuffer.has(mapKey)) {
    return (state.properties = propertiesBuffer.get(mapKey));
  }

  const urlParams = encodeURI(
    `?sort=relevance&city=${city}&limit=500&offset=0&state_code=${state_code}`
  );
  const data = await http(PROPERTIES_FOR_SALE_URL, urlParams);

  propertiesBuffer.set(mapKey, data.properties);
  state.properties = data.properties;
}