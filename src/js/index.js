import '../styles/main.scss';
import { searchSpinner } from './spinner';
import { renderSearchList } from './view';
import { getSuggestions } from './api';
import { initEventListeners } from './eventListeners';

export const state = {
  currentSearchItem: {}, // sugestion
  suggestions: [], // sugestion[]
  recentSearches: [], // {suggestion[] }
  showSuggestions: false,
  currentSearchListItem: {}, // recentSearch
  properties: [], // property[]
  propertyOffset: 0,
  currentProperty: {},
  favoriteProperties: [],
};

function getPersistedData() {
  const recentSearchesInStorage = localStorage.getItem('recentSearches');

  if (recentSearchesInStorage) {
    state.recentSearches = JSON.parse(recentSearchesInStorage);
  }

  const favoriteProperties = localStorage.getItem('favoriteProperties');

  if (favoriteProperties) {
    state.favoriteProperties = JSON.parse(favoriteProperties);
  }
}

async function init() {
  try {
    searchSpinner.toogleVisibility(true);
    getPersistedData();
    renderSearchList();
    initEventListeners();
    await getSuggestions();
  } catch (err) {
    console.log(err);
  } finally {
    searchSpinner.toogleVisibility(false);
  }
}

init();
