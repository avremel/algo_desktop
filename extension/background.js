function sendMessage(submission, key) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        submission,
        key,
      });
    }
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const urlPattern = /leetcode\.com\/problems\/(.+)\/submit\//;
    if (details.method === "POST" && urlPattern.test(details.url)) {
      const submission = decodeURIComponent(
        String.fromCharCode.apply(
          null,
          new Uint8Array(details.requestBody.raw[0].bytes)
        )
      );

      sendMessage(submission, "submission");
    }
  },
  { urls: ["https://leetcode.com/problems/*/submit/"] },
  ["requestBody"]
);

let isSelfInitiated = false;

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (isSelfInitiated) {
      isSelfInitiated = false; // Reset the flag
      return; // Do not process this request
    }
    const match = details.url.match(/\/submissions\/detail\/(\d+)\/check\//);
    if (match && match[1]) {
      const submissionId = match[1];
      checkSubmission(submissionId);
    }
  },
  { urls: ["https://leetcode.com/submissions/detail/*/check/"] }
);

function checkSubmission(submissionId) {
  const checkURL = `https://leetcode.com/submissions/detail/${submissionId}/check/`;
  isSelfInitiated = true; // Set the flag before making the request
  fetch(checkURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.state === "SUCCESS") {
        sendMessage(data, "accepted");
      }
    })
    .catch((error) => {
      console.error("Error fetching submission detail:", error);
    });
}
