import './styles/main.scss';
import Spinner from './components/spinner';
import { renderSearchList } from './components/view';
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
};

function setPersistedRecentSearches() {
  const recentSearchesInStorage = localStorage.getItem('recentSearches');

  if (recentSearchesInStorage) {
    state.recentSearches = JSON.parse(recentSearchesInStorage);
  }
}

async function init() {
  const spinner = new Spinner(searchSpinnerContainer, searchSpinnerCanvas);

  try {
    spinner.toogleVisibility(true);
    setPersistedRecentSearches();
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
