import './styles/main.scss';

const searchInput = document.querySelector('.search__input');
const searchSuggestions = document.querySelector('.search__suggestions');
const goBtn = document.querySelector('.search__go-btn');
const searchList = document.querySelector('.recent-searches__items');

const state = {
  currentSearchItem: {}, // sugestion
  suggestions: [], // sugestion[]
  recentSearches: [], // {suggestion, listForSale}[]
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
  if (!searchSuggestions.classList.contains('search__suggestions--show'))
    searchSuggestions.classList.add('search__suggestions--show');
}

function initEventListeners() {
  searchInput.addEventListener(
    'focus',
    () => {
      if (state.suggestions.length > 0) {
        renderSuggestions();
      }
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
      searchSuggestions.classList.remove('search__suggestions--show');
    },
    true
  );

  // searchSuggestions.addEventListener('click', e => {
  //   if (e.target.type === 'LI') {
  //     state.currentSearchItem = state.suggestions.find(
  //       item => item._id === e.target.dataset.key
  //     );
  //     searchInput.value = state.currentSearchItem.city;
  //   }
  // });

  goBtn.addEventListener('click', e => {
    getProperties();
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
            '578f2bbbc4mshbe9e783d81242a9p10564djsnaa7555df70d7',
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
//             '578f2bbbc4mshbe9e783d81242a9p10564djsnaa7555df70d7',
//         },
//       }
//     );
//     state.recentSearches.push(await res.json());
//     localStorage.setItem(
//       'recentSearches',
//       JSON.stringify(state.recentSearches)
//     );
//     updateSearchList();
//   } catch (e) {
//     console.log(e);
//   }
// }

// function updateSearchList() {
//   console.log(state.recentSearches);
//   let searchListInnerHtml = '';
//   for (let search of state.recentSearches) {
//     searchListInnerHtml += `<li class="recent-searches__item"><span>Search #${
//       state.recentSearches.indexOf(search) + 1
//     } (${search.properties.length})</span></li>`;
//   }
//   searchList.innerHTML = searchListInnerHtml;
// }

function init() {
  getSuggestions().then(
    () => (searchInput.placeholder = 'find and pick a place from the list')
  );
  initEventListeners();
}

init();
