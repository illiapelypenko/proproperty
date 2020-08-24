import './styles/main.scss';
import { createSpinner } from './components/spinner';
import { renderSearchList } from './components/view';
import { getSuggestions } from './components/api';
import { initEventListeners } from './components/eventListeners';

export const SEARCH_TEXT_INPUT = document.querySelector('.search__input');
export const SUGGESTION_LIST = document.querySelector('.search__suggestions');
export const GO_BUTTON = document.querySelector('.search__go-btn');
export const MY_LOCATION_BUTTON = document.querySelector('.search__myLocation-btn');
export const RECENT_SEARCHES_LIST = document.querySelector('.recent-searches__items');
export const PROPERTY_LIST = document.querySelector('.property-list');
export const MATCHES_COUNT = document.querySelector('.property-container__matches');
export const LOADMORE_BUTTON = document.querySelector('.loadMore-btn');

const setSuggestionSpinner = createSpinner('.spinner', '.spinner-canvas');

export const state = {
  currentSearchItem: {}, // sugestion
  suggestions: [], // sugestion[]
  recentSearches: [], // {suggestion[] }
  showSuggestions: false,
  currentSearchListItem: {}, // recentSearch
  properties: [],
  propertyOffset: 0,
};

function setRecentSearchesFromLocalStorage() {
  const recentSearchesInStorage = localStorage.getItem('recentSearches');
  if (recentSearchesInStorage) {
    state.recentSearches = JSON.parse(recentSearchesInStorage);
  }
}

async function init() {
  try {
    setSuggestionSpinner(true);
    setRecentSearchesFromLocalStorage();
    renderSearchList();
    initEventListeners();
    await getSuggestions();
  } catch (err) {
    console.log(err);
  } finally {
    setSuggestionSpinner(false);
  }
}

init();
