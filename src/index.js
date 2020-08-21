import './styles/main.scss';
import { setSpinner } from './components/spinner';
import { renderSearchList } from './components/view';
import { getSuggestions } from './components/api';
import { initEventListeners } from './components/eventListeners';

export const SEARCH_TEXT_INPUT = document.querySelector('.search__input');
export const SUGGESTION_LIST = document.querySelector('.search__suggestions');
export const GO_BUTTON = document.querySelector('.search__go-btn');
export const MY_LOCATION_BUTTON = document.querySelector(
  '.search__myLocation-btn'
);
export const RECENT_SEARCHES_LIST = document.querySelector(
  '.recent-searches__items'
);

export const state = {
  currentSearchItem: {}, // sugestion
  suggestions: [], // sugestion[]
  recentSearches: [], // {suggestion[] }
  showSuggestions: false,
  currentSearchListItem: {}, // recentSearch
};

function setRecentSearchesFromLocalStorage() {
  const recentSearchesInStorage = localStorage.getItem('recentSearches');
  if (recentSearchesInStorage) {
    state.recentSearches = JSON.parse(recentSearchesInStorage);
  }
}

async function init() {
  try {
    setSpinner(true);
    setRecentSearchesFromLocalStorage();
    renderSearchList();
    initEventListeners();
    await getSuggestions();
  } catch (e) {
    console.log(e);
  } finally {
    setSpinner(false);
  }
}

init();
