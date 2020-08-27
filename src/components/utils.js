export function getSearchItemInfo() {
  const { area_type, city, state_code } = state.currentSearchItem;
  return `${area_type}, ${city}, ${state_code}`;
}

export function clearChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
