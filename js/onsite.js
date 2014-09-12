var $ = require('jquery');

// ## Library result format 
// `result.state` this is to show length, false, true or any state needed
// `result.msg` to tell the user if this is good, bad or normal
// `result.recommendation` tell the user some recommendation
// `result.icon` bad, normal or good

;(function(win, doc) {
  'use strict';

	var utils = {
		// https://github.com/james2doyle/saltjs
		$: function(selector, context, undefined) {
		  // an object containing the matching keys and native get commands
			var matches = {
				'#': 'getElementById',
			  '.': 'getElementsByClassName',
			  '@': 'getElementsByName',
			  '=': 'getElementsByTagName',
			  '*': 'querySelectorAll'
			}[selector[0]]; // you can treat a string as an array of characters
			// now pass the selector without the key/first character
			var el = (((context === undefined) ? document: context)[matches](selector.slice(1)));
			// if there is one element than return the 0 element
			return ((el.length < 2) ? el[0]: el);
		},

		// http://toddmotto.com/simple-foreach-implementation-for-objects-nodelists-arrays-with-automatic-type-looping/
		forEach: function(collection, callback, scope) {
			if (Object.prototype.toString.call(collection) === '[object Object]') {
				for (var prop in collection) {
					if (Object.prototype.hasOwnProperty.call(collection, prop)) {
						callback.call(scope, collection[prop], prop, collection);
					}
				}
			} else {
				for (var i = 0; i < collection.length; i++) {
					callback.call(scope, collection[i], i, collection);
				}
			}
		}
	};

  /**
   * Check type of `el` and compare it to `type` 
   *
   * @param {object} object, Element to be checked ("Everything in JavaScript is an Object");
   * @param {string} string, Name of the type we want to compare
   * @returns {boolean} returns true of false if the Elements is equal to String
   * @example
   *
   * isType([], "Array"); // true
   * isType({}, "Object"); // true
   * isType('', "String"); // true
   * isType(new Date(), "Date"); // true
   * isType(/test/i, "RegExp"); // true
   * isType(function () {}, "Function"); // true
   * isType(true, "Boolean"); // true
   * isType(1, "Number"); // true
   * isType(null, "Null"); // true
   */
  function isType(el, type) {
      return Object.prototype.toString.call(el).slice(8, -1) === type;
  }

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
   * TODO: check if both are strings,
   * also check which is better:
   * if (str && isType(str, "String")) {};
   * or
   * str = str || "";
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

    function seo(html, keyword) {

      var title = html.title || "",
        h1 = html.h1 || "",
        body = html.body || "",
				ps = html.ps || "",
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

			// get all the `<p>` tags inside the website
			var kwdsInP = 0;

			console.log(ps);

			utils.forEach(ps, function(value, prop, obj) {
				if (contains(value.innerHTML, keyword)) {
					kwdsInP++;
				}
			});

			console.log("keyword in body: " + kwdsInP);
			console.log(ps);

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

    lib.check = function(options) {
      options = options || {};
        
			// html parser function
      if (options.hasOwnProperty('html')) {
        var parser = new DOMParser(),
          d = parser.parseFromString(options.html, "text/html"),
          keyword = options.keyword || "",
          title = d.getElementsByTagName('title') ? d.getElementsByTagName('title')[0].innerHTML : "",
          body = d.getElementsByTagName('body') ? d.getElementsByTagName('body')[0].innerHTML : "",
          h1 = d.getElementsByTagName('h1') ? d.getElementsByTagName('h1').innerHTML : "",
					ps = d.getElementsByTagName('p') || "",
					imgs = d.getElementsByTagName('img') || "",
          docObj = {
          title: title,
          body: body,
          h1: h1,
					ps: ps
        };

        console.log(seo(docObj, keyword));
      } else {
        throw "HTML string not found"
      }
    };

    return lib;
  }

  // define globally if it doesn't already exist
  if (typeof(lib) === 'undefined') {
    win.OnSite = define_library(); 
  } else {
    console.error("Library already defined.");
  }
})(window, document);

var url = "http://hidden-taiga-3220.herokuapp.com";
// var url = "http://hidden-taiga-3220.herokuapp.com";

$.ajax({
  url: url + "/v1/seo?url=http://adwhite.com",
  type: "GET",
  dataType: "json",
  success: function(data) {

    if (data) { 
      var options = {
        html: data.seo.html,
        keyword: "adWhite",
        debug: true
      };

      OnSite.check(options);
    }
  }
});
