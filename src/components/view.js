import { state } from '../index';
import {
  suggestionList,
  recentSearchList,
  propertyList,
  matchesCount,
  loadMoreButton,
  propertyPageContainer,
  searchContainer,
  propertyContainer,
  propertySummary,
  propertyFurniture,
  propertySumbnail,
  propertyAddress,
  propertyPrice,
  propertyFaveslistContainer,
  propertyFaveslist,
  addPropertyToFavsButton,
  onFavsPropertyClick,
  errMsgContainer,
  errMsgText,
  emptyFavListMsg,
} from './elements';
import { clearChildren } from './utils';

import { onPropertyClick } from './eventListeners';

export function renderSuggestions() {
  const suggestionToShow = 4;
  const suggestionHeight = 56;

  clearChildren(suggestionList);

  const { suggestions, showSuggestions } = state;

  for (let suggestion of suggestions) {
    const { area_type, city, state_code } = suggestion;
    const li = document.createElement('li');

    li.classList.add('search__suggestion');
    li.innerHTML = `${area_type}, ${city}, ${state_code}`;
    suggestionList.appendChild(li);
  }

  if (showSuggestions) {
    suggestionList.style.height = suggestions.slice(0, suggestionToShow).length * suggestionHeight + 'px';
  }
}

export function renderSearchList() {
  clearChildren(recentSearchList);

  const { recentSearches } = state;

  for (const search of recentSearches) {
    const { city, area_type } = search;
    const li = document.createElement('li');
    li.classList.add('recent-searches__item');
    const span = document.createElement('span');
    li.appendChild(span);
    span.innerHTML = `Search #${recentSearches.indexOf(search) + 1} ${area_type}, ${city} (${search.propsCount})`;
    recentSearchList.appendChild(li);
  }
}

export function renderProperties() {
  loadMoreButton.style.display = state.properties.length - state.propertyOffset > 20 ? 'block' : 'none';

  const toRender = 20;
  let properties = state.properties
    .slice(state.propertyOffset, state.propertyOffset + toRender)
    .filter(prop => prop.thumbnail);
  matchesCount.innerHTML = `${state.propertyOffset + properties.length} of ${state.properties.length} matches`;

  for (let property of properties) {
    createPropertyItem(property, false);
  }
}

export function createPropertyItem(property, isFav) {
  const {
    address: { city, line },
    price,
    thumbnail,
  } = property;

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
  li.addEventListener('click', e => onPropertyClick(e, isFav));

  propertyList.appendChild(li);
}

export function renderPage(page = 'search') {
  switch (page) {
    case 'search':
      searchContainer.style.display = 'flex';
      propertyContainer.style.display = 'none';
      propertyPageContainer.style.display = 'none';
      break;
    case 'propertiesList':
      searchContainer.style.display = 'none';
      propertyContainer.style.display = 'flex';
      propertyPageContainer.style.display = 'none';
      break;
    case 'propertyDetails':
      searchContainer.style.display = 'none';
      propertyContainer.style.display = 'none';
      propertyPageContainer.style.display = 'flex';
      break;
    case 'faves':
      searchContainer.style.display = 'none';
      propertyContainer.style.display = 'none';
      propertyPageContainer.style.display = 'none';
      break;
    default:
      searchContainer.style.display = 'flex';
      propertyContainer.style.display = 'none';
      propertyPageContainer.style.display = 'none';
      break;
  }
}

export function renderPropertyDetails() {
  state.favoriteProperties.find(prop => state.currentProperty.property_id === prop.property_id)
    ? (addPropertyToFavsButton.style.visibility = 'hidden')
    : (addPropertyToFavsButton.style.visibility = 'visible');

  emptyFavListMsg.style.display = 'none';

  propertySummary.innerHTML =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum blanditiis ducimus necessitatibus iste suntofficia hic sapiente iure eius porro.';
  propertyFurniture.innerHTML = `${state.currentProperty.beds} ${state.currentProperty.beds <= 1 ? 'bed' : 'beds'}, ${
    state.currentProperty.baths
  } ${state.currentProperty.baths <= 1 ? 'bath' : 'baths'}`;
  propertySumbnail.src = state.currentProperty.thumbnail;
  propertyAddress.innerHTML = `${state.currentProperty.address.line}, ${state.currentProperty.address.city}`;
  propertyPrice.innerHTML = `${state.currentProperty.price}`;
}

export function renderError(err) {
  errMsgContainer.style.display = 'flex';
  errMsgText.innerHTML = err ? err : 'Network connection issues';
}
