import {
  searchTextInput,
  suggestionList,
  recentSearchList,
  myLocationButton,
  goButton,
  loadMoreButton,
  propertyList,
  propertyListBackButton,
  propertyDetailsBackButton,
  addPropertyToFavsButton,
  favesButton,
  matchesCount,
  errMsgCloseBtn,
  errMsgContainer,
  emptyFavListMsg,
} from './elements';
import { state } from './index';
import {
  renderSuggestions,
  renderSearchList,
  renderProperties,
  renderPropertyDetails,
  renderPage,
  createPropertyItem,
} from './view';
import { getSuggestions, getProperties } from './api';
import { propertySpinner } from './spinner';
import {
  getSearchItemInfo,
  clearChildren,
  getNodeElementIndexFromNodeList,
} from './utils';

function onSearchFocus() {
  state.showSuggestions = true;
  renderSuggestions();
}

const onSearchInput = () => {
  // 1 sec delay before fetching data
  let timeout;

  return e => {
    try {
      const suggest = async () => {
        await getSuggestions(e.target.value);
        renderSuggestions();
      };
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(suggest, 1000);
    } catch (e) {
      console.log(e);
    }
  };
};

function onSearchBlur() {
  suggestionList.style.height = '0px';
  state.showSuggestions = false;
}

function onSuggestionClick(e) {
  if (e.target.nodeName !== 'LI') return;

  const index = getNodeElementIndexFromNodeList(e.target, suggestionList);
  state.currentSearchItem = state.suggestions[index];
  searchTextInput.value = getSearchItemInfo(state);
}

function onMyLocationButtonClick() {
  // get random location from suggestion list
  state.currentSearchItem =
    state.suggestions[Math.floor(Math.random() * state.suggestions.length)];
  searchTextInput.value = getSearchItemInfo(state);
}

async function onGoButtonClick() {
  if (!state.currentSearchItem.city) {
    searchTextInput.focus();
    return;
  }

  searchTextInput.value = '';
  state.recentSearches.unshift(state.currentSearchItem);

  while (state.recentSearches.length > 5) {
    state.recentSearches.pop();
  }

  state.currentSearchListItem = state.currentSearchItem;
  state.propertyOffset = 0;

  propertySpinner.toogleVisibility(true);
  clearChildren(propertyList);
  renderPage('propertyContainer');

  await getProperties();

  state.recentSearches[0].propsCount = state.properties.length;
  localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
  renderSearchList();

  if (!state.properties.length)
    displayZeroPropertiesFoundError(propertySpinner);

  renderProperties();
  propertySpinner.toogleVisibility(false);
  matchesCount.style.display = 'block';
  state.currentSearchItem = {};
}

async function onRecentSearchClick(e) {
  try {
    if (e.target.nodeName !== 'SPAN') return;

    state.propertyOffset = 0;

    const index = getNodeElementIndexFromNodeList(e.target, recentSearchList);
    state.currentSearchListItem = state.recentSearches[index];

    propertySpinner.toogleVisibility(true);
    clearChildren(propertyList);
    renderPage('propertyContainer');

    await getProperties();

    const targetRecentSearch = state.recentSearches.splice(index, 1)[0];
    state.recentSearches.unshift(targetRecentSearch);
    renderSearchList();

    localStorage.setItem(
      'recentSearches',
      JSON.stringify(state.recentSearches)
    );

    if (!state.properties.length)
      displayZeroPropertiesFoundError(propertySpinner);

    renderProperties();
    matchesCount.style.display = 'block';
  } catch (err) {
    console.log(err);
  } finally {
    propertySpinner.toogleVisibility(false);
  }
}

export function onFavesButton(e) {
  clearChildren(propertyList);
  renderPage('propertyContainer');

  for (let property of state.favoriteProperties) {
    createPropertyItem(property, true);
  }

  matchesCount.style.display = 'none';
  loadMoreButton.style.display = 'none';
  emptyFavListMsg.style.display =
    state.favoriteProperties.length === 0 ? 'block' : 'none';
}

function onLoadMoreButtonClick() {
  state.propertyOffset = state.propertyOffset + 20;
  renderProperties();
}

function onPropertyListBackButtonClick() {
  renderPage('searchContainer');
}

function onPropertyDetailsBackButton() {
  renderPage('propertyContainer');
}

export function onPropertyClick(e, isFavorite) {
  const index = getNodeElementIndexFromNodeList(e.currentTarget, propertyList);

  state.currentProperty = isFavorite
    ? state.favoriteProperties[index]
    : state.properties[index];

  renderPropertyDetails();
  renderPage('propertyPageContainer');
}

export function onAddPropertyToFavsButton(e) {
  addPropertyToFavsButton.style.visibility = 'hidden';
  state.favoriteProperties.push(state.currentProperty);

  localStorage.setItem(
    'favoriteProperties',
    JSON.stringify(state.favoriteProperties)
  );
}

export function onPropertyFaveslistBackButton(e) {
  renderPage('searchContainer');
}

export function onErrMsgCloseBtnClick(e) {
  errMsgContainer.style.display = 'none';
}

export function initEventListeners() {
  searchTextInput.addEventListener('focus', onSearchFocus, true);
  searchTextInput.addEventListener('blur', onSearchBlur, true);
  searchTextInput.addEventListener('input', onSearchInput());
  suggestionList.addEventListener('click', onSuggestionClick);
  myLocationButton.addEventListener('click', onMyLocationButtonClick);
  goButton.addEventListener('click', onGoButtonClick);
  recentSearchList.addEventListener('click', onRecentSearchClick);
  loadMoreButton.addEventListener('click', onLoadMoreButtonClick);
  propertyListBackButton.addEventListener(
    'click',
    onPropertyListBackButtonClick
  );
  propertyDetailsBackButton.addEventListener(
    'click',
    onPropertyDetailsBackButton
  );
  addPropertyToFavsButton.addEventListener('click', onAddPropertyToFavsButton);
  favesButton.addEventListener('click', onFavesButton);
  errMsgCloseBtn.addEventListener('click', onErrMsgCloseBtnClick);
}
