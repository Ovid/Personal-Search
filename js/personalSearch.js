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

String.prototype.searchFormat = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match;
    });
};

function PersonalSearchDatabase() {
    this.databaseName    = 'personalSearches';
    this.defaultSearches = {
        aljazeera : {
            url     : "http://www.aljazeera.com/Services/Search/?q={0}",
            desc    : "Al Jazeera",
            example : "Palestine"
        },
        bbc : {
            url     : "http://www.bbc.co.uk/search/?q={0}",
            desc    : "BBC Website",
            example : "President of France"
        },
        books : {
            url     : "http://www.amazon.com/s/ref=nb_sb_noss_1?field-keywords={0}&url=search-alias%3Dstripbooks&tag=overse-20",
            desc    : "Amazon.com Book search",
            example : "Beginning Perl Curtis poe"
        },
        cnet : {
            url     : "http://news.cnet.com/1770-5_3-0.html?query={0}&tag=srch&searchtype=news",
            desc    : "c|net news",
            example : "Linux"
        },
        cnn : {
            url     : "http://edition.cnn.com/search/?query={0}",
            desc    : "CNN News",
            example : "Astrology"
        },
        compfight : {
            url     : "http://compfight.com/search/{0}/1-2-1-1",
            desc    : "High quality CC commercial on Flickr",
            example : "chess"
        },
        cpan : {
            url     : "http://search.cpan.org/search?query={0}&mode=all",
            desc    : "CPAN",
            example : "Test::Class::Moose"
        },
        flickrcc : {
            url     : "http://www.flickr.com/search/?q={0}&l=comm&ss=2&ct=6&mt=all&w=all&adv=1",
            desc    : "Flickr CC Commercial photos",
            example : "French flag"
        },
        gutenberg : {
            url     : "http://www.gutenberg.org/ebooks/search/?query={0}",
            desc    : "Gutenberg Book project",
            example : "John Carter of Mars"
        },
        google : {
            url     : "http://www.google.com/search?btnG=1&pws=0&q={0}",
            desc    : "Google",
            example : "Jimmy Carter Palestine"
        },
        imdb : {
            url     : "http://www.imdb.com/find?q={0}",
            desc    : "IMDB",
            example : "Casablanca"
        },
        metacpan : {
            url     : "https://metacpan.org/search?q={0}",
            desc    : 'metacpan',
            example : "Dancer"
        },
        news : {
            url     : "http://www.google.com/search?btnG=1&tbm=nws&pws=0&q={0}",
            desc    : "Google news",
            example : "Palestine"
        },
        overseas : {
            url     : "https://www.google.com/search?hl=en&q=site%3Aoverseas-exile.com+{0}",
            desc    : "Overseas Exile",
            example : "fatca"
        },
        publius : {
            url     : "https://www.google.com/search?hl=en&q=site%3Apublius-ovidius.livejournal.com+{0}",
            desc    : "My old personal blog",
            example : "economics"
        },
        recipe : {
            url     : "http://www.cooks.com/rec/search?q={0}",
            desc    : "Cooks.com",
            example : "hash browns"
        },
        rottentomatoes : {
            url     : "http://www.rottentomatoes.com/search/?search={0}&sitesearch=rt",
            desc    : "Rotten Tomatoes Movie Search",
            example : "Serenity"
        },
        songfacts : {
            url     : "http://www.songfacts.com/search.php?q={0}",
            desc    : "songfacts.com",
            example : "You gotta say yes to another excess"
        },
        wikipedia : {
            url     : "http://en.wikipedia.org/wiki/Special:Search?search={0}",
            desc    : "Wikipedia",
            example : "Palestine"
        },
        commons : {
            url     : "http://commons.wikimedia.org/wiki/Special:Search?search={0}",
            desc    : "Wikimedia Commons",
            example : "Anne Frank"
        },
        wolframalpha : {
            url     : "http://www.wolframalpha.com/input/?i={0}",
            desc    : "Wolframalpha.com",
            example : "What is the sound of one hand clapping"
        },
        youtube : {
            url     : "http://www.youtube.com/results?search_query={0}",
            desc    : "Youtube",
            example : "Michael Franti Hole In the Bucket"
        }
    };

    // If we have local storage:
    //     if searches not in database
    //         store default searches
    //         return default searches
    //     else
    //         return stored searches
    // else:
    //     the user gets the default searches
    //
    this.getSearches = function() {
        var searches = this.defaultSearches;

        if (Modernizr.localstorage) {
            // localStorage.removeItem(this.databaseName);
            var storedSearches = localStorage.getItem(this.databaseName);
            if (storedSearches === null) {
                // alert('Did not find stored searches. Saving them.');
                localStorage.setItem(this.databaseName, JSON.stringify(defaultSearches));
            }
            else {
                // alert('Loading searches from localStorage');
                searches = JSON.parse(storedSearches);
            }
        }
        else {
            alert("To ensure privacy, we store your search results in local storage. Please update your browser to a modern version that supports local storage. Falling back to default searches.");
        }
        return searches;
    };
}

function PersonalSearch( searchId, searchBoxId, examplesId ) {
    this.searchId    = searchId;
    this.searchBoxId = searchBoxId;
    this.examplesId  = examplesId;
    this.database    = new PersonalSearchDatabase();

    // if they value the person entered in the search box matches:
    //
    //      *searchtype* search terms
    //
    // And 'searchtype' matches a key in the database, we open a new
    // window/tab pointing at the related URL, with the search terms
    this.doSearch = function(searches) {
        var search      = $('#' + this.searchBoxId).val();

        // search type, spaces, followed by search term
        var reSearch    = /^(\S+)\s+(.*)/;
        var matchSearch = reSearch.exec(search);
        if (matchSearch) {
            if ( found = searches[matchSearch[1]] ) {
                setTimeout(function() {
                    window.open(
                        found.url.searchFormat( encodeURIComponent(matchSearch[2])),
                        matchSearch[1]
                    );
                }, 1 );
                return false;
            }
        }
        else {
            return true;
        }
    };

    // returns a sorted (by description) list of keys from the database
    this.getSearchTypes = function(searches) {
        var keys  = [];

        for (var key in searches) {
            if ( searches.hasOwnProperty(key) ) {
                keys.push(key);
            }
        }

        // sort the keys by the description
        keys.sort( function byDesc(a,b) {
            var aDesc = searches[a].desc.toLowerCase();
            var bDesc = searches[b].desc.toLowerCase();
            return (aDesc < bDesc) ? -1 : (aDesc > bDesc) ? 1 : 0;
        });
        return keys;
    };

    // adds one row per search to the examplesId table
    this.populateExamples = function(searches) {
        var keys  = this.getSearchTypes(searches);
        var table = document.getElementById(this.examplesId);
        for (var i in keys) {
            var rowCount = table.rows.length;
            var row      = table.insertRow(rowCount);
            var search   = searches[keys[i]];

            var cell1 = row.insertCell(0);
            cell1.innerHTML = search.desc;

            var cell2 = row.insertCell(1);
            var href  = search.url.searchFormat(encodeURIComponent(search.example));
            cell2.innerHTML = '<tt><a href="' + href + '" target="_blank">' + keys[i] + ' ' + search.example + '</a></tt>';
        }
    };

    // creates the 'searchtype' autocomplete for the search box
    this.setUpAutocomplete = function(searches) {
        var keys = [];
        for (var key in searches) keys.push(key);
        keys.sort();
        $('#' + this.searchBoxId).autocomplete({
            source:      keys,
            delay:       0,
            selectFirst: true,
            select:      function(event, ui) {
                var TABKEY = 9;
                this.value = ui.item.value;

                if (event.keyCode == TABKEY) {
                    event.preventDefault();
                    this.value = this.value + " ";
                    this.focus();
                }

                return false;
            },
            autoFocus: true,
            minLength: 2
        })

        // entirely optional. Highlights the results in dropdown
        .data("autocomplete")._renderItem = function (ul, item) {
            var newText = String(item.value).replace(
                    new RegExp(this.term, "gi"),
                    "<span class='ui-state-highlight'>$&</span>");

            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<a>" + newText + "</a>")
                .appendTo(ul);
        };
    };

    // Creates the search examples, the autocomplete, and searches on submit
    this.setupSearch = function () {
        var searches = this.database.getSearches();
        this.populateExamples(searches);
        this.setUpAutocomplete(searches);

        var that     = this; // damn it, javascript
        $('#' + this.searchId).submit(function() {
            return that.doSearch(searches);
        });
    };
}
