import {
  searchTextInput,
  suggestionList,
  recentSearchList,
  myLocationButton,
  goButton,
  loadMoreButton,
  propertyList,
  propertyListBackButton,
  propertySpinnerContainer,
  propertySpinnerCanvas,
  propertyDetailsBackButton,
  addPropertyToFavsButton,
  favesButton,
  matchesCount,
  errMsgCloseBtn,
  errMsgContainer,
  emptyFavListMsg,
} from './elements';
import { state } from '../index';
import {
  renderSuggestions,
  renderSearchList,
  renderProperties,
  renderPropertyDetails,
  renderPage,
  createPropertyItem,
  renderError,
} from './view';
import { getSuggestions, getProperties } from './api';
import Spinner from './spinner';
import { getSearchItemInfo, clearChildren, getNodeElementIndexFromNodeList } from './utils';

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
  state.currentSearchItem = state.suggestions[Math.floor(Math.random() * state.suggestions.length)];
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
  const spinner = new Spinner(propertySpinnerContainer, propertySpinnerCanvas);
  spinner.toogleVisibility(true);
  clearChildren(propertyList);
  renderPage('propertiesList');
  await getProperties();
  state.recentSearches[0].propsCount = state.properties.length;
  localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
  renderSearchList();
  displayZeroPropertiesFoundError(spinner);
  renderProperties();
  spinner.toogleVisibility(false);
  matchesCount.style.display = 'block';
  state.currentSearchItem = {};
}

async function onRecentSearchClick(e) {
  const spinner = new Spinner(propertySpinnerContainer, propertySpinnerCanvas);

  try {
    if (e.target.nodeName !== 'SPAN') return;

    state.propertyOffset = 0;
    const index = getNodeElementIndexFromNodeList(e.target, recentSearchList);
    state.currentSearchListItem = state.recentSearches[index];
    spinner.toogleVisibility(true);
    clearChildren(propertyList);
    renderPage('propertiesList');
    await getProperties();
    state.recentSearches.unshift(state.recentSearches.splice(index, 1)[0]);
    renderSearchList();
    localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    displayZeroPropertiesFoundError(spinner);
    renderProperties();
    matchesCount.style.display = 'block';
  } catch (err) {
    console.log(err);
  } finally {
    spinner.toogleVisibility(false);
  }
}

export function onFavesButton(e) {
  clearChildren(propertyList);
  renderPage('propertiesList');

  for (let property of state.favoriteProperties) {
    createPropertyItem(property, true);
  }
  matchesCount.style.display = 'none';
  loadMoreButton.style.display = 'none';
  state.favoriteProperties.length === 0
    ? (emptyFavListMsg.style.display = 'block')
    : (emptyFavListMsg.style.display = 'none');
}

function onLoadMoreButtonClick() {
  state.propertyOffset = state.propertyOffset + 20;
  renderProperties();
}

function onPropertyListBackButtonClick() {
  renderPage('search');
}

function onPropertyDetailsBackButton() {
  renderPage('propertiesList');
}

export function onPropertyClick(e, isFav) {
  const index = getNodeElementIndexFromNodeList(e.currentTarget, propertyList);
  state.currentProperty = isFav ? state.favoriteProperties[index] : state.properties[index];
  renderPropertyDetails();
  renderPage('propertyDetails');
}

export function onAddPropertyToFavsButton(e) {
  addPropertyToFavsButton.style.visibility = 'hidden';
  state.favoriteProperties.push(state.currentProperty);
  localStorage.setItem('favoriteProperties', JSON.stringify(state.favoriteProperties));
}

export function onPropertyFaveslistBackButton(e) {
  renderPage('search');
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
  propertyListBackButton.addEventListener('click', onPropertyListBackButtonClick);
  propertyDetailsBackButton.addEventListener('click', onPropertyDetailsBackButton);
  addPropertyToFavsButton.addEventListener('click', onAddPropertyToFavsButton);
  favesButton.addEventListener('click', onFavesButton);
  errMsgCloseBtn.addEventListener('click', onErrMsgCloseBtnClick);
}
