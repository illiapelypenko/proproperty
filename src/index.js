import './styles/main.scss';
import Spinner from './components/spinner';
import { renderSearchList, renderError } from './components/view';
import { getSuggestions } from './components/api';
import { initEventListeners } from './components/eventListeners';
import { searchSpinnerContainer, searchSpinnerCanvas } from './components/elements';

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
  const spinner = new Spinner(searchSpinnerContainer, searchSpinnerCanvas);

  try {
    spinner.toogleVisibility(true);
    getPersistedData();
    renderSearchList();
    initEventListeners();
    await getSuggestions();
  } catch (err) {
    console.log(err);
  } finally {
    spinner.toogleVisibility(false);
  }
}

init();
