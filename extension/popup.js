const darkModeButton = document.querySelector("#toggle-algoTeams-darkmode");
darkModeButton.addEventListener("click", () => {
  const darkModeState = darkModeButton.checked;
  chrome.storage.local.set({ algoTeamsDarkMode: darkModeState });
});

const instructionsContainer = document.querySelector("#algoTeams-instructions");
const settingsContainer = document.querySelector("#algoTeams-settings");
chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  const currentUrl = tabs[0].url;
  if (currentUrl.includes("https://leetcode.com")) {
    settingsContainer.style.display = "block";
    instructionsContainer.style.display = "none";
    chrome.storage.local.get("algoTeamsDarkMode", (result) => {
      const darkModeState = result.algoTeamsDarkMode ?? true;
      darkModeButton.checked = darkModeState;
    });
  } else {
    settingsContainer.style.display = "none";
    instructionsContainer.style.display = "block";
  }
});

const leetcodeLink = "https://leetcode.com/problems/two-sum";
const leetcodeLinkElement = document.querySelector("#leetcode-link");
leetcodeLinkElement.addEventListener("click", () => {
  chrome.tabs.create({ url: leetcodeLink, active: true });
});
