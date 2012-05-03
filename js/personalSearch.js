// This is used to provide the placeholder text for older browsers. It's
// probably not needed.
//
$(document).ready(function() {
    if (!Modernizr.input.placeholder)
    {

        var placeholderText = $('#search').attr('placeholder');

        $('#search').attr('value',placeholderText);
        $('#search').addClass('placeholder');

        $('#search').focus(function() {
            if( ($('#search').val() == placeholderText) )
            {
                $('#search').attr('value','');
                $('#search').removeClass('placeholder');
            }
        });

        $('#search').blur(function() {
            if ( ($('#search').val() == placeholderText) || (($('#search').val() == '')) )
            {
                $('#search').addClass('placeholder');
                $('#search').attr('value',placeholderText);
            }
        });
    }
});

String.prototype.redirectFormat = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match;
    });
};

var personalSearch = function(searchId,searchBoxId) {
    var redirects = {
        aljazeera : {
            url  : "http://www.aljazeera.com/Services/Search/?q={0}",
            desc : "Al Jazeera"
        },
        cpan : {
            url  : "http://search.cpan.org/search?query={0}&mode=all",
            desc : "search.cpan.org"
        },
        cnn : {
            url  : "http://edition.cnn.com/search/?query={0}",
            desc : "CNN News"
        },
        cnet : {
            url  : "http://news.cnet.com/1770-5_3-0.html?query={0}&tag=srch&searchtype=news",
            desc : "c|net news"
        },
        books : {
            url  : "http://www.amazon.com/s/ref=nb_sb_noss_1?field-keywords={0}&url=search-alias%3Dstripbooks&tag=overse-20",
            desc : "Amazon.com Book search"
        },
        bbc : {
            url  : "http://www.bbc.co.uk/search/?q={0}",
            desc : "BBC Website"
        },
        flickrcc : {
            url  : "http://www.flickr.com/search/?q={0}&l=comm&ss=2&ct=6&mt=all&w=all&adv=1",
            desc : "Flickr CC Commercial photos"
        },
        google : {
            url  : "http://www.google.com/search?btnG=1&pws=0&q={0}",
            desc : "Google"
        },
        metacpan : {
            url  : "https://metacpan.org/search?q={0}",
            desc : 'metacpan'
        },
        news : {
            url  : "http://www.google.com/search?btnG=1&tbm=nws&pws=0&q={0}",
            desc : "Google news"
        },
        publius : {
            url  : "https://www.google.com/search?hl=en&q=site%3Apublius-ovidius.livejournal.com+{0}",
            desc : "My old personal blog"
        },
        recipe : {
            url  : "http://www.cooks.com/rec/search?q={0}",
            desc : "Cooks.com"
        },
        wikipedia : {
            url  : "http://en.wikipedia.org/wiki/Special:Search?search={0}",
            desc : "Wikipedia"
        },
        wolframalpha : {
            url  : "http://www.wolframalpha.com/input/?i={0}",
            desc : "Wolframalpha.com"
        },
        youtube : {
            url  : "http://www.youtube.com/results?search_query={0}",
            desc : "Youtube"
        }
    };

    $(searchId).submit(function() {
        var search = $(searchBoxId).val();
        var reSearch = /^\s*!(\S+)\s+(.*)/;
        var matchSearch = reSearch.exec(search);
        if (matchSearch) {
            if ( redirect = redirects[matchSearch[1]] ) {
                setTimeout(function() {
                    window.location = redirect.url.redirectFormat(encodeURIComponent(matchSearch[2]));
                }, 1 );
                return false;
            }
        }
        else {
            return true;
        }
    });
    var keys = [];
    for (var key in redirects) keys.push('!' + key);
    keys.sort();
    $(searchBoxId).autocomplete({
        source: keys,
        delay: 0,
        selectFirst: true,
        select: function(event, ui) {
            var TABKEY = 9;
            this.value = ui.item.value;

            if (event.keyCode == TABKEY) {
                event.preventDefault();
                this.value = this.value + " ";
                $(searchBoxId).focus();
            }

            return false;
        },
        autoFocus: true
    });
}
