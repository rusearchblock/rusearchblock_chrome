const SUFFIX = " -и";
const QUERY_PARAM = "q";
let searchValueProcessed = false;
let titleProcessed = false;
let observerDisconnected = false;

function adjustQueryString() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  if (!params.has(QUERY_PARAM)) {
    return true;
  }

  const qValue = params.get(QUERY_PARAM);
  if (qValue.endsWith(SUFFIX)) {
    return true;
  }

  params.set(QUERY_PARAM, qValue + SUFFIX);
  url.search = params.toString();
  window.location.href = url.toString();
  return false;
}

function removeSuffix(str, suffix) {
  return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str;
}

function titleWithoutAddedParam(inputString) {
  const SEPARATOR = " - ";
  const parts = inputString.split(SEPARATOR);
  const gPart = parts.pop();
  return removeSuffix(parts.join(SEPARATOR), SUFFIX) + SEPARATOR + gPart;
}

function handleMutation(mutation, observer) {
  if (observerDisconnected) {
    return;
  }

  mutation.addedNodes.forEach((node) => {
    if (node.nodeName === "TEXTAREA" && !searchValueProcessed) {
      node.value = removeSuffix(node.value, SUFFIX);
      searchValueProcessed = true;
    }
    if (node.nodeName === "TITLE" && !titleProcessed) {
      node.textContent = titleWithoutAddedParam(node.textContent);
      titleProcessed = true;
    }
  });

  if (searchValueProcessed && titleProcessed) {
    observer.disconnect();
    observerDisconnected = true;
  }
}

function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => handleMutation(mutation, observer));
  });

  observer.observe(document.getRootNode(), {
    childList: true,
    subtree: true,
  });
}

if (adjustQueryString()) {
  setupMutationObserver();
}
