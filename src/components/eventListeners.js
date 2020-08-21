import {
  state,
  SEARCH_TEXT_INPUT,
  SUGGESTION_LIST,
  RECENT_SEARCHES_LIST,
  MY_LOCATION_BUTTON,
  GO_BUTTON,
} from '../index';
import { renderSuggestions, renderSearchList } from './view';
import { getSuggestions } from './api';

function onFocus() {
  state.showSuggestions = true;
  renderSuggestions();
}

async function onInput(e) {
  await getSuggestions(e.target.value);
  renderSuggestions();
}

function onBlur() {
  SUGGESTION_LIST.style.height = '0px';
  state.showSuggestions = false;
}

function onSuggestionClick(e) {
  state.currentSearchItem = state.suggestions.find(
    item => item._id === e.target.dataset.key
  );
  SEARCH_TEXT_INPUT.value = `${state.currentSearchItem.area_type}, ${state.currentSearchItem.city}, ${state.currentSearchItem.state_code}`;
}
function onMyLocationClick() {
  // get random location from suggestion list
  state.currentSearchItem =
    state.suggestions[Math.floor(Math.random() * state.suggestions.length)];
  SEARCH_TEXT_INPUT.value = `${state.currentSearchItem.area_type}, ${state.currentSearchItem.city}, ${state.currentSearchItem.state_code}`;
}
function onGoButtonClick() {
  // getProperties();
  state.recentSearches.unshift(state.currentSearchItem);
  while (state.recentSearches.length > 5) {
    state.recentSearches.pop();
  }
  localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
  SEARCH_TEXT_INPUT.value = '';
  renderSearchList();
}

function onRecentSearchClick(e) {
  if (e.target.nodeName === 'SPAN') {
    const index = Array.from(RECENT_SEARCHES_LIST.children).findIndex(
      item => item.outerText === e.target.innerText
    );
    state.currentSearchListItem = state.recentSearches[index];
    console.log(state.currentSearchListItem);
  }
}

export function initEventListeners() {
  SEARCH_TEXT_INPUT.addEventListener('focus', onFocus, true);
  SEARCH_TEXT_INPUT.addEventListener('blur', onBlur, true);
  SEARCH_TEXT_INPUT.addEventListener('input', onInput);
  SUGGESTION_LIST.addEventListener('click', onSuggestionClick);
  MY_LOCATION_BUTTON.addEventListener('click', onMyLocationClick);
  GO_BUTTON.addEventListener('click', onGoButtonClick);
  RECENT_SEARCHES_LIST.addEventListener('click', onRecentSearchClick);
}
