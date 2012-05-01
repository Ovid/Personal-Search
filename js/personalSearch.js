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
            f : "http://www.flickr.com/search/?q={0}&l=comm&ss=2&ct=6&mt=all&w=all&adv=1",
            g : "http://www.google.com.pk/search?btnG=1&pws=0&q={0}",
            p : "https://www.google.com/search?hl=en&q=site%3Apublius-ovidius.livejournal.com+{0}",
            w : "http://www.wolframalpha.com/input/?i={0}"
        };

        $(searchId).submit(function() {
            // $("#searchbox").attr('action', 'http://www.google.com');
            var search = $('#search').val();
            var reSearch = /^\s*!(\S+)\s+(.*)/;
            var matchSearch = reSearch.exec(search);
            if (matchSearch) {
                if ( redirect = redirects[matchSearch[1]] ) {
                    setTimeout(function() {
                        window.location = redirect.redirectFormat(encodeURIComponent(matchSearch[2]));
                    }, 1000 );
                    return false;
                }
            }
            else {
                return true;
            }
        });
};
