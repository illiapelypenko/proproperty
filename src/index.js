import './styles/main.scss';

const form = document.querySelector('.search__form');
const goBtn = document.querySelector('.search__go-btn');
const myLocationBtn = document.querySelector('.search__myLocation-btn');
const searchInput = document.querySelector('.search__input');
const searchList = document.querySelector('.recent-searches__items');
const searchSuggestion = document.querySelector('.search__suggestions');

const state = {
  searches: [], // locations[{}]
};

function initEventListeners() {
  searchInput.addEventListener('input', async e => {
    console.log('change');
    const autoSuggestion = await getLocations(e.target.value);
    console.log(autoSuggestion);
  });
  goBtn.addEventListener('click', async e => {
    // const nearestLocations = await getLocations(searchInput.value);
    // state.searches.push(nearestLocations);
    // console.log(nearestLocations);
    // updateSearchList();
    searchSuggestion.classList.toggle('search__suggestions--show');
  });
}

async function getLocations(location) {
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
    return data.autocomplete;
  } catch (e) {
    console.log(e);
  }
}

function updateSearchList() {
  let searchListInnerHtml = '';
  for (let search of state.searches) {
    searchListInnerHtml += `<li class="recent-searches__item"><span>Search #${state.searches.indexOf(
      search
    )} (${search.length})</span></li>`;
  }
  searchList.innerHTML = searchListInnerHtml;
}

async function init() {
  initEventListeners();
}

init();
