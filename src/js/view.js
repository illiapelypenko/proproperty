import { state } from './index';
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
  propertyThumbnail,
  propertyAddress,
  propertyPrice,
  addPropertyToFavsButton,
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
    suggestionList.style.height =
      suggestions.slice(0, suggestionToShow).length * suggestionHeight + 'px';
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

    span.innerHTML = `Search #${
      recentSearches.indexOf(search) + 1
    } ${area_type}, ${city} (${search.propsCount})`;

    recentSearchList.appendChild(li);
  }
}

export function renderProperties() {
  loadMoreButton.style.display =
    state.properties.length - state.propertyOffset > 20 ? 'block' : 'none';

  const toRender = 20;

  let properties = state.properties
    .slice(state.propertyOffset, state.propertyOffset + toRender)
    .filter(prop => prop.thumbnail);

  matchesCount.innerHTML = `${state.propertyOffset + properties.length} of ${
    state.properties.length
  } matches`;

  for (let property of properties) {
    createPropertyItem(property, false);
  }
}

export function createPropertyItem(property, isFavorite) {
  const {
    address: { city, line },
    price,
    thumbnail,
  } = property;

  if (!thumbnail) return;

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
  li.addEventListener('click', e => onPropertyClick(e, isFavorite));

  propertyList.appendChild(li);
}

export function renderPage(page = 'searchContainer') {
  const pages = {
    propertyContainer,
    propertyPageContainer,
    searchContainer,
  };

  for (const key of Object.keys(pages)) {
    pages[key].style.display = key === page ? 'flex' : 'none';
  }
}

export function renderPropertyDetails() {
  const {
    property_id,
    baths,
    beds,
    thumbnail,
    address,
    price,
  } = state.currentProperty;

  addPropertyToFavsButton.style.visibility = state.favoriteProperties.find(
    prop => property_id === prop.property_id
  )
    ? 'hidden'
    : 'visible';

  emptyFavListMsg.style.display = 'none';

  const bath = baths <= 1 ? 'bath' : 'baths';
  const bed = beds <= 1 ? 'bed' : 'beds';

  propertySummary.innerHTML =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum blanditiis ducimus necessitatibus iste suntofficia hic sapiente iure eius porro.';
  propertyFurniture.innerHTML = `${beds} ${bed}, ${baths} ${bath}`;
  propertyThumbnail.src = thumbnail;
  propertyAddress.innerHTML = `${address.line}, ${address.city}`;
  propertyPrice.innerHTML = price;
}

export function renderError(err) {
  errMsgContainer.style.display = 'flex';
  errMsgText.innerHTML = err || 'Network connection issues';
}
