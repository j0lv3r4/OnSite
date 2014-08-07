var $ = require('jquery');
var _ = require('lodash');

// ## Library result format 
// `result.state` this is to show length, false, true or any state needed
// `result.msg` to tell the user if this is good, bad or normal
// `result.recommendation` tell the user some recommendation
// `result.icon` bad, normal or good

;(function(window) {
  'use strict';
  function define_library() {
    var OnSite = {};

    // OnSite Logic
    OnSite.check = function(xml, keyword) {
      var parser = new DOMParser(),
        doc = parser.parseFromString(xml, "text/xml"),
        $dom = $(doc);

      console.log($dom.find('title').html());
    }

    // ## Social Media 
    OnSite.checkTitle = function(title, keyword) {
      var result = {};

      // Check if title includes the keyword
      if (title.indexOf(keyword) > -1) {
        console.log("Keyword is in the title");
      } else {
        console.log("Keyword is not in the title");
      }

      var titleLenght = title.length || 0;

      if (titleLenght > 75) {
        console.log("Title is greater than 75, what is bad");
      } 

      if (titleLenght > 3 && titleLenght < 75) {
        console.log("Title is smaller than 75, what is good");
      }

      return result;
    }

    return OnSite;
  }

  // define globally if it doesn't already exist
  if (typeof(OnSite
) === 'undefined') {
    window.OnSite= define_library(); 
  } else {
    console.error("Library already defined.");
  }
})(window);

$.ajax({
  url: "http://hidden-taiga-3220.herokuapp.com/v1/seo?url=http://adwhite.com",
  type: "GET",
  dataType: "json",
  success: function(data) {
    var html = "";

    if (data) {
      html = data.seo.html;
    }

    OnSite.check(html);
  }
});
