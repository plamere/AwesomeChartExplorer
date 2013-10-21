


function getRdioPlayer(readyCallback) {
    var curSongIndex = 0;
    var curSongs = [];
    var callback = null;

    function hasTrack(song) {
        return 'rdio' in song;
    }

    function playSong(song) {
        if (hasTrack(song)) {
            R.player.play({
                source: song.rdio
            });

            if (callback) {
                callback(song);
            }
            $("#rp-title").text(song.title);
            $("#rp-artist").text(song.artist_name);
        }
    }

    function playSongs(songs) {
        if (songs.length > 0) {
            curSongIndex = 0;
            curSongs = songs;
            playNextSong();
        }
    }

    function playNextSong() {
        while (curSongIndex < curSongs.length) {
            var song = curSongs[curSongIndex++];
            if (hasTrack(song)) {
                playSong(song);
                break;
            }
        }
    }

    function playPreviousSong() {
        while (curSongIndex > 0) {
            var song = curSongs[--curSongIndex];
            if (hasTrack(song)) {
                playSong(song);
                break;
            }
        }
    }

    function setCallback(cb) {
        callback = cb;
    }

    function getTrackInfo(trackIDs, successCallback, errorCallback) {
        R.request( {
            method:'get',
            content: {
                keys: $.join(trackIDs, ',')
            },
            success: successCallback,
            error: errorCallback
        });
    }


    R.ready(function() {
        R.player.on("change:playingTrack", function(track) {
            if (track) {
                var image = track.attributes.icon;
                console.log('track', track);
                $("#rp-album-art").attr('src', image);
                $("#rp-title").text(track.attributes.name);
                $("#rp-artist").text(track.attributes.artist);

            } else {
                playNextSong();
            }
        });

        R.player.on("change:playState", function(state) {
            if (state == R.player.PLAYSTATE_PAUSED) {
                $("#rp-pause-play i").removeClass("glyphicon-pause");
                $("#rp-pause-play i").addClass("glyphicon-play");
            }
            if (state == R.player.PLAYSTATE_PLAYING) {
                $("#rp-pause-play i").removeClass("glyphicon-play");
                $("#rp-pause-play i").addClass("glyphicon-pause");
            }
        });

        R.player.on("change:playingSource", function(track) {});

        $("#rp-pause-play").click(function() {
            R.player.togglePause();
        });

        $("#rp-album-art").click(function() {
            R.player.togglePause();
        });

        $("#rp-play-next").click(function() {
            playNextSong();
        });

        $("#rp-play-prev").click(function() {
            playPreviousSong();
        });

        readyCallback();
    });


    var methods = {   
        playSongs : playSongs,
        playSong: playSong,
        next:playNextSong,
        prev:playPreviousSong,
        setCallback:setCallback
    }

    return methods;
}


