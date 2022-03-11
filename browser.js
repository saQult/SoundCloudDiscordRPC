
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
    var firstNum = '';
    var secondNum = '';
    var isSeparated = false;
    var finalDuration = 228;
    for(let i = 0; i < songDuration.length; i++)
    {
        if(!isNaN(songDuration[i]))
        {
            if(isSeparated)
            {
                secondNum+=songDuration[i].toString();
            }
            else
            {
                firstNum+=songDuration[i].toString();
            }
        }
        else
        {
            isSeparated = true;
        }
    }
    if(songDuration.includes('minut') && songDuration.includes('secon')){
        finalDuration = firstNum * 60 + secondNum;
    }
    else if(songDuration.includes('minut') == false)
    {
        finalDuration = firstNum;
    }
    else if(songDuration.includes('secon') == false){
        finalDuration = firstNum * 60;
    }
    //console.log(songDuration)
    var isPaused = document.getElementsByClassName('playControl')[0].title == 'Play current' ? true : false;
    var songInfo = {
        name:songName,
        avatar:avatarUrl,
        artist:artist,
        url:songUrl,
        time_passed:timePassed,
        duration:finalDuration,
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
