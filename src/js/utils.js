export function getSearchItemInfo(state) {
  const {
    area_type,
    city,
    state_code
  } = state.currentSearchItem;

  return `${area_type}, ${city}, ${state_code}`;
}

export function clearChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function getNodeElementIndexFromNodeList(nodeElement, nodeList) {
  return Array.from(nodeList.children).findIndex(
    item => item.innerText === nodeElement.innerText
  );
}

export function displayZeroPropertiesFoundError(spinner) {
  renderPage('searchContainer');
  spinner.toogleVisibility(false);
  renderError('No properties found in this area');
  return;
}