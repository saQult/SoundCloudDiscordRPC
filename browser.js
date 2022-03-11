
// ==UserScript==
// @name         SoundCloud Discord RPC
// @namespace    kool
// @version      1.0.0
// @description  adds rpc when u listen something
// @author       saqult
// @match        https://soundcloud.com/*
// @grant        none
// ==/UserScript==

  setInterval(() =>
              {
    var song = document.getElementsByClassName('playbackSoundBadge__titleLink')[0];
    var songName = song.innerHTML;
    songName = songName.slice(songName.indexOf('Current'), song.length);
    songName = songName.slice(15, songName.indexOf('<'));
    var songUrl = document.getElementsByClassName('playbackSoundBadge__titleLink')[0].href;
    //songUrl = songUrl.slice(0, songUrl.indexOf('in_system'))
    var avatarElement = document.querySelector('[aria-label="' + songName + '"]');
    var avatarStyle = window.getComputedStyle(avatarElement, null).backgroundImage;
    var avatarUrl = avatarStyle.slice(5, -2);
    avatarUrl = avatarUrl.replace('50x50', '300x300')
    var artist = document.getElementsByClassName('playbackSoundBadge__lightLink')[0].innerHTML;
    var timePassedElement = document.getElementsByClassName('playbackTimeline__progressWrapper')[0];
    var timePassed = timePassedElement.ariaValueNow;
    var songDurationElement = document.getElementsByClassName('playbackTimeline__duration')[0].innerHTML;
    var songDuration = songDurationElement.slice(songDurationElement.indexOf('Duration'));
    songDuration = songDuration.slice(10, songDuration.indexOf('<'));
    var minutes = '';
    var seconds = '';
    var isSeparated = false;
    for(let i = 0; i < songDuration.length; i++)
    {
        if(!isNaN(songDuration[i]))
        {
            if(isSeparated)
            {
                seconds+=songDuration[i].toString();
            }
            else
            {
                minutes+=songDuration[i].toString();
            }
        }
        else
        {
            isSeparated = true
        }
    }
    songDuration = parseInt(minutes) * 60 + parseInt(seconds);
    var isPaused = document.getElementsByClassName('playControl')[0].title == 'Play current' ? true : false;
    var songInfo = {
        name:songName,
        avatar:avatarUrl,
        artist:artist,
        url:songUrl,
        time_passed:timePassed,
        duration:songDuration,
        is_paused: isPaused
    };
    var response = fetch('http://localhost:8080/',
    {
        method: 'POST',
        headers: {
        'Content-Type': 'text/plain;charset=utf-16'
        },
        //body: 'SongName:"' + song + '" AvatarURL:"' + avatarUrl +'" '
        body: JSON.stringify(songInfo)
    });
  }
              , 1000);