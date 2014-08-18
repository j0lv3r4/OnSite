var $ = require('jquery');
var _ = require('lodash');

// ## Library result format 
// `result.state` this is to show length, false, true or any state needed
// `result.msg` to tell the user if this is good, bad or normal
// `result.recommendation` tell the user some recommendation
// `result.icon` bad, normal or good

;(function(window) {
  'use strict';

  // Core tools
  var _utils = {
    contains: function(text, keyword) {
      var kwd = new RegExp(keyword, 'gi'),
        matches = text.match(keyword) || "";

      return matches.length;
    },

    slugify: function(text) {
      if (text) {
        var slugified = text.toLowerCase().replace(/\s/g, '=');

        // Check if last char is '-', if it is then delete it 
        if (slugified.substr(-1) === '-') {
          slugified = slugified.substr(0, slugified.length -1);
        }

        return slugified;
      } else {
        throw "slugify: String needed to work";
      }
    }
  };

  // Tools related with keywords
  var _keyword = {
    firstWord: function(text, keyword) {
      var firstWord = text.split(" ")[0],
      result = _utils.contains(firstWord, keyword);

      return result;
    },

    url: function(keyword) {
      var url = location.href,          
      kwd = _utils.slugify(keyword);

      return _utils.contains(url, kwd);
    },

    h1: function(h1, keyword) {
      return _utils.contains(h1, keyword);   
    }
  };

  function define_library() {
    var lib = {};

    // OnSite Logic
    lib.check = function(xml, keyword) {
      // function tryParseXML(xmlString) {
      //   var parser = new DOMParser();
      //   var parsererrorNS = parser.parseFromString('INVALID', 'text/xml').getElementsByTagName('parsererror')[0].namespaceURI;
      //   var dom = parser.parseFromString(xmlString, 'text/xml');
      //   if (dom.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0) {
      //     throw new Error('Error parsing XML');
      //   }

      //   return dom;
      // }

      // var parser = new DOMParser(),
      //   doc = parser.parseFromString(xml, "application/xml"),
      //   $dom = $(doc);

      // var title = $dom.find('title').html();
      // var body = $dom.find('body').html();

      console.log("--");
      window.$dom = xml;
      console.log("--");

      // console.log(lib.checkTitle(title, keyword));
      // console.log(lib.checkSubHeadings(body, keyword));
    }

    // ## Social Media 
    lib.checkTitle = function(title, keyword) {
      // var result = {};

      // Check if title tag exists if not, throw an error and
      // do nothing
      if (!title) {
        throw "[-] Title tag doesn't exist.";
      }
      // Check if title includes the keyword
      console.log("[*] Checking if keyword is in the title");
      if (title.indexOf(keyword) > -1) {
        console.log("[+] Keyword found in the title");
      } else {
        console.log("[+] Keyword missing in the title");
      }

      console.log("--");

      console.log("[*] Checking if keyword is the first word of the title");
      if (_keyword.firstWord(title, keyword)) {
        console.log("[+] Keyword is the first word of the title");
      } else {
        console.log("[-] Keyword is not the first word of the title"); 
      }

      console.log("--");

      // Checkingn title length
      console.log("[*] Checking title length");
      var titleLenght = title.length || 0;

      if (titleLenght > 75) {
        console.log("[-] Title is greater than 75");
      } 

      if (titleLenght > 3 && titleLenght < 75) {
        console.log("[+] Title is smaller than 75");
      }

      console.log("--");

      // return result;
    }

    lib.checkSubHeadings = function(subHeadings, keyword) {
      var h1 = $(subHeadings).find('h1').html();
      console.log(subHeadings);
      console.log(h1);
      console.log("--");

      /*
      // Check if keyword is in `h1`
      console.log("[*] Checking if keyword is in the `h1` tag");
      if (_keyword.h1(h1, keyword)) {
      console.log("[+] Keyword is in the <h1> tag");
      } else {
      console.log("[-] Keyword is not in the <h1> tag");
      }
      */
    }

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
  url: "http://localhost:5000/v1/seo?url=http://woodlandsonline.com",
  type: "GET",
  dataType: "json",
  success: function(data) {
    var html = "";

    if (data) { 
      html = data.seo.html.replace('/&(?!#?[a-z0-9]+;)/', '&amp;'); 

      var parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/xml"),
        $dom = $(doc);

      window._dom = $dom;
      console.log($dom);
      OnSite.check($dom, "marketing");
    }
  }
});
