const SEARCH_TEXT_INPUT = '.search__input';
const SUGGESTION_LIST = '.search__suggestions';
const GO_BUTTON = '.search__go-btn';
const MY_LOCATION_BUTTON = '.search__myLocation-btn';
const RECENT_SEARCH_LIST = '.recent-searches__items';
const PROPERTY_LIST = '.property-list';
const MATCHES_COUNT = '.property-list-container__matches';
const LOAD_MORE_BUTTON = '.loadMore-btn';
const PROPERTY_LIST_BACK_BUTTON = '.property-list-back-btn';
const SEARCH_CONTAINER = '.search-container';
const PROPERTY_CONTAINER = '.property-list-container';
const SEARCH_SPINNER_CONTAINER = '.search-spinner';
const SEARCH_SPINNER_CANVAS = '.search-spinner__canvas';
const PROPERTY_SPINNER_CONTAINER = '.property-list-spinner';
const PROPERTY_SPINNER_CANVAS = '.property-list-spinner__canvas';
const PROPERTY_ITEM = '.property-item';
const PROPERTY_PAGE_CONTAINER = '.property-page-container';
const PROPERTY_PRICE = '.property-price';
const PROPERTY_ADDRESS = '.property-address';
const PROPERTY_THUMBNAIL = '.property-thumbnail';
const PROPERTY_FURNITURE = '.property-furniture';
const PROPERTY_SUMMARY = '.property-summary';
const PROPERTY_DETAILS_BACK_BUTTON = '.property-details-back-btn';
const ADD_PROPERTY_TO_FAVS_BUTTON = '.addPropertyToFavs-btn';
const FAVES_BTN = '.faves-btn';
const ERROR_MSG_CONTAINER = '.error-msg-container';
const ERROR_MSG_CLOSE_BTN = '.error-msg__close-icon path';
const ERROR_MSG_TEXT = '.error-msg__text';
const EMPTY_FAV_LIST_MSG = '.empty-fav-list-msg';

export const emptyFavListMsg = document.querySelector(EMPTY_FAV_LIST_MSG);
export const errMsgText = document.querySelector(ERROR_MSG_TEXT);
export const errMsgCloseBtn = document.querySelector(ERROR_MSG_CLOSE_BTN);
export const errMsgContainer = document.querySelector(ERROR_MSG_CONTAINER);
export const favesButton = document.querySelector(FAVES_BTN);
export const addPropertyToFavsButton = document.querySelector(
  ADD_PROPERTY_TO_FAVS_BUTTON
);
export const propertyDetailsBackButton = document.querySelector(
  PROPERTY_DETAILS_BACK_BUTTON
);
export const propertyPrice = document.querySelector(PROPERTY_PRICE);
export const propertyAddress = document.querySelector(PROPERTY_ADDRESS);
export const propertyThumbnail = document.querySelector(PROPERTY_THUMBNAIL);
export const propertyFurniture = document.querySelector(PROPERTY_FURNITURE);
export const propertySummary = document.querySelector(PROPERTY_SUMMARY);
export const searchTextInput = document.querySelector(SEARCH_TEXT_INPUT);
export const suggestionList = document.querySelector(SUGGESTION_LIST);
export const goButton = document.querySelector(GO_BUTTON);
export const myLocationButton = document.querySelector(MY_LOCATION_BUTTON);
export const recentSearchList = document.querySelector(RECENT_SEARCH_LIST);
export const propertyList = document.querySelector(PROPERTY_LIST);
export const matchesCount = document.querySelector(MATCHES_COUNT);
export const loadMoreButton = document.querySelector(LOAD_MORE_BUTTON);
export const propertyListBackButton = document.querySelector(
  PROPERTY_LIST_BACK_BUTTON
);
export const searchContainer = document.querySelector(SEARCH_CONTAINER);
export const propertyContainer = document.querySelector(PROPERTY_CONTAINER);
export const searchSpinnerContainer = document.querySelector(
  SEARCH_SPINNER_CONTAINER
);
export const searchSpinnerCanvas = document.querySelector(
  SEARCH_SPINNER_CANVAS
);
export const propertySpinnerContainer = document.querySelector(
  PROPERTY_SPINNER_CONTAINER
);
export const propertySpinnerCanvas = document.querySelector(
  PROPERTY_SPINNER_CANVAS
);
export const propertyItem = document.querySelector(PROPERTY_ITEM);
export const propertyPageContainer = document.querySelector(
  PROPERTY_PAGE_CONTAINER
);
