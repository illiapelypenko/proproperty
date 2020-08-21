import { state, SUGGESTION_LIST, RECENT_SEARCHES_LIST } from '../index';

export async function renderSuggestions() {
  while (SUGGESTION_LIST.firstChild) {
    SUGGESTION_LIST.removeChild(SUGGESTION_LIST.firstChild);
  }
  for (let suggestion of state.suggestions) {
    const li = document.createElement('li');
    li.classList.add('search__suggestion');
    li.dataset.key = `${suggestion._id}`;
    li.innerHTML = `${suggestion.area_type}, ${suggestion.city}, ${suggestion.state_code}`;
    SUGGESTION_LIST.appendChild(li);
  }
  if (state.showSuggestions) {
    SUGGESTION_LIST.style.height =
      (state.suggestions.length > 4 ? 4 * 56 : state.suggestions.length * 56) +
      'px';
  }
}

export function renderSearchList() {
  while (RECENT_SEARCHES_LIST.firstChild) {
    RECENT_SEARCHES_LIST.removeChild(RECENT_SEARCHES_LIST.firstChild);
  }
  for (let search of state.recentSearches) {
    const li = document.createElement('li');
    li.classList.add('recent-searches__item');
    const span = document.createElement('span');
    li.appendChild(span);
    span.innerHTML = `Search #${state.recentSearches.indexOf(search) + 1} ${
      search.area_type
    }, ${search.city}`;
    RECENT_SEARCHES_LIST.appendChild(li);
  }
}
