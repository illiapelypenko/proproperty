import {
  state,
  SUGGESTION_LIST,
  RECENT_SEARCHES_LIST,
  PROPERTY_LIST,
  MATCHES_COUNT,
  LOADMORE_BUTTON,
} from '../index';

export function renderSuggestions() {
  while (SUGGESTION_LIST.firstChild) {
    SUGGESTION_LIST.removeChild(SUGGESTION_LIST.firstChild);
  }
  const { suggestions, showSuggestions } = state;
  for (let suggestion of suggestions) {
    const { area_type, city, state_code } = suggestion;
    const li = document.createElement('li');
    li.classList.add('search__suggestion');
    li.innerHTML = `${area_type}, ${city}, ${state_code}`;
    SUGGESTION_LIST.appendChild(li);
  }
  if (showSuggestions) {
    const suggestionToShow = 4;
    const suggestionHeight = 56;
    SUGGESTION_LIST.style.height =
      (suggestions.length > suggestionToShow
        ? suggestionToShow * suggestionHeight
        : suggestions.length * suggestionHeight) + 'px';
  }
}

export function renderSearchList() {
  while (RECENT_SEARCHES_LIST.firstChild) {
    RECENT_SEARCHES_LIST.removeChild(RECENT_SEARCHES_LIST.firstChild);
  }
  const { recentSearches } = state;
  for (const search of recentSearches) {
    const { city, area_type } = search;
    const li = document.createElement('li');
    li.classList.add('recent-searches__item');
    const span = document.createElement('span');
    li.appendChild(span);
    span.innerHTML = `Search #${recentSearches.indexOf(search) + 1} ${area_type}, ${city}`;
    RECENT_SEARCHES_LIST.appendChild(li);
  }
}

export function renderProperties() {
  if (state.properties.length - state.propertyOffset > 20) LOADMORE_BUTTON.style.display = 'block';
  else LOADMORE_BUTTON.style.display = 'none';
  const toRender = 20;
  let properties = state.properties.slice(state.propertyOffset, state.propertyOffset + toRender);

  MATCHES_COUNT.innerHTML = `${properties.length} matches`;
  for (let property of properties) {
    const {
      address: { city, line },
      price,
      thumbnail,
    } = property;

    if (!thumbnail) continue;

    const li = document.createElement('li');
    li.classList.add('property-item');

    const img = document.createElement('img');
    img.src = thumbnail;
    img.alt = 'thumbnail';
    img.classList.add('property-item__thumbnail');

    const div = document.createElement('div');
    div.classList.add('property-item__info');

    const priceElement = document.createElement('p');
    priceElement.classList.add('property-item__price');
    priceElement.innerHTML = `$ ${price}`;

    const locationElement = document.createElement('p');
    locationElement.classList.add('property-item__location');
    locationElement.innerHTML = `${city}, ${line}`;

    li.appendChild(img);
    li.appendChild(div);
    div.appendChild(priceElement);
    div.appendChild(locationElement);

    PROPERTY_LIST.appendChild(li);
  }
}
