(function () {
    // MUSIC SEARCH
    const searchInput = $('#search-input');
    const multilayerCheckbox = $('#multilayer');
    const numResults = $('#num-results');
    let multiLayerOnly = 0;

    // Suggestions Elements
    const suggestionsElement = $('#suggestions');

    const keywordsList = $('#list-albums');
    const albumsList = $('#list-albums');
    const instrumentsList = $('#list-instruments');
    const stylesList = $('#list-styles');
    const productionsList = $('#list-productions');

    // CONTENT ELEMS
    const contentFilters = $('#content-filters');
    const contentResults = $('#content-results');
    const contentPlayer = $('#content-player');

    // *** SEARCH LISTENERS *** //

    // Update mulitlayer flag on click of checkbox
    multilayerCheckbox.on('click', e => {
        multiLayerOnly = e.target.checked ? 1 : 0;
    });

    // Ajax search on input
    searchInput.on('input', e => {
        if (!e.target.value) {
            // remove suggestions and don't request api when no search
            suggestionsElement.hide();
            return;
        }
        suggestionsElement.show();

        // THIS IS JUST HANDLING THE FAKE RESPONSE OBJ
        showSuggestions(fakeResponseObj);
        setNumResults(fakeResponseObj);
        showResults(fakeResponseObj);

        // THIS WOULD BE THE WAY OF DEALING WITH REAL API
        // $.ajax({
        //     url: 'https://api.createmusic.com/search',
        //     data: {
        // search: encodeURI(e.target.value),
        //         multiLayerOnly,
        //     },
        //     success(response) {
        //         // use Response
        //     },
        // });
    });

    // Filter Listeners
    contentFilters.on('click', e => {
        contentFilters.children().removeClass('filter-active');
        e.target.classList.add('filter-active');
    });

    // *** WAVEFORM PLAYER *** //

    const wavesurfer = WaveSurfer.create({
        container: '#wavesurfer',
        progressColor: '#cd364e',
        height: 50,
        responsive: true,
        maxCanvasWidth: 1000,
    });
    wavesurfer.load('./song.mp3');

    const playBtn = $('#audio-play');
    const stopBtn = $('#audio-stop');

    wavesurfer.on('finish', () => {
        wavesurfer.stop();
    });

    wavesurfer.on('play', () => {
        playBtn[0].className = 'far fa-pause-circle fa-2x';
        stopBtn.css({ color: ' #d1d1d1' });
    });

    wavesurfer.on('pause', () => {
        playBtn[0].className = 'far fa-play-circle fa-2x';
    });

    playBtn.on('click', e => {
        wavesurfer.playPause();
    });

    stopBtn.on('click', e => {
        wavesurfer.stop();
        stopBtn.css({ color: '#3f3f3f' });
    });

    // *** API RESPONSE HANDLING *** //

    // Set Number of Results based on Response
    function setNumResults(response) {
        const { searchCueIDs } = response;

        numResults.text(`(${searchCueIDs.length})`);
    }

    function showResults(response) {
        contentResults.html('');
        const { searchCueIDs } = response;

        searchCueIDs.forEach(id => {
            const track = response.cueData[id];

            const trackElement = $(`
                <div class="content-result">
                    <div class="content-description">
                        <h3>${track.albumName}</h3>
                        <p>${track.cueName}</p>
                    </div>
                    <img class="waveform" src=${
                        track.waveformPreview
                    } alt="waveform" />
                    <p >${track.cueStyles.join(', ')}</p>
                </div>
            `);

            trackElement.on('click', e => {
                console.log(e);
            });

            trackElement.appendTo(contentResults);
        });
    }

    // Show Suggestions Based on Response (RIGHT NOW DUMMY)
    function showSuggestions(response) {
        const {
            filters: { ProductionType, Keyword, Alben, Instrument, Style },
        } = response;

        // For each filter list, show matching results:

        productionsList.html('');
        ProductionType.forEach(prod => {
            appendSuggestionItem(prod, productionsList);
        });

        keywordsList.html('');
        Keyword.forEach(keyword => {
            appendSuggestionItem(keyword, keywordsList);
        });

        albumsList.html('');
        Alben.forEach(album => {
            appendSuggestionItem(album, albumsList);
        });

        instrumentsList.html('');
        Instrument.forEach(instrument => {
            appendSuggestionItem(instrument, instrumentsList);
        });

        stylesList.html('');
        Style.forEach(style => {
            appendSuggestionItem(style, stylesList);
        });
    }

    function appendSuggestionItem(item, itemList) {
        // Create new list item
        const itemElement = $(`
                <li class="suggestion-item">
                    ${item}
                </li>
            `);

        // Click on item, modify search
        itemElement.on('click', e => {
            searchInput.val(e.target.innerText);
            suggestionsElement.hide();
        });

        // Append item to DOM
        itemElement.appendTo(itemList);
    }

    // **** FURTHER THINGS TO DO **** //
    /*   
        -Throtteling API Requests
        -Display Results Only When Form Submitted (as opposed to on input field change)
        -display search suggestions more responsibly
        -Make Content Filters work
        -Allow user to playback audio in SEARCH LIST (as opposed to only in player)
        -responsiveness of website
    */

    // SUGGESTION ELEMENTS
    // These can be used to display suggestions only when matches are available
    const keywordsColumn = $('#keywords');
    const albumsColumn = $('#albums');
    const instrumentsColumn = $('#instruments');
    const stylesColumn = $('#styles');
    const productionColumn = $('#production');

    // MENU LINKS
    // Can be used for menu behavior (popping up modals etc)
    const loginLink = $('#login');
    const menuLink = $('#menu');
    const iconLink = $('#icon');
})();
