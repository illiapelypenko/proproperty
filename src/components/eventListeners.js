import {
  searchTextInput,
  suggestionList,
  recentSearchList,
  myLocationButton,
  goButton,
  loadMoreButton,
  propertyList,
  searchContainer,
  propertyContainer,
  backButton,
  propertySpinnerContainer,
  propertySpinnerCanvas,
} from './elements';
import { state } from '../index';
import { renderSuggestions, renderSearchList, renderProperties } from './view';
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

function onGoButtonClick() {
  if (!state.currentSearchItem.city) {
    searchTextInput.focus();
    return;
  }

  state.recentSearches.unshift(state.currentSearchItem);

  while (state.recentSearches.length > 5) {
    state.recentSearches.pop();
  }

  localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
  searchTextInput.value = '';
  renderSearchList();
  state.currentSearchItem = {};
}

async function onRecentSearchClick(e) {
  const spinner = new Spinner(propertySpinnerContainer, propertySpinnerCanvas);

  try {
    if (e.target.nodeName !== 'SPAN') return;

    state.propertyOffset = 0;

    const index = getNodeElementIndexFromNodeList(e.target, recentSearchList);

    state.currentSearchListItem = state.recentSearches[index];

    clearChildren(propertyList);

    propertyContainer.style.display = 'flex';
    searchContainer.style.display = 'none';

    spinner.toogleVisibility(true);
    await getProperties();
    renderProperties();
  } catch (err) {
    console.log(err);
  } finally {
    spinner.toogleVisibility(false);
  }
}

function onLoadMoreButtonClick() {
  state.propertyOffset = state.propertyOffset + 20;
  renderProperties();
}

function onBackButtonClick() {
  propertyContainer.style.display = 'none';
  searchContainer.style.display = 'flex';
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
  backButton.addEventListener('click', onBackButtonClick);
}
