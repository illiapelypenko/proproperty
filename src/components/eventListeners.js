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
  propertyListBackButton,
  propertySpinnerContainer,
  propertySpinnerCanvas,
  propertyItem,
  propertyDetailsBackButton,
  addPropertyToFavsButton,
  favesButton,
  propertyFaveslistBackButton,
} from "./domConsts";
import { state } from "../index";
import {
  renderSuggestions,
  renderSearchList,
  renderProperties,
  renderPropertyDetails,
  renderPage,
  renderFavesPage,
} from "./view";
import { getSuggestions, getProperties } from "./api";
import Spinner from "./spinner";

function onSearchFocus() {
  state.showSuggestions = true;
  renderSuggestions();
}

const onSearchInput = (() => {
  // 1 sec delay before fetching data
  let timeout;

  return (e) => {
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
})();

function onSearchBlur() {
  suggestionList.style.height = "0px";
  state.showSuggestions = false;
}

function onSuggestionClick(e) {
  if (e.target.nodeName !== "LI") return;

  const index = Array.from(suggestionList.children).findIndex(
    (item) => item.outerText === e.target.innerText
  );

  state.currentSearchItem = state.suggestions[index];
  const { area_type, city, state_code } = state.currentSearchItem;
  searchTextInput.value = `${area_type}, ${city}, ${state_code}`;
}

function onMyLocationButtonClick() {
  // get random location from suggestion list
  state.currentSearchItem =
    state.suggestions[Math.floor(Math.random() * state.suggestions.length)];
  searchTextInput.value = `${state.currentSearchItem.area_type}, ${state.currentSearchItem.city}, ${state.currentSearchItem.state_code}`;
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

  localStorage.setItem("recentSearches", JSON.stringify(state.recentSearches));
  searchTextInput.value = "";
  renderSearchList();
  state.currentSearchItem = {};
}

async function onRecentSearchClick(e) {
  const spinner = new Spinner(propertySpinnerContainer, propertySpinnerCanvas);

  try {
    if (e.target.nodeName !== "SPAN") return;

    state.propertyOffset = 0;
    const index = Array.from(recentSearchList.children).findIndex(
      (item) => item.outerText === e.target.innerText
    );
    state.currentSearchListItem = state.recentSearches[index];

    while (propertyList.firstChild) {
      propertyList.removeChild(propertyList.firstChild);
    }

    renderPage("propertiesList");

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

function onPropertyListBackButtonClick() {
  renderPage("search");
}

function onPropertyDetailsBackButton() {
  renderPage("propertiesList");
}

export function onPropertyClick(e) {
  const index = Array.from(propertyList.children).findIndex(
    (property) => property === e.currentTarget
  );
  state.currentProperty = state.properties[index];
  renderPropertyDetails();
  renderPage("propertyDetails");
}

export function onAddPropertyToFavsButton(e) {
  state.favoriteProperties.push(state.currentProperty);
  console.log(state.favoriteProperties);
}

export function onFavesButton(e) {
  renderFavesPage();
  renderPage("faves");
}

export function onPropertyFaveslistBackButton(e) {
  renderPage("search");
}

export function initEventListeners() {
  searchTextInput.addEventListener("focus", onSearchFocus, true);
  searchTextInput.addEventListener("blur", onSearchBlur, true);
  searchTextInput.addEventListener("input", onSearchInput);
  suggestionList.addEventListener("click", onSuggestionClick);
  myLocationButton.addEventListener("click", onMyLocationButtonClick);
  goButton.addEventListener("click", onGoButtonClick);
  recentSearchList.addEventListener("click", onRecentSearchClick);
  loadMoreButton.addEventListener("click", onLoadMoreButtonClick);
  propertyListBackButton.addEventListener(
    "click",
    onPropertyListBackButtonClick
  );
  propertyDetailsBackButton.addEventListener(
    "click",
    onPropertyDetailsBackButton
  );
  addPropertyToFavsButton.addEventListener("click", onAddPropertyToFavsButton);
  favesButton.addEventListener("click", onFavesButton);
  propertyFaveslistBackButton.addEventListener(
    "click",
    onPropertyFaveslistBackButton
  );
}
