// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
// function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };

//   chrome.tabs.query(queryInfo, function(tabs) {
//     // chrome.tabs.query invokes the callback with a list of tabs that match the
//     // query. When the popup is opened, there is certainly a window and at least
//     // one tab, so we can safely assume that |tabs| is a non-empty array.
//     // A window can only have one active tab at a time, so the array consists of
//     // exactly one tab.
//     var tab = tabs[0];

//     // A tab is a plain object that provides information about the tab.
//     // See https://developer.chrome.com/extensions/tabs#type-Tab
//     var url = tab.url;

//     // tab.url is only available if the "activeTab" permission is declared.
//     // If you want to see the URL of other tabs (e.g. after removing active:true
//     // from |queryInfo|), then the "tabs" permission is required to see their
//     // "url" properties.
//     console.assert(typeof url == 'string', 'tab.url should be a string');

//     callback(url);
//   });

//   // Most methods of the Chrome extension APIs are asynchronous. This means that
//   // you CANNOT do something like this:
//   //
//   // var url;
//   // chrome.tabs.query(queryInfo, function(tabs) {
//   //   url = tabs[0].url;
//   // });
//   // alert(url); // Shows "undefined", because chrome.tabs.query is async.
// }

function getStreamUrl() {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  renderStatus('getting');
  var searchUrl = 'https://api.twitch.tv/kraken/streams?game=StarCraft+II';
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.setRequestHeader('Accept', 'application/vnd.twitchtv.v3+json');
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    renderStatus("load");
    // Parse and process the response from Google Image Search.
    var streams = x.response.streams;
    var stream;
    var link;
    for(i = 0;i < streams.length;i++) {
      renderStatus(streams[i]._links.self);
      var url = streams[i].channel.url;
      link = $('<p></p>').text(streams[i].channel.name);
      link.data('stream_url', url)
      link.click(function(){
        chrome.tabs.create({'url': $(this).data('stream_url')});
      });
      renderStatus("append");
      $('#stream_list').append(link);
    }
    // if (!response || !response.responseData || !response.responseData.results ||
    //     response.responseData.results.length === 0) {
    //   errorCallback('No response from Google Image search!');
    //   return;
    // }
    // var firstResult = response.responseData.results[0];
    // // Take the thumbnail instead of the full image to get an approximately
    // // consistent image size.
    // var imageUrl = firstResult.tbUrl;
    // var width = parseInt(firstResult.tbWidth);
    // var height = parseInt(firstResult.tbHeight);
    renderStatus("done");
    // callback(imageUrl, width, height);
  };
  x.onerror = function() {
    renderStatus('Network error.');
  };
  x.send();
}

function renderStatus(status) {
  $("#status").text(status);
  if (status == "done") {
    $("#status").hide();
  }
}

$(document).ready(function() {
// document.addEventListener('DOMContentLoaded', function(){
  // getCurrentTabUrl(function(url) {
  //   // Put the image URL in Google search.
  //   renderStatus('Performing Google Image search for ' + url);

  //   getImageUrl(url, function(imageUrl, width, height) {

  //     renderStatus('Search term: ' + url + '\n' +
  //         'Google image search result: ' + imageUrl);
  //     var imageResult = document.getElementById('image-result');
  //     // Explicitly set the width/height to minimize the number of reflows. For
  //     // a single image, this does not matter, but if you're going to embed
  //     // multiple external images in your page, then the absence of width/height
  //     // attributes causes the popup to resize multiple times.
  //     imageResult.width = width;
  //     imageResult.height = height;
  //     imageResult.src = imageUrl;
  //     imageResult.hidden = false;

  //   }, function(errorMessage) {
  //     renderStatus('Cannot display image. ' + errorMessage);
  //   });
  // });
  getStreamUrl();
});
