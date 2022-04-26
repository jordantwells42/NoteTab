chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.greeting == 'hello'){

      google_search = "https://www.google.com/search?q="
      search_url = google_search + request.search_query
      tab = chrome.tabs.create({url:search_url});
   

      sendResponse({farewell: request.search_query});

    };
  }
);