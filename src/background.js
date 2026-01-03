/* global psl */

const LINKEDIN_CONTAINER_DETAILS = {
  name: "LinkedIn",
  color: "blue",
  icon: "fingerprint"
};

const LINKEDIN_DOMAINS = [
  // Core LinkedIn
  "linkedin.com", "www.linkedin.com",
  
  // CDN
  "licdn.com", "static.licdn.com", "media.licdn.com",
  "static-exp1.licdn.com", "static-exp2.licdn.com",
  "media-exp1.licdn.com", "media-exp2.licdn.com",
  
  // Tracking & Analytics (PRIMARY TARGETS)
  "linkedin-ei.com", "www.linkedin-ei.com",
  "px.ads.linkedin.com", "ads.linkedin.com",
  "dc.ads.linkedin.com", "snap.licdn.com",
  
  // API & Platform
  "api.linkedin.com", "platform.linkedin.com",
  "developer.linkedin.com", "badges.linkedin.com",
  
  // Business Products
  "business.linkedin.com", "sales.linkedin.com",
  "learning.linkedin.com", "recruiter.linkedin.com",
  "talent.linkedin.com", "marketing.linkedin.com",
  
  // Communication
  "msg.linkedin.com", "notifications.linkedin.com",
  
  // URL Shortener
  "lnkd.in",
  
  // Owned Properties (for maximum privacy)
  "lynda.com", "www.lynda.com", "cdn.lynda.com",
  "slideshare.net", "www.slideshare.net", "cdn.slideshare.net"
];

const DEFAULT_SETTINGS = {
  hideRelayEmailBadges: false,
};

const MAC_ADDON_ID = "@testpilot-containers";
const RELAY_ADDON_ID = "private-relay@firefox.com";

let macAddonEnabled = false;
let relayAddonEnabled = false;
let linkedInCookieStoreId = null;

// TODO: refactor canceledRequests and tabsWaitingToLoad into tabStates
const canceledRequests = {};
const tabsWaitingToLoad = {};
const tabStates = {};

const linkedInHostREs = [];

async function updateSettings(data){
  await browser.storage.local.set({
    "settings": data
  });
}

async function checkSettings(setting){
  let fbcStorage = await browser.storage.local.get();

  if (setting) {
    return fbcStorage.settings[setting];
  }

  if (fbcStorage.settings) {
    return fbcStorage.settings;
  }

  await browser.storage.local.set({
    "settings": DEFAULT_SETTINGS
  });

}


async function isRelayAddonEnabled () {
  try {
    const relayAddonInfo = await browser.management.get(RELAY_ADDON_ID);
    if (relayAddonInfo.enabled) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

async function isMACAddonEnabled () {
  try {
    const macAddonInfo = await browser.management.get(MAC_ADDON_ID);
    if (macAddonInfo.enabled) {
      sendJailedDomainsToMAC();
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

async function setupMACAddonListeners () {
  browser.runtime.onMessageExternal.addListener((message, sender) => {
    if (sender.id !== "@testpilot-containers") {
      return;
    }
    switch (message.method) {
    case "MACListening":
      sendJailedDomainsToMAC();
      break;
    }
  });
  function disabledExtension (info) {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = false;
    }
    if (info.id === RELAY_ADDON_ID) {
      relayAddonEnabled = false;
    }
  }
  function enabledExtension (info) {
    if (info.id === MAC_ADDON_ID) {
      macAddonEnabled = true;
    }
    if (info.id === RELAY_ADDON_ID) {
      relayAddonEnabled = true;
    }
  }
  browser.management.onInstalled.addListener(enabledExtension);
  browser.management.onEnabled.addListener(enabledExtension);
  browser.management.onUninstalled.addListener(disabledExtension);
  browser.management.onDisabled.addListener(disabledExtension);
}

async function sendJailedDomainsToMAC () {
  try {
    return await browser.runtime.sendMessage(MAC_ADDON_ID, {
      method: "jailedDomains",
      urls: LINKEDIN_DOMAINS.map((domain) => {
        return `https://${domain}/`;
      })
    });
  } catch (e) {
    // We likely might want to handle this case: https://github.com/mozilla/contain-linkedin/issues/113#issuecomment-380444165
    return false;
  }
}

async function getMACAssignment (url) {
  if (!macAddonEnabled) {
    return false;
  }

  try {
    const assignment = await browser.runtime.sendMessage(MAC_ADDON_ID, {
      method: "getAssignment",
      url
    });
    return assignment;
  } catch (e) {
    return false;
  }
}

function cancelRequest (tab, options) {
  // we decided to cancel the request at this point, register canceled request
  canceledRequests[tab.id] = {
    requestIds: {
      [options.requestId]: true
    },
    urls: {
      [options.url]: true
    }
  };

  // since webRequest onCompleted and onErrorOccurred are not 100% reliable
  // we register a timer here to cleanup canceled requests, just to make sure we don't
  // end up in a situation where certain urls in a tab.id stay canceled
  setTimeout(() => {
    if (canceledRequests[tab.id]) {
      delete canceledRequests[tab.id];
    }
  }, 2000);
}

function shouldCancelEarly (tab, options) {
  // we decided to cancel the request at this point
  if (!canceledRequests[tab.id]) {
    cancelRequest(tab, options);
  } else {
    let cancelEarly = false;
    if (canceledRequests[tab.id].requestIds[options.requestId] ||
        canceledRequests[tab.id].urls[options.url]) {
      // same requestId or url from the same tab
      // this is a redirect that we have to cancel early to prevent opening two tabs
      cancelEarly = true;
    }
    // register this requestId and url as canceled too
    canceledRequests[tab.id].requestIds[options.requestId] = true;
    canceledRequests[tab.id].urls[options.url] = true;
    if (cancelEarly) {
      return true;
    }
  }
  return false;
}

function generateLinkedInHostREs () {
  for (let linkedInDomain of LINKEDIN_DOMAINS) {
    linkedInHostREs.push(new RegExp(`^(.*\\.)?${linkedInDomain}$`));
  }
}

async function clearLinkedInCookies () {
  // Clear all LinkedIn cookies
  const containers = await browser.contextualIdentities.query({});
  containers.push({
    cookieStoreId: "firefox-default"
  });

  let macAssignments = [];
  if (macAddonEnabled) {
    const promises = LINKEDIN_DOMAINS.map(async linkedInDomain => {
      const assigned = await getMACAssignment(`https://${linkedInDomain}/`);
      return assigned ? linkedInDomain : null;
    });
    macAssignments = await Promise.all(promises);
  }

  LINKEDIN_DOMAINS.map(async linkedInDomain => {
    const linkedInCookieUrl = `https://${linkedInDomain}/`;

    // dont clear cookies for linkedInDomain if mac assigned (with or without www.)
    if (macAddonEnabled &&
        (macAssignments.includes(linkedInDomain) ||
         macAssignments.includes(`www.${linkedInDomain}`))) {
      return;
    }

    containers.map(async container => {
      const storeId = container.cookieStoreId;
      if (storeId === linkedInCookieStoreId) {
        // Don't clear cookies in the LinkedIn Container
        return;
      }

      const cookies = await browser.cookies.getAll({
        domain: linkedInDomain,
        storeId
      });

      cookies.map(cookie => {
        browser.cookies.remove({
          name: cookie.name,
          url: linkedInCookieUrl,
          storeId
        });
      });
      // Also clear Service Workers as it breaks detecting onBeforeRequest
      await browser.browsingData.remove({hostnames: [linkedInDomain]}, {serviceWorkers: true});
    });
  });
}

async function setupContainer () {
  // Use existing LinkedIn container, or create one

  const info = await browser.runtime.getBrowserInfo();
  if (parseInt(info.version) < 67) {
    LINKEDIN_CONTAINER_DETAILS.color = "blue";
    LINKEDIN_CONTAINER_DETAILS.icon = "briefcase";
  }

  const contexts = await browser.contextualIdentities.query({name: LINKEDIN_CONTAINER_DETAILS.name});
  if (contexts.length > 0) {
    const linkedInContext = contexts[0];
    linkedInCookieStoreId = linkedInContext.cookieStoreId;
    // Make existing LinkedIn container the correct icon if needed
    if (linkedInContext.color !== LINKEDIN_CONTAINER_DETAILS.color ||
        linkedInContext.icon !== LINKEDIN_CONTAINER_DETAILS.icon
    ) {
      await browser.contextualIdentities.update(
        linkedInCookieStoreId,
        { color: LINKEDIN_CONTAINER_DETAILS.color, icon: LINKEDIN_CONTAINER_DETAILS.icon }
      );
    }
  } else {
    const context = await browser.contextualIdentities.create(LINKEDIN_CONTAINER_DETAILS);
    linkedInCookieStoreId = context.cookieStoreId;
  }
  // Initialize domainsAddedToLinkedInContainer if needed
  const licStorage = await browser.storage.local.get();
  if (!licStorage.domainsAddedToLinkedInContainer) {
    await browser.storage.local.set({"domainsAddedToLinkedInContainer": []});
  }
}

async function maybeReopenTab (url, tab, request) {
  const macAssigned = await getMACAssignment(url);
  if (macAssigned) {
    // We don't reopen MAC assigned urls
    return;
  }
  const cookieStoreId = await shouldContainInto(url, tab);
  if (!cookieStoreId) {
    // Tab doesn't need to be contained
    return;
  }

  if (request && shouldCancelEarly(tab, request)) {
    // We need to cancel early to prevent multiple reopenings
    return {cancel: true};
  }

  await browser.tabs.create({
    url,
    cookieStoreId,
    active: tab.active,
    index: tab.index,
    windowId: tab.windowId
  });
  browser.tabs.remove(tab.id);

  return {cancel: true};
}

const rootDomainCache = {};

function getRootDomain(url) {
  if (url in rootDomainCache) {
    // After storing 128 entries, it will delete the oldest each time.
    const returnValue = rootDomainCache[url];
    if (Object.keys(rootDomainCache).length > 128) {
      delete rootDomainCache[(Object.keys(rootDomainCache)[0])];
    }
    return returnValue;
  }

  const urlObject = new URL(url);
  if (urlObject.hostname === "") { return false; }
  const parsedUrl = psl.parse(urlObject.hostname);

  rootDomainCache[url] = parsedUrl.domain;
  return parsedUrl.domain;

}


function isLinkedInURL (url) {
  const parsedUrl = new URL(url);
  for (let linkedInHostRE of linkedInHostREs) {
    if (linkedInHostRE.test(parsedUrl.host)) {
      return true;
    }
  }
  return false;
}

// TODO: refactor parsedUrl "up" so new URL doesn't have to be called so much
// TODO: refactor licStorage "up" so browser.storage.local.get doesn't have to be called so much
async function addDomainToLinkedInContainer (url) {
  const licStorage = await browser.storage.local.get();
  const rootDomain = getRootDomain(url);
  licStorage.domainsAddedToLinkedInContainer.push(rootDomain);
  await browser.storage.local.set({"domainsAddedToLinkedInContainer": licStorage.domainsAddedToLinkedInContainer});
}

async function removeDomainFromLinkedInContainer (domain) {
  const licStorage = await browser.storage.local.get();
  const domainIndex = licStorage.domainsAddedToLinkedInContainer.indexOf(domain);
  licStorage.domainsAddedToLinkedInContainer.splice(domainIndex, 1);
  await browser.storage.local.set({"domainsAddedToLinkedInContainer": licStorage.domainsAddedToLinkedInContainer});
}

async function isAddedToLinkedInContainer (url) {
  const licStorage = await browser.storage.local.get();
  const rootDomain = getRootDomain(url);
  if (licStorage.domainsAddedToLinkedInContainer.includes(rootDomain)) {
    return true;
  }
  return false;
}

async function shouldContainInto (url, tab) {
  if (!url.startsWith("http")) {
    // we only handle URLs starting with http(s)
    return false;
  }

  const hasBeenAddedToLinkedInContainer = await isAddedToLinkedInContainer(url);

  if (isLinkedInURL(url) || hasBeenAddedToLinkedInContainer) {
    if (tab.cookieStoreId !== linkedInCookieStoreId) {
      // LinkedIn-URL outside of LinkedIn Container Tab
      // Should contain into LinkedIn Container
      return linkedInCookieStoreId;
    }
  } else if (tab.cookieStoreId === linkedInCookieStoreId) {
    // Non-LinkedIn-URL inside LinkedIn Container Tab
    // Should contain into Default Container
    return "firefox-default";
  }

  return false;
}

async function maybeReopenAlreadyOpenTabs () {
  const tabsOnUpdated = (tabId, changeInfo, tab) => {
    if (changeInfo.url && tabsWaitingToLoad[tabId]) {
      // Tab we're waiting for switched it's url, maybe we reopen
      delete tabsWaitingToLoad[tabId];
      maybeReopenTab(tab.url, tab);
    }
    if (tab.status === "complete" && tabsWaitingToLoad[tabId]) {
      // Tab we're waiting for completed loading
      delete tabsWaitingToLoad[tabId];
    }
    if (!Object.keys(tabsWaitingToLoad).length) {
      // We're done waiting for tabs to load, remove event listener
      browser.tabs.onUpdated.removeListener(tabsOnUpdated);
    }
  };

  // Query for already open Tabs
  const tabs = await browser.tabs.query({});
  tabs.map(async tab => {
    if (tab.url === "about:blank") {
      if (tab.status !== "loading") {
        return;
      }
      // about:blank Tab is still loading, so we indicate that we wait for it to load
      // and register the event listener if we haven't yet.
      //
      // This is a workaround until platform support is implemented:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1447551
      // https://github.com/mozilla/multi-account-containers/issues/474
      tabsWaitingToLoad[tab.id] = true;
      if (!browser.tabs.onUpdated.hasListener(tabsOnUpdated)) {
        browser.tabs.onUpdated.addListener(tabsOnUpdated);
      }
    } else {
      // Tab already has an url, maybe we reopen
      maybeReopenTab(tab.url, tab);
    }
  });
}

function stripLinkedInTracking(url) {
  const strippedUrl = new URL(url);
  const trackingParams = ["li_source", "li_medium", "trk", "trkInfo", "lipi", "licu", "original_referer"];
  trackingParams.forEach(param => strippedUrl.searchParams.delete(param));
  return strippedUrl.href;
}

async function getActiveTab () {
  const [activeTab] = await browser.tabs.query({currentWindow: true, active: true});
  return activeTab;
}

async function windowFocusChangedListener (windowId) {
  if (windowId !== browser.windows.WINDOW_ID_NONE) {
    const activeTab = await getActiveTab();
    updateBrowserActionIcon(activeTab);
  }
}

function tabUpdateListener (tabId, changeInfo, tab) {
  updateBrowserActionIcon(tab);
}

/*
async function areAllStringsTranslated () {
  const browserUILanguage = browser.i18n.getUILanguage();
  if (browserUILanguage && browserUILanguage.startsWith("en")) {
    return true;
  }
  const enMessagesPath = browser.extension.getURL("_locales/en/messages.json");
  const resp = await fetch(enMessagesPath);
  const enMessages = await resp.json();

  // TODO: Check Pontoon for available translations instead of checking
  // messages files
  for (const key of Object.keys(enMessages)){
    // TODO: this doesn't check if the add-on messages are translated into
    // any other browser.i18n.getAcceptedLanguages() options ... but then,
    // I don't think browser.i18n let's us get messages in anything but the
    // primary language anyway? Does browser.i18n.getMessage automatically
    // check for secondary languages?
    const enMessage = enMessages[key].message;
    const translatedMessage = browser.i18n.getMessage(key);
    if (translatedMessage == enMessage) {
      return false;
    }
  }
  return true;
}
*/

async function updateBrowserActionIcon (tab) {

  browser.browserAction.setBadgeText({text: ""});

  const url = tab.url;
  const hasBeenAddedToLinkedInContainer = await isAddedToLinkedInContainer(url);
  const aboutPageURLCheck = url.startsWith("about:");

  if (isLinkedInURL(url)) {
    // TODO: change panel logic from browser.storage to browser.runtime.onMessage
    // so the panel.js can "ask" background.js which panel it should show
    browser.storage.local.set({"CURRENT_PANEL": "on-linkedin"});
    browser.browserAction.setPopup({tabId: tab.id, popup: "./panel.html"});
  } else if (hasBeenAddedToLinkedInContainer) {
    browser.storage.local.set({"CURRENT_PANEL": "in-lic"});
  } else if (aboutPageURLCheck) {
    // Sets CURRENT_PANEL if current URL is an internal about: page
    browser.storage.local.set({"CURRENT_PANEL": "about"});
  } else {
    const tabState = tabStates[tab.id];
    const panelToShow = (tabState && tabState.trackersDetected) ? "trackers-detected" : "no-trackers";
    browser.storage.local.set({"CURRENT_PANEL": panelToShow});
    browser.browserAction.setPopup({tabId: tab.id, popup: "./panel.html"});
    browser.browserAction.setBadgeBackgroundColor({color: "#0A66C2"});
    if ( panelToShow === "trackers-detected" ) {
      browser.browserAction.setBadgeText({text: "!"});
    }
  }
}

async function containLinkedIn (request) {
  if (tabsWaitingToLoad[request.tabId]) {
    // Cleanup just to make sure we don't get a race-condition with startup reopening
    delete tabsWaitingToLoad[request.tabId];
  }

  // Listen to requests and open LinkedIn into its Container,
  // open other sites into the default tab context
  if (request.tabId === -1) {
    // Request doesn't belong to a tab
    return;
  }

  const tab = await browser.tabs.get(request.tabId);
  updateBrowserActionIcon(tab);

  const url = new URL(request.url);
  const urlSearchParm = new URLSearchParams(url.search);
  const hasLinkedInTracking = ["li_source", "trk", "trkInfo"].some(param => 
    urlSearchParm.has(param)
  );
  
  if (hasLinkedInTracking) {
    return {redirectUrl: stripLinkedInTracking(request.url)};
  }

  return maybeReopenTab(request.url, tab, request);
}

// Lots of this is borrowed from old blok code:
// https://github.com/mozilla/blok/blob/main/src/js/background.js
async function blockLinkedInSubResources (requestDetails) {
  if (requestDetails.type === "main_frame") {
    tabStates[requestDetails.tabId] = { trackersDetected: false };
    return {};
  }

  if (typeof requestDetails.originUrl === "undefined") {
    return {};
  }

  const urlIsLinkedIn = isLinkedInURL(requestDetails.url);
  // If this request isn't going to LinkedIn, let's return {} ASAP
  if (!urlIsLinkedIn) {
    return {};
  }

  const originUrlIsLinkedIn = isLinkedInURL(requestDetails.originUrl);

  if (originUrlIsLinkedIn) {
    const message = {msg: "linkedin-domain"};
    // Send the message to the content_script
    browser.tabs.sendMessage(requestDetails.tabId, message);
    return {};
  }

  const hasBeenAddedToLinkedInContainer = await isAddedToLinkedInContainer(requestDetails.originUrl);

  if ( urlIsLinkedIn && !originUrlIsLinkedIn ) {
    if (!hasBeenAddedToLinkedInContainer ) {
      const message = {msg: "blocked-linkedin-subresources"};
      // Send the message to the content_script
      browser.tabs.sendMessage(requestDetails.tabId, message);

      tabStates[requestDetails.tabId] = { trackersDetected: true };
      return {cancel: true};
    } else {
      const message = {msg: "allowed-linkedin-subresources"};
      // Send the message to the content_script
      browser.tabs.sendMessage(requestDetails.tabId, message);
      return {};
    }
  }
  return {};
}

function setupWebRequestListeners() {
  browser.webRequest.onCompleted.addListener((options) => {
    if (canceledRequests[options.tabId]) {
      delete canceledRequests[options.tabId];
    }
  },{urls: ["<all_urls>"], types: ["main_frame"]});
  browser.webRequest.onErrorOccurred.addListener((options) => {
    if (canceledRequests[options.tabId]) {
      delete canceledRequests[options.tabId];
    }
  },{urls: ["<all_urls>"], types: ["main_frame"]});

  // Add the main_frame request listener
  browser.webRequest.onBeforeRequest.addListener(containLinkedIn, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);

  // Add the sub-resource request listener
  browser.webRequest.onBeforeRequest.addListener(blockLinkedInSubResources, {urls: ["<all_urls>"]}, ["blocking"]);
}

function setupWindowsAndTabsListeners() {
  browser.tabs.onUpdated.addListener(tabUpdateListener);
  browser.tabs.onRemoved.addListener(tabId => delete tabStates[tabId] );
  browser.windows.onFocusChanged.addListener(windowFocusChangedListener);
}

async function checkIfTrackersAreDetected(sender) {
  const activeTab = await getActiveTab();
  const tabState = tabStates[activeTab.id];
  const trackersDetected = (tabState && tabState.trackersDetected);
  const onActiveTab = (activeTab.id === sender.tab.id);
  // Check if trackers were blocked,scoped to the active tab.
  return (onActiveTab && trackersDetected);  
}

(async function init () {
  await setupMACAddonListeners();
  macAddonEnabled = await isMACAddonEnabled();
  relayAddonEnabled = await isRelayAddonEnabled();

  try {
    await setupContainer();
  } catch (error) {
    // TODO: Needs backup strategy
    // See https://github.com/mozilla/contain-linkedin/issues/23
    // Sometimes this add-on is installed but doesn't get a linkedInCookieStoreId ?
    // eslint-disable-next-line no-console
    console.error(error);
    return;
  }
  clearLinkedInCookies();
  generateLinkedInHostREs();
  setupWebRequestListeners();
  setupWindowsAndTabsListeners();

  async function messageHandler(request, sender) {
    switch (request.message) {
    case "what-sites-are-added":
      return browser.storage.local.get().then(licStorage => licStorage.domainsAddedToLinkedInContainer);
    case "remove-domain-from-list":
      removeDomainFromLinkedInContainer(request.removeDomain).then( results => results );
      break;
    case "add-domain-to-list":
      addDomainToLinkedInContainer(sender.url).then( results => results);
      break;
    case "get-root-domain":
      return getRootDomain(request.url);
    case "get-relay-enabled":
      return relayAddonEnabled;
    case "update-settings":
      updateSettings(request.settings);
      break;
    case "check-settings":
      return checkSettings();
    case "are-trackers-detected":
      return await checkIfTrackersAreDetected(sender);
    default:
      throw new Error("Unexpected message!");
    }
  }

  browser.runtime.onMessage.addListener(messageHandler);

  maybeReopenAlreadyOpenTabs();

  const activeTab = await getActiveTab();
  updateBrowserActionIcon(activeTab);
})();
