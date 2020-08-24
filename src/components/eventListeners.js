import {
  state,
  SEARCH_TEXT_INPUT,
  SUGGESTION_LIST,
  RECENT_SEARCHES_LIST,
  MY_LOCATION_BUTTON,
  GO_BUTTON,
  LOADMORE_BUTTON,
  PROPERTY_LIST,
} from '../index';
import { renderSuggestions, renderSearchList, renderProperties } from './view';
import { getSuggestions, getProperties } from './api';

function onFocus() {
  state.showSuggestions = true;
  renderSuggestions();
}

async function onInput(e) {
  try {
    await getSuggestions(e.target.value);
    renderSuggestions();
  } catch (err) {
    console.log(err);
  }
}

function onBlur() {
  SUGGESTION_LIST.style.height = '0px';
  state.showSuggestions = false;
}

function onSuggestionClick(e) {
  if (e.target.nodeName !== 'LI') return;
  const index = Array.from(SUGGESTION_LIST.children).findIndex(
    item => item.outerText === e.target.innerText
  );
  state.currentSearchItem = state.suggestions[index];
  const { area_type, city, state_code } = state.currentSearchItem;
  SEARCH_TEXT_INPUT.value = `${area_type}, ${city}, ${state_code}`;
}
function onMyLocationClick() {
  // get random location from suggestion list
  state.currentSearchItem = state.suggestions[Math.floor(Math.random() * state.suggestions.length)];
  SEARCH_TEXT_INPUT.value = `${state.currentSearchItem.area_type}, ${state.currentSearchItem.city}, ${state.currentSearchItem.state_code}`;
}
function onGoButtonClick() {
  if (!state.currentSearchItem.city) {
    SEARCH_TEXT_INPUT.focus();
    return;
  }

  state.recentSearches.unshift(state.currentSearchItem);
  while (state.recentSearches.length > 5) {
    state.recentSearches.pop();
  }
  localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
  SEARCH_TEXT_INPUT.value = '';
  renderSearchList();
  state.currentSearchItem = {};
}

async function onRecentSearchClick(e) {
  try {
    if (e.target.nodeName !== 'SPAN') return;
    const index = Array.from(RECENT_SEARCHES_LIST.children).findIndex(
      item => item.outerText === e.target.innerText
    );
    state.currentSearchListItem = state.recentSearches[index];
    while (PROPERTY_LIST.firstChild) {
      PROPERTY_LIST.removeChild(PROPERTY_LIST.firstChild);
    }
    await getProperties();
    renderProperties();
  } catch (err) {
    console.log(err);
  }
}

function onLoadMoreButtonClick() {
  state.propertyOffset = state.propertyOffset + 20;
  renderProperties();
}

export function initEventListeners() {
  SEARCH_TEXT_INPUT.addEventListener('focus', onFocus, true);
  SEARCH_TEXT_INPUT.addEventListener('blur', onBlur, true);
  SEARCH_TEXT_INPUT.addEventListener('input', onInput);
  SUGGESTION_LIST.addEventListener('click', onSuggestionClick);
  MY_LOCATION_BUTTON.addEventListener('click', onMyLocationClick);
  GO_BUTTON.addEventListener('click', onGoButtonClick);
  RECENT_SEARCHES_LIST.addEventListener('click', onRecentSearchClick);
  LOADMORE_BUTTON.addEventListener('click', onLoadMoreButtonClick);
}
