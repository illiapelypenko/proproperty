import { state } from "../index";

const KEY = "897733c2d3msh13b53444c4f53c4p152d7fjsn04123a994089";
const propertiesBuffer = new Map();

export async function getSuggestions(location = "a") {
  if (!location) location = "a";

  try {
    const res = await fetch(
      encodeURI(
        `https://realtor.p.rapidapi.com/locations/auto-complete?input=${location}`
      ),
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "realtor.p.rapidapi.com",
          "x-rapidapi-key": KEY,
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
  if (propertiesBuffer.has(mapKey))
    return (state.properties = propertiesBuffer.get(mapKey));

  try {
    const res = await fetch(
      `https://realtor.p.rapidapi.com/properties/v2/list-for-sale?sort=relevance&city=${encodeURI(
        city
      )}&limit=500&offset=0&state_code=${encodeURI(state_code)}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "realtor.p.rapidapi.com",
          "x-rapidapi-key": KEY,
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
