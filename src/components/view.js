import { state, SUGGESTION_LIST, RECENT_SEARCHES_LIST } from '../index';

export function renderSuggestions() {
  while (SUGGESTION_LIST.firstChild) {
    SUGGESTION_LIST.removeChild(SUGGESTION_LIST.firstChild);
  }
  const { suggestions, showSuggestions } = state;
  for (let suggestion of suggestions) {
    const { area_type, city, state_code } = suggestion;
    const li = document.createElement('li');
    li.classList.add('search__suggestion');
    li.innerHTML = `${area_type}, ${city}, ${state_code}`;
    SUGGESTION_LIST.appendChild(li);
  }
  if (showSuggestions) {
    const suggestionToShow = 4;
    const suggestionHeight = 56;
    SUGGESTION_LIST.style.height =
      (suggestions.length > suggestionToShow
        ? suggestionToShow * suggestionHeight
        : suggestions.length * suggestionHeight) + 'px';
  }
}

export function renderSearchList() {
  while (RECENT_SEARCHES_LIST.firstChild) {
    RECENT_SEARCHES_LIST.removeChild(RECENT_SEARCHES_LIST.firstChild);
  }
  const { recentSearches } = state;
  for (let search of recentSearches) {
    const { city, area_type } = search;
    const li = document.createElement('li');
    li.classList.add('recent-searches__item');
    const span = document.createElement('span');
    li.appendChild(span);
    span.innerHTML = `Search #${recentSearches.indexOf(search) + 1} ${area_type}, ${city}`;
    RECENT_SEARCHES_LIST.appendChild(li);
  }
}
