import './styles/main.scss';
import { drawSpinner, spinner } from './components/spinner';

const searchInput = document.querySelector('.search__input');
const searchSuggestions = document.querySelector('.search__suggestions');
const goBtn = document.querySelector('.search__go-btn');
const myLocationBtn = document.querySelector('.search__myLocation-btn');
const searchList = document.querySelector('.recent-searches__items');

const state = {
  currentSearchItem: {}, // sugestion
  suggestions: [], // sugestion[]
  recentSearches: [], // {suggestion[] }
  showSuggestions: false,
  currentSearchListItem: {}, // recentSearch
};

async function renderSuggestions() {
  while (searchSuggestions.firstChild) {
    searchSuggestions.removeChild(searchSuggestions.firstChild);
  }
  for (let suggestion of state.suggestions) {
    const li = document.createElement('li');
    li.classList.add('search__suggestion');
    li.dataset.key = `${suggestion._id}`;
    li.innerHTML = `${suggestion.area_type}, ${suggestion.city}, ${suggestion.state_code}`;
    searchSuggestions.appendChild(li);
  }
  if (state.showSuggestions) {
    searchSuggestions.style.height =
      (state.suggestions.length > 4 ? 4 * 56 : state.suggestions.length * 56) +
      'px';
  }
}

function initEventListeners() {
  searchInput.addEventListener(
    'focus',
    () => {
      state.showSuggestions = true;
      renderSuggestions();
    },
    true
  );

  searchInput.addEventListener('input', async e => {
    await getSuggestions(e.target.value);
    renderSuggestions();
  });

  searchInput.addEventListener(
    'blur',
    () => {
      searchSuggestions.style.height = '0px';
      state.showSuggestions = false;
    },
    true
  );

  searchSuggestions.addEventListener('click', e => {
    state.currentSearchItem = state.suggestions.find(
      item => item._id === e.target.dataset.key
    );
    searchInput.value = `${state.currentSearchItem.area_type}, ${state.currentSearchItem.city}, ${state.currentSearchItem.state_code}`;
  });

  myLocationBtn.addEventListener('click', () => {
    // get random location from suggestion list
    state.currentSearchItem =
      state.suggestions[Math.floor(Math.random() * state.suggestions.length)];
    searchInput.value = `${state.currentSearchItem.area_type}, ${state.currentSearchItem.city}, ${state.currentSearchItem.state_code}`;
  });

  goBtn.addEventListener('click', e => {
    // getProperties();
    state.recentSearches.unshift(state.currentSearchItem);
    localStorage.setItem(
      'recentSearches',
      JSON.stringify(state.recentSearches)
    );
    searchInput.value = '';
    updateSearchList();
  });

  searchList.addEventListener('click', e => {
    if (e.target.nodeName === 'SPAN') {
      const index = Array.from(searchList.children).findIndex(
        item => item.outerText === e.target.innerText
      );
      state.currentSearchListItem = state.recentSearches[index];
      console.log(state.currentSearchListItem);
    }
  });
}

async function getSuggestions(location = 'a') {
  if (location === undefined || location === '') {
    location = 'a';
  }
  try {
    const res = await fetch(
      encodeURI(
        `https://realtor.p.rapidapi.com/locations/auto-complete?input=${location}`
      ),
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'realtor.p.rapidapi.com',
          'x-rapidapi-key':
            '912915357fmshd8b3c8fc8fcaa14p122a7ejsnb050b17596f1',
        },
      }
    );
    const data = await res.json();
    state.suggestions = data.autocomplete;
  } catch (e) {
    console.log(e);
  }
}

// async function getProperties() {
//   setSpinner('pending');
//   try {
//     const res = await fetch(
//       `https://realtor.p.rapidapi.com/properties/v2/list-for-sale?sort=relevance&city=${encodeURI(
//         state.currentSearchItem.city
//       )}&limit=500&offset=0&state_code=${encodeURI(
//         state.currentSearchItem.state_code
//       )}`,
//       {
//         method: 'GET',
//         headers: {
//           'x-rapidapi-host': 'realtor.p.rapidapi.com',
//           'x-rapidapi-key':
//             '912915357fmshd8b3c8fc8fcaa14p122a7ejsnb050b17596f1',
//         },
//       }
//     );
//     setSpinner('success');
//   } catch (e) {
//     console.log(e);
//   }
// }

function updateSearchList() {
  while (searchList.firstChild) {
    searchList.removeChild(searchList.firstChild);
  }
  for (let search of state.recentSearches) {
    // if (searchList.children.length < 5) {
    const li = document.createElement('li');
    li.classList.add('recent-searches__item');
    const span = document.createElement('span');
    li.appendChild(span);
    span.innerHTML = `Search #${state.recentSearches.indexOf(search) + 1} ${
      search.area_type
    }, ${search.city}`;
    searchList.appendChild(li);
    // }
  }
}

function init() {
  const recentSearchesInStorage = JSON.parse(
    localStorage.getItem('recentSearches')
  );
  state.recentSearches = recentSearchesInStorage ? recentSearchesInStorage : [];
  updateSearchList();
  setSpinner('pending');
  getSuggestions().then(() => {
    setSpinner('success');
  });
  initEventListeners();
  drawSpinner();
}

function setSpinner(status) {
  if (status === 'success') {
    spinner.classList.add('spinner--hide');
    spinner.style.display = 'none';
  } else if (status === 'pending') {
    spinner.style.display = 'flex';
    spinner.classList.remove('spinner--hide');
  }
}

init();
