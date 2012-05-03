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

var personalSearch = function(searchId) {
    var redirects = {
        cpan : {
            url  : "http://search.cpan.org/search?query={0}&mode=all",
            desc : "search.cpan.org"
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
        // $("#searchbox").attr('action', 'http://www.google.com');
        var search = $('#search').val();
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
    /* http://stackoverflow.com/questions/1837555/ajax-autocomplete-or-autosuggest-with-tab-completion-autofill-similar-to-shell
     * */
    var keys = [];
    for (var key in redirects) keys.push('!' + key);
    keys.sort();
    $('#search').autocomplete({
        source: keys,
        delay: 0,
        selectFirst: true,
        select: function(event, ui) {
            var TABKEY = 9;
            this.value = ui.item.value;

            if (event.keyCode == TABKEY) {
                event.preventDefault();
                this.value = this.value + " ";
                $('#search').focus();
            }

            return false;
        },
        autoFocus: true
    });
}
