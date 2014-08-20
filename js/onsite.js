var $ = require('jquery');
var _ = require('lodash');

// ## Library result format 
// `result.state` this is to show length, false, true or any state needed
// `result.msg` to tell the user if this is good, bad or normal
// `result.recommendation` tell the user some recommendation
// `result.icon` bad, normal or good

;(function(window) {
  'use strict';

  /**
    * Check how many times is present a given value.
    *
    * @param {string} string, The content we want to check.
    * @param {string} keyword, The word we want to find.
    * @returns {integer} Returns how many times is present. 
    * @example
    *
    * contains("Marketing Services", "marketing");
    * // => 1
    *
    * contains("Marketing Marketing", "marketing");
    * // => 2
    *
    * TODO: check if both are strings.
    */
  function contains(str, keyword) {
    str = str || "";
    keyword = keyword || "";

    var kwd = new RegExp(keyword.toLowerCase(), 'gi'),
      matches = str.toLowerCase().match(kwd) || "";

    return matches.length;
  }

  /**
    * Will transform "Something like this & this" into 
    * "something-like-this-this".
    *
    * @param {string} str, Text we want to slugify.
    * @returns {string} The text slugified.
    * @exampple
    *
    * slugify("Hello World & You!");
    * // => "hello-world-you"
    */
  function slugify(str) {
    var from = 'àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;',
      to = 'aaaaaeeeeiiiiooooouuuunc------',
      i = from.length;

    while( --i >= 0 ) {
      str = str.replace(new RegExp(from.charAt(i), 'gi'), to.charAt(i));
    }

    return str.replace(/^\s+|\s+$/g, '') //trim
      .replace(/[^-a-zA-Z0-9\s]+/ig, '')
      .replace(/\s/gi, "-")
      .replace('---', '-')
      .replace('--', '-')
      .toLowerCase();
  }

  /**
   * Keyword related functions
   */
  function keywordIsFirstWord(text, keyword) {
    var firstWord = text.split(" ")[0],
    result = contains(firstWord, keyword);

    return result;
  }

  function keywordIsInURL(keyword) {
    var url = location.href,          
    kwd = slugify(keyword);

    return contains(url, kwd);
  }

  function keywordIsInH1(h1, keyword) {
    return contains(h1, keyword);   
  }

  /**
   * Library Logic
   */
  function define_library() {
    var lib = {};

    function seo(document, keyword) {
      var title = document.title || "",
        h1 = document.h1 || "",
        body = document.body || "",
        result;

      // Check if title tag exists if not, throw an error and
      // do nothing
      if (!title) {
        throw "[-] Title tag doesn't exist.";
      }
      
      /**
       * Keyword related check 
       */
      // Check if keyword is included in the title 
      console.log("[*] Checking if keyword is in the title");
      if (contains(title, keyword)) {
        console.log("[+] Keyword found in the title");
      } else {
        console.log("[-] Keyword missing in the title");
      }

      console.log("--");

      // Check if the keyword is the first word of the title
      console.log("[*] Checking if keyword is the first word of the title");
      if (keywordIsFirstWord(title, keyword)) {
        console.log("[+] Keyword is the first word of the title");
      } else {
        console.log("[-] Keyword is not the first word of the title"); 
      }

      console.log("--");

      // Checking title length
      console.log("[*] Checking title length");
      var titleLenght = title.length || 0;
      if (titleLenght > 75) {
        console.log("[-] Title is greater than 75");
      } 

      if (titleLenght > 3 && titleLenght < 75) {
        console.log("[+] Title is smaller than 75");
      }
      
      if (titleLenght < 3) {
        console.log("[-] Your title is wrong, review it and fix it");
      }

      console.log("--");

      // Check if keyword is in the `h1`
      console.log("[*] Checking if the keyword is in the `h1`");
      if (contains(h1, keyword)) {
        console.log("[+] Your keyword is in the `h1`");
      } else {
        console.log("[-] Your keyword is not in the `h1`");
      }

      console.log("--");

      // Check if the keyword is at least two times in the content
      console.log("[*] Checking if the keyword is at least two times in the content");
      var $body = $(body),
        $ps = $body.find('p'),
        kwdsInP = 0;

      $.each($ps, function(key, item) {
        if (contains(item.innerHTML, keyword)) {
          kwdsInP++;
        } 
      });

      if (kwdsInP < 2) {
        console.log("[-] Your keyword is less than two times in the body");
      } 

      if (kwdsInP === 2) {
        console.log("[+] Your keyword is at least two times in the body");
      }

      if (kwdsInP > 2) {
        console.log("[-] Your keyword is more than two times in the body");
      }

      return result;
    }

    lib.check = function(html, keyword) {
      var parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html"),
        $dom = $(doc);

      var title = $dom.find('title').html(),
        body = $dom.find('body').html(),
        h1 = $dom.find('h1').eq(0).html();

      var docObj = {
        title: title,
        body: body,
        h1: h1
      };
      
      console.log(seo(docObj, keyword));
    };

    return lib;
  }

  // define globally if it doesn't already exist
  if (typeof(lib) === 'undefined') {
    window.OnSite = define_library(); 
  } else {
    console.error("Library already defined.");
  }
})(window);

$.ajax({
  url: "http://localhost:5000/v1/seo?url=http://adwhite.com",
  type: "GET",
  dataType: "json",
  success: function(data) {
    var html = "";

    if (data) { 
      html = data.seo.html; 
      OnSite.check(html, "adwhite");
    }
  }
});
