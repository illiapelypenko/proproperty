import { state } from '../index';

export async function getSuggestions(location = 'a') {
  if (!location) {
    location = 'a';
  }
  try {
    const res = await fetch(
      encodeURI(`https://realtor.p.rapidapi.com/locations/auto-complete?input=${location}`),
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'realtor.p.rapidapi.com',
          'x-rapidapi-key': '912915357fmshd8b3c8fc8fcaa14p122a7ejsnb050b17596f1',
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
  try {
    const {
      currentSearchListItem: { city, state_code },
    } = state;
    const res = await fetch(
      `https://realtor.p.rapidapi.com/properties/v2/list-for-sale?sort=relevance&city=${encodeURI(
        city
      )}&limit=500&offset=0&state_code=${encodeURI(state_code)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'realtor.p.rapidapi.com',
          'x-rapidapi-key': '912915357fmshd8b3c8fc8fcaa14p122a7ejsnb050b17596f1',
        },
      }
    );
    const data = await res.json();
    state.properties = data.properties;
  } catch (e) {
    console.log(e);
  }
}