(function($) {
  /* All Images Loaded */
  $(window).load(function() {});
  /* Dom Loaded */
  $(document)
      .ready(function($) {
        var $window = $(window), ath = $('#addThis');

        setTimeout(function() {

          ath.addClass("addthis_sharing_toolbox col-lg-2 ")
              .css({
                "display" : "inline",
                "visibility" : "hidden",
                "margin-top" : "5px",
                "max-width" : "175px"
              });
          var x = $('#atstbx a span'), y = $('#atstbx a span svg'),
              z = $('#atstbx .at-share-btn');
          z.css({'margin' : '10px'});
          y.css({"height" : "40px", "width" : "40px"});
          x.css({
            "height" : "48px",
            "width" : "48px",
            "text-align" : "center",
            "vertical-align" : "middle",
            "padding-top" : "3px"
          });
        }, 500);

        // Mobile switch of nav-bar to addthis buttons

        var $mobile_logo = $(".mobile-logo"), addThis = $('#addwrap'),
            $mobileLogoD = $('.mobile-logo_2'),
            $logo_words = $(".mobile-logo-words"), $follow = $("#mobileFollow");
        var post_header = parseInt($('.meta').offset().top, 10);
        var home_header = parseInt($('.mobile-logo').offset().top, 10);

        $window.scroll(function() {
          // check if we are on the post page
          var scroll_top = $(window).scrollTop();
          if ($('body').hasClass("post-template")) {
            if (scroll_top >= post_header) {
              addThis.css({'visibility' : 'visible'}).sticky({zIndex : 6});
              ath.css({'visibility' : 'visible'}).sticky({zIndex : 7});
              $mobile_logo.css({'visibility' : 'hidden'});
              $logo_words.css({'visibility' : 'hidden'});
              $mobileLogoD.css({'visibility' : 'visible'});
              $follow.css({'display' : 'block'});
            }
          }
          if (scroll_top < post_header) {
            $mobile_logo.css({'visibility' : 'visible'});
            $logo_words.css({'visibility' : 'visible'});
            addThis.css({'visibility' : 'hidden'});
            ath.css({'visibility' : 'hidden'});
            $mobileLogoD.css({'visibility' : 'hidden'});
            $follow.css({'display' : 'none'});
          }
          if ($('body').hasClass('home-template') &&
              scroll_top >= home_header) {
            $mobile_logo.css({'visibility' : 'hidden'});
            $logo_words.css({'visibility' : 'hidden'});
          }
        });

        $('#ad_3').affix({offset : {top : 200}}).css("top", "70px");

        $('.row-wrap').siblings().wrapAll("<div class='row' /div>");
        deBouncer(jQuery, 'smartresize', 'resize', 50);

        // FADE-OUT READ MORE button
        var $el, $p, $ps, $up, totalHeight, articleHeight;

        $(" .fade-out .btn")
            .click(function() {

              totalHeight = 0;
              articleHeight = $('.fade-out').children().not('.read-more');
              $el = $(this);
              console.log($el);
              $p = $el.parent();
              console.log($p);
              $up = $p.parent();
              console.log($up);
              $ps = $up.find(articleHeight);

              // measure how tall inside should be by adding together heights of
              // all inside paragraphs (except read-more paragraph)
              $ps.each(function() { totalHeight += $(this).outerHeight(); });
              console.log($(this).outerHeight());
              console.log($ps);
              $up.css({
                   // Set height to prevent instant jumpdown when max height is
                   // removed
                   "height" : $up.height(),
                   "max-height" : 9999
                 })
                  .animate({"height" : totalHeight});

              // fade out read-more
              $p.fadeOut();

              // prevent jump-down
              return false;

            });
        // END OF READ MORE BUTTON FADE OUT

        // INFINITE SCROLL
        var page = 2;
        var url_blog = window.location;
        $(window)
            .scroll(function() {
              if ($(window).scrollTop() + $(window).height() ==
                  $(document).height()) {
                $
                    .get(ghost.url.api(
                        'posts',
                        {limit : 4, filter : 'id:-{{id}}', include : "author"}))
                    .done(function(data) {
                      $.each(data.posts,
                             function(i, post) { insertPost(post); });
                      console.log('posts', data.posts);
                    })
                    .fail(function(err) { console.log(err); });

                function insertPost(postData) {
                  var postInfo =
                      '<article class="post col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-bottom:10px;">\
                                  <a href="' +
                      postData.url +
                      '" class="local thumb hover-effect"><img src="' +
                      postData.image + '"></a>\
                      <h4 class="title"><a href="' +
                      postData.url + '">' + postData.title + '</a></h4>\
                      <div class="meta">\
                      <div class="tags"></div>\
                      <i class="fa fa-circle"></i><span class="author">Heart Centered Rebalancing</span>\
                      </article>\
                                  ';

                  $('article').last().after(postInfo);
                }
                // var content = $('.content').children();
                /*
                                $.get((url_blog + '/page/' + page),
                   function(data) {
                                  if (page <= max_pages) {
                                    var content = $('' + data + '');
                                    $('.content').append(content.find('.content').children());
                                    page = page + 1;
                                  }
                                });*/
              }
            });
        // END INFINITE SCROLL
        // Update window.history
        /*  $.fn.inView = function() {
          // Window Object
          var win = $(window);
          // Object to Check
          obj = $(this);
          // console.log(obj);
          // the top Scroll Position in the page
          var scrollPosition = win.scrollTop();
          // the end of the visible area in the page, starting from the scroll
          // position
          var visibleArea = win.scrollTop() + win.height();
          // the end of the object to check
          var objEndPos = (obj.offset().top + obj.outerHeight());
          return (visibleArea >= objEndPos && scrollPosition <= objEndPos
                      ? true
                      : false);
        };
*/ $.fn.isOnScreen = function() {

          var win = $(window);

          var viewport = {top : win.scrollTop(), left : win.scrollLeft()};
          viewport.right = viewport.left + win.width();
          viewport.bottom = viewport.top + win.height();

          var bounds = this.offset();
          bounds.right = bounds.left + this.outerWidth();
          bounds.bottom = bounds.top + this.outerHeight();

          return (
              !(viewport.right < bounds.left || viewport.left > bounds.right ||
                viewport.bottom < bounds.top || viewport.top > bounds.bottom));

        };
        $(window)
            .scroll(function(e) {

              $('.local')
                  .each(function() {
                    //  console.log(index + ':' + $(this).attr('href'));
                    if ($(this).isOnScreen() === true) {
                      (window.history.replaceState('state', 'null',
                                                   $(this).attr('href')));
                      return e.preventDefault();
                    }

                    console.log($(this).isOnScreen());
                  });
              //$(".local").addClass("active");
              // window.history.pushState("state", "title",
              //           $(this).attr('href'));
              //  console.log($(this));

              // if ($(".local:eq(1)").inView() == false) {
              //$(".local").removeClass("active");
              //  window.history.pushState("state", "title",
              //   $('.active:eq(2)').attr('href'));

              //}

            });
        if ($('body').hasClass('home-template')) {
          if ($(document).width() > 767) {
            $('.menu-wrapper').sticky({zIndex : 1000, height : 1});
          }
        }
        /* Global
          */
        $('#header div.menu-mobile')
            .click(function() { $('#header')
                                    .toggleClass('menu-open'); });

        $('#header form')
            .submit(function() {
              var search_text = $(this).find('.search-field').val();
              $('#header form .search-field').val(search_text);
              $('html, body').animate({scrollTop : 0}, 500);
            });
        $("form .search-field")
            .ghostHunter({
              results : "#search-results",
              info_template :
                  "<h2 class='title'>{{amount}} results for your search</h2>",
              result_template :
                  '<div class="box grid-50 tablet-grid-50"><article class="item"><h4 class="title"><a href="{{link}}">{{title}}</a></h4><p><time><i class="fa fa-clock-o"></i> {{pubDate}}</time></p></article></div>',
              before : function() {
                if ($('div.main-image.cover').length > 0) {
                  $('#search-results').addClass('with-cover');
                }
                $('#search-results').fadeIn();
              }
            });

        $('#back-to-top')
            .click(function(event) {
              event.preventDefault();
              $('html, body').animate({scrollTop : 0}, 500);
              return false;
            });

        /* Home */

        if ($('section.tweets').length > 0 &&
            theme_config.twitter_username != '') {
          var username = theme_config.twitter_username;
          $('section.tweets h3').text('@' + username).show();
          var limit = theme_config.twitter_limit;
          var wrapper = $('section.tweets .slick');
          var urlpattern =
              /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
          var usernamepattern = /@+(\w+)/ig;
          var hashpattern = /#+(\w+)/ig;
          var pIMG, media, timestamp, abox, mtext;
          var tweets = '';

          /* Tweetcool fixes */

          //$.getJSON("https://www.api.tweecool.com/?screenname=" + username +
          //"&count=" + limit, function(data) {
          /*			$.getJSON("https://www.api.tweecool.com/?screenname="
             +
             username + "&count=" + limit, function(data) {
                                          if (data.errors || data == null) {
                                                  wrapper.html('No tweets
             available.');
                                                  return false;
                                          }

                                          $.each(data.tweets, function(i, field)
             {
                                                  mtext = field.text;
                                                  tweets += '<div
             class="item"><div class="tweets_txt">' + mtext.replace(urlpattern,
             '<a href="$1" target="_blank">$1</a>').replace(usernamepattern, '<a
             href="https://twitter.com/$1"
             target="_blank">@$1</a>').replace(hashpattern, '<a
             href="https://twitter.com/search?q=%23$1"
             target="_blank">#$1</a>')+'</div></div>';
                                          });
                                          wrapper.html(tweets);
                                          wrapper.slick({
                                                  cssEase: 'ease',
                                                  arrows: true,
                                                  dots: false,
                                                  infinite: false,
                                                  variableWidth: false,
                                                  swipe: true,
                                                  vertical: true,
                                                  slidesToShow: 1
                                          });
                                  }).fail(function(jqxhr, textStatus, error) {
                                          wrapper.html('No tweets available.');
                                  });
                                  */
          var get_tweets_config = {
            id : theme_config.twitter_app_id,
            domId : 'tweets',
            maxTweets : theme_config.twitter_limit,
            showImages : false,
            showRetweet : false,
            showTime : false,
            showUser : false,
            enableLinks : true,
            customCallback : function(tweets) {
              if (tweets) {
                var x = tweets.length;
                var n = 0;
                var element = $('#tweets');
                var html = '';
                while (n < x) {
                  html += '<div class="item"><div class="tweets_text">' +
                          tweets[n] + '</div></div>';
                  n++;
                }
              } else {
                html = 'No tweets available';
              }
              wrapper.html(html);
              wrapper.slick({
                cssEase : 'ease',
                arrows : true,
                dots : false,
                infinite : false,
                variableWidth : false,
                swipe : true,
                vertical : true,
                slidesToShow : 1
              });
            }
          };
          twitterFetcher.fetch(get_tweets_config);
        }

        $('.tooltip')
            .tooltipster({
              theme : 'tooltipster-small',
              contentAsHTML : true,
              animation : 'grow'
            });
        $('.share-button')
            .tooltipster({
              theme : 'tooltipster-small',
              contentAsHTML : true,
              animation : 'grow',
              interactive : true,
              functionInit : function(origin, continueTooltip) {
                return this.next().html();
              }
            });

        /* Featured Sections */

        if ($('aside#featured .featured-top').length > 0) {
          $.get("/tag/featured-top", function(data) {
            $('aside#featured .featured-top .box').html(data);
          });
        }
        if ($('aside#featured .featured-bottom').length > 0) {
          $.get("/tag/featured-bottom", function(data) {
            $('aside#featured .featured-bottom .box').html(data);
          });
        }

        /* Home scripts */
        var home = ('#home');

        if (home.length > 0 && $('#home section.carousel').length > 0) {

          $.get("/tag/carousel", function(data) {
            $('#home section.carousel div.loader').hide();
            $('#home section.carousel #featured-posts')
                .html(data)
                .slick({
                  cssEase : 'ease',
                  arrows : false,
                  dots : true,
                  infinite : false,
                  variableWidth : false,
                  swipe : true,
                  vertical : false,
                  slidesToShow : 3,
                  slidesToScroll : 3,
                  responsive : [
                    {
                      breakpoint : 1025,
                      settings : {slidesToShow : 3, slidesToScroll : 3}
                    },
                    {
                      breakpoint : 767,
                      settings : {slidesToShow : 1, slidesToScroll : 1}
                    }
                  ]
                });
          });
        }

        /* Code Prettify */

        prettyPrint();

        /* Sidebar */

        if ($('.widget_tag_cloud .feed').length > 0) {
          $.get("/rss/", function(data) {
            var $xml = $(data);
            var tags = '';
            var tags_array = [];
            tags += '<div class="tagcloud">';
            $xml.find("category")
                .each(function() {
                  var tag = $(this).text();
                  if ($.inArray(tag, tags_array) == -1) {
                    tags_array.push(tag);
                  }
                });

            tags_array = jQuery.unique(tags_array);

            for (var i = 0; i < tags_array.length; i = i + 1) {
              var tag = tags_array[i];
              var tagURL = tag.toLowerCase().replace(/ /g, "-");
              if (tag != 'standard' && tag != 'example' && tag != 'carousel' &&
                  tag != 'link' && tag != 'quote')
                tags += '<a href="/tag/' + tagURL + '/">' + tag + '</a>';
            };

            tags += '</div>';
            $('.widget_tag_cloud .feed').html(tags);
          });
        }

        /*	if($('.widget_ep_flickr').length > 0 && theme_config.flickr_id
           != ''){
                        $('.widget_ep_flickr ul').jflickrfeed({
                                limit: theme_config.flickr_photos_limit,
                                qstrings: {
                                        id: theme_config.flickr_id
                                },
                                useTemplate: false,

                                itemCallback: function(item){
                                        $(this).append('<li class="grid-50
           tablet-grid-33 mobile-grid-33"><a href="'+item.image_b+'"
           title="'+item.title+'" class="hover-effect"><span class="cover"
           style="background-image: url('+item.image_n+');"></span></a></li>');
                                }
                        }, function(data) {
                                //$('section#<?php echo $this->id; ?> ul
           li:nth-child(3n)').addClass('ep-last');
                                $('.widget_ep_flickr ul, .widget_ep_flickr ul
           div.loading').addClass('loaded');
                                $('.widget_ep_flickr ul ').magnificPopup({
                                        type: 'image',
                                        gallery:{
                                                enabled: true,
                                                arrowMarkup: '<i
           class="mfp-arrow mfp-arrow-%dir% fa fa-chevron-%dir%"></i>'
                                        },
                                        delegate: 'a',
                                        mainClass: 'my-mfp-zoom-in',
                                        removalDelay: 300,
                                        closeMarkup: '<i title="%title%"
           class="mfp-close fa fa-times"></i>'
                                });
                        });
                }
        */
        /* Gallery */

        $('div#gallery').addClass('gallery');

        $('div.gallery')
            .each(function() {
              $(this)
                  .find('img')
                  .wrap(function() {
                    return '<div class="grid-33 tablet-grid-33"><a href="' +
                           $(this).attr('src') +
                           '" class="hover-effect" rel="gallery"></a></div>';
                  });
              $(this).append('<div class="clear"></div');
              $(this)
                  .magnificPopup({
                    type : 'image',
                    gallery : {
                      enabled : true,
                      arrowMarkup :
                          '<i class="mfp-arrow mfp-arrow-%dir% fa fa-chevron-%dir%"></i>'
                    },
                    delegate : 'a',
                    mainClass : 'my-mfp-zoom-in',
                    removalDelay : 300,
                    closeMarkup :
                        '<i title="%title%" class="mfp-close fa fa-times"></i>'
                  });
              $(this).fadeIn();
            });

        /* Global Lightbox */

        $('.lightbox')
            .magnificPopup({
              mainClass : 'my-mfp-zoom-in',
              removalDelay : 300,
              closeMarkup :
                  '<i title="%title%" class="mfp-close fa fa-times"></i>',
              fixedContentPos : true
            });

        /* Google Map Integration */

        if ($('#map_canvas').length > 0) {
          var map_canvas = $('#map_canvas');
          var lat = map_canvas.attr('latitude');
          var lng = map_canvas.attr('longitude');
          var zoom = map_canvas.attr('zoom');
          var location = map_canvas.attr('location');
          if (!zoom)
            zoom = 16;
          if (lat && lng && zoom) {
            map_canvas.wrap('<div class="map"></div>');
            // if(location) $('div.map').append('<h3 class="location"><i
            // class="fa fa-map-marker"></i>'+location+'</h3>');
            initialize(lat, lng, zoom, location);
          }
        }

        $(window).smartresize(function(e) { wrapper.slick('setPosition'); });
      });

  var top =
      $('.ad-wrapper #ad_4').offset().top -
      parseFloat($('.ad-wrapper #ad_4').css('marginTop').replace(/auto/, 0));
  $(window)
      .scroll(function(event) {
        // what the y position of the scroll is
        var y = $(this).scrollTop();

        // whether that's below the form
        if (y >= top) {
          // if so, ad the fixed class
          $('.ad-wrapper #ad_4').addClass('fixed');
        } else {
          // otherwise remove it
          $('.ad-wrapper #ad_4').removeClass('fixed');
        }
      });

  function initialize(lat, lng, zoom, location) {
    var latlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
      zoom : parseInt(zoom),
      center : latlng,
      scrollwheel : false
    };
    var map =
        new google.maps.Map(document.getElementById('map_canvas'), myOptions);
    // map.setMapTypeId('roadmap');
    var marker = new google.maps.Marker({position : latlng, map : map});
    if (location) {
      var infowindow = new google.maps.InfoWindow({
        content : '<div class="infowindow">' + location + '</div>',
        maxWidth : 370
      });
      infowindow.open(map, marker);
    }
    google.maps.event.addListener(marker, 'click',
                                  function() { infowindow.open(map, marker); });
    google.maps.event.addDomListener(window, 'resize',
                                     function() { map.setCenter(latlng); });
  }
})(jQuery);
