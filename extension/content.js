const APP_URL = "https://www.algoteams.com/";
const XIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" class="xicon-svg" viewBox="0 0 24 24" width="18" height="18">
<path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M13.414 12L19 17.586A1 1 0 0117.586 19L12 13.414 6.414 19A1 1 0 015 17.586L10.586 12 5 6.414A1 1 0 116.414 5L12 10.586 17.586 5A1 1 0 1119 6.414L13.414 12z"
></path>
</svg>`;
const dragHandlebarSVG = `<svg class="handlebar-svg" id="drag-handlebar-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 14" width="2" height="14">
<circle r="1" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 1)"></circle>
<circle r="1" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 7)"></circle>
<circle r="1" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 13)"></circle>
    </svg>`;
const openHandlebarSVG = `<svg class="handlebar-svg" id="open-handlebar-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
    <path fill-rule="evenodd" d="M7.913 19.071l7.057-7.078-7.057-7.064a1 1 0 011.414-1.414l7.764 7.77a1 1 0 010 1.415l-7.764 7.785a1 1 0 01-1.414-1.414z" clip-rule="evenodd"></path>
    </svg>`;
async function main() {
  const currentQuestionTitleSlug = getCurrentQuestionTitleSlug();
  let previousSubmissionId = "";
  const reactRoot = document.createElement("iframe");
  reactRoot.src = `${APP_URL}questions/${currentQuestionTitleSlug}`;
  reactRoot.id = "algoTeams-iframe";
  reactRoot.allow = "clipboard-read; clipboard-write";
  const handlebar = document.createElement("div");
  handlebar.id = "algoTeams-handlebar";
  handlebar.style.minWidth = "8px";
  handlebar.style.userSelect = "none";
  handlebar.style.position = "relative";
  handlebar.style.left = "-4px";
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.display = "none";
  let isResizing = false;
  let initialMousePosition = 0;
  let isOpen = true;
  function startResizing(event) {
    isResizing = true;
    initialMousePosition = event.clientX;
    overlay.style.display = "block";
  }
  handlebar.addEventListener("mousedown", (event) => {
    if (!isOpen) {
      setToggleState(true);
      return;
    }
    startResizing(event);
  });
  handlebar.addEventListener("dragstart", (event) => event.preventDefault());
  function setToggleState(toggleState) {
    if (toggleState) {
      reactRoot.style.display = "block";
      handlebar.innerHTML = dragHandlebarSVG;
      handlebar.style.cursor = "col-resize";
      chrome.storage.local.set({ algoTeamsToggleState: true });
      isOpen = true;
      handlebar.style.zIndex = "10";
    } else {
      reactRoot.style.display = "none";
      handlebar.innerHTML = openHandlebarSVG;
      handlebar.style.cursor = "pointer";
      chrome.storage.local.set({ algoTeamsToggleState: false });
      isOpen = false;
      handlebar.style.zIndex = "0";
    }
  }
  handlebar.addEventListener("dblclick", () => {
    if (isOpen) {
      setToggleState(false);
    }
  });
  function stopResizing() {
    isResizing = false;
    overlay.style.display = "none";
  }
  function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
  const MIN_WIDTH = 350;
  const MAX_WIDTH = 1000;
  function updateWidth(event) {
    if (!isResizing) return;
    const deltaX = initialMousePosition - event.clientX;
    initialMousePosition = event.clientX;
    const currentWidth = parseInt(reactRoot.style.width);
    let newWidth = currentWidth + deltaX;
    if (isOpen && initialMousePosition - window.innerWidth - MIN_WIDTH > -450) {
      setToggleState(false);
      return;
    } else if (
      !isOpen &&
      initialMousePosition - window.innerWidth - MIN_WIDTH < -450
    ) {
      setToggleState(true);
      return;
    }
    if (newWidth < MIN_WIDTH) {
      newWidth = MIN_WIDTH;
      if (
        deltaX < 0 &&
        event.clientX > handlebar.getBoundingClientRect().right
      ) {
        initialMousePosition = event.clientX;
      }
    } else if (newWidth > MAX_WIDTH) {
      newWidth = MAX_WIDTH;
      if (
        deltaX > 0 &&
        event.clientX < handlebar.getBoundingClientRect().left
      ) {
        initialMousePosition = event.clientX;
      }
    } else {
      if (
        deltaX < 0 &&
        event.clientX > handlebar.getBoundingClientRect().right
      ) {
        newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
      } else if (
        deltaX > 0 &&
        event.clientX < handlebar.getBoundingClientRect().left
      ) {
        newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
      } else {
        return;
      }
    }
    reactRoot.style.width = `${newWidth}px`;
    chrome.storage.local.set({ algoTeamsWidth: newWidth });
  }
  window.addEventListener("mousemove", throttle(updateWidth, 16));
  window.addEventListener("mouseup", stopResizing);
  chrome.storage.local.get("algoTeamsToggleState", (result) => {
    var _a;
    const toggleState = (_a = result.algoTeamsToggleState) != null ? _a : true;
    if (toggleState) {
      setToggleState(true);
    } else {
      setToggleState(false);
    }
  });
  chrome.storage.local.get("algoTeamsWidth", (result) => {
    var _a;
    const algoTeamsWidth = (_a = result.algoTeamsWidth) != null ? _a : "525";
    reactRoot.style.width = `${algoTeamsWidth}px`;
  });
  const oldUIElement = document.querySelector("#app");
  if (oldUIElement) {
    chrome.storage.local.get("dismissedOldUIWarningAt", (result) => {
      const dismissedOldUIWarningAt = result.dismissedOldUIWarningAt;
      if (!dismissedOldUIWarningAt) {
        return;
      }
      const currentTimeInMilliseconds = new Date().getTime();
      const timeSinceDismissalInMilliseconds =
        currentTimeInMilliseconds - dismissedOldUIWarningAt;
      if (timeSinceDismissalInMilliseconds < 24192e5) {
        return;
      }
      const newUIWarningBanner = document.createElement("div");
      newUIWarningBanner.style.display = "flex";
      newUIWarningBanner.style.justifyContent = "center";
      newUIWarningBanner.style.alignItems = "center";
      newUIWarningBanner.style.backgroundColor = "#f0ad4e";
      newUIWarningBanner.style.color = "#fff";
      newUIWarningBanner.style.padding = "8px";
      newUIWarningBanner.style.textAlign = "center";
      const warningText = document.createElement("div");
      warningText.textContent =
        "algoTeams is not compatible with the old LeetCode UI. Please switch to the new UI to use algoTeams.";
      warningText.style.flexGrow = "1";
      warningText.style.paddingLeft = "96px";
      newUIWarningBanner.appendChild(warningText);
      const closeButton = document.createElement("div");
      closeButton.innerHTML = XIconSVG;
      closeButton.style.cursor = "pointer";
      closeButton.style.paddingTop = "5px";
      closeButton.style.paddingRight = "8px";
      closeButton.style.fill = "#fff";
      newUIWarningBanner.appendChild(closeButton);
      closeButton.addEventListener("click", () => {
        newUIWarningBanner.style.display = "none";
        const dismissedOldUIWarningAt2 = new Date().getTime();
        chrome.storage.local.set({
          dismissedOldUIWarningAt: dismissedOldUIWarningAt2,
        });
      });
      oldUIElement.prepend(newUIWarningBanner);
      return;
    });
    return;
  }
  const mainContentContainer = await waitForElement(["#qd-content"]);
  mainContentContainer.insertAdjacentElement("afterend", overlay);
  mainContentContainer.insertAdjacentElement("afterend", reactRoot);
  mainContentContainer.insertAdjacentElement("afterend", handlebar);
  let submissionButtonTimer;
  async function handleClickSubmitCodeButton(submission) {
    clearInterval(submissionButtonTimer);
    let currentQuestionTitleSlug = getCurrentQuestionTitleSlug();
    if (!reactRoot.contentWindow || !currentQuestionTitleSlug) {
      return;
    }
    let submissionUrl = constructSubmissionUrl(currentQuestionTitleSlug);
    reactRoot.contentWindow.postMessage(
      {
        extension: "algoTeams",
        button: "submit",
        event: "submit",
        currentProblem: currentQuestionTitleSlug,
        submissionUrl,
        line: 225,
        submission,
      },
      APP_URL
    );
    const acceptedSolutionSelectors = [
      "#qd-content > div.h-full.flex-col > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div.flex.flex-col > div > div.flex.items-center > div > svg",
      "#qd-content > div.h-full.flex-col > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div.flex.flex-col > div > div.flex.items-center > div > span",
    ];
    const startTime = Date.now();
    const selector = acceptedSolutionSelectors[0];
    const timeout = 2e4;
    submissionButtonTimer = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(submissionButtonTimer);
        if (!reactRoot.contentWindow || !currentQuestionTitleSlug) {
          return;
        }
        reactRoot.contentWindow.postMessage(
          {
            extension: "algoTeams",
            button: "submit",
            event: "accepted",
            currentProblem: currentQuestionTitleSlug,
            submissionUrl,
            line: 249,
            submission,
          },
          APP_URL
        );
      } else if (Date.now() - startTime > timeout) {
        clearInterval(submissionButtonTimer);
      }
    }, 100);
  }

  async function handleAcceptedSolution(acceptedSolution) {
    reactRoot.contentWindow.postMessage(
      {
        extension: "algoTeams",
        button: "submit",
        event: "acceptedAnswer",
        acceptedSolution,
      },
      APP_URL
    );
  }

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key == "algoTeamsToggleState") {
        if (newValue == true) {
          setToggleState(true);
        } else {
          setToggleState(false);
        }
      }
      if (key == "algoTeamsWidth") {
        reactRoot.style.width = `${newValue}px`;
      }
      if (key == "algoTeamsDarkMode" && reactRoot.contentWindow) {
        reactRoot.contentWindow.postMessage(
          {
            extension: "algoTeams",
            event: "darkMode",
            isDarkMode: newValue,
          },
          APP_URL
        );
      }
    }
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.key === "submission") {
      handleClickSubmitCodeButton(message.submission);
    }
    if (message.key === "accepted") {
      handleAcceptedSolution(message.submission);
    }
  });

  reactRoot.onload = () => {
    reactRoot.contentWindow.postMessage(
      {
        extension: "algoTeams",
        event: "setURL",
        currentProblem: currentQuestionTitleSlug,
      },
      "*"
    );
  };

  window.addEventListener("message", (event) => {
    if (event.data.type === "openLink") {
      if (event.data.answered) {
        // window.location.href = `https://leetcode.com/problems/${event.data.question}/`;
        //post message to react app to open the question
        reactRoot.contentWindow.postMessage(
          {
            extension: "algoTeams",
            event: "openQuestion",
            currentProblem: event.data.question,
          },
          APP_URL
        );
      } else {
        window.location.href = `https://leetcode.com/problems/${event.data.question}/`;
      }
    }
  });
}

function waitForElement(selectors) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          observer.disconnect();
          return;
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
function getCurrentQuestionTitleSlug() {
  const currentUrl = window.location.href;
  if (currentUrl.startsWith("https://leetcode.com/problems/")) {
    return currentUrl.split("/")[4];
  }
}
function constructSubmissionUrl(titleSlug, submissionId) {
  return `https://leetcode.com/problems/${titleSlug}/submissions/${submissionId}/`;
}

main();
