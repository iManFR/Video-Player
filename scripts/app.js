/**********************
VARIABLES
**********************/

//Declaration of the object
const player = {} 

//Declaration of the properties of the object
player.$background = document.querySelector('.player-background')
player.$container = player.$background.querySelector('.player')
player.$video = player.$container.querySelector('video')
player.$topBar = player.$container.querySelector('.top-bar')
player.$watching = player.$container.querySelector('.watching')
player.$title = player.$watching.querySelector('h1')
player.$upnext = player.$container.querySelector('.upnext')
player.$upnextTitle = player.$upnext.querySelectorAll('h1')
player.$upnextIcon = player.$upnext.querySelectorAll('img')
player.$controlBar = player.$container.querySelector('.control-bar')
player.$play = player.$controlBar.querySelector('.play-pause .play')
player.$pause = player.$controlBar.querySelector('.play-pause .pause')
player.$seek = player.$controlBar.querySelector('.seek')
player.$fill = player.$seek.querySelector('.fill')
player.$buffered = player.$seek.querySelector('.buffered')
player.$bubbleCursor = player.$fill.querySelector('.bubble-cursor')
player.$currentTime = player.$bubbleCursor.querySelector('.current-time')
player.$videoDuration = player.$controlBar.querySelector('.video-duration p')
player.$fullScreen = player.$controlBar.querySelector('.fullscreen i')
player.$soundBar = player.$controlBar.querySelector('.sound-bar')
player.$unmute = player.$controlBar.querySelector('.unmuted')
player.$mute = player.$controlBar.querySelector('.muted')
player.$seekVolume = player.$controlBar.querySelector('.seek-sound')
player.$fillVolume = player.$controlBar.querySelector('.fill-sound')
player.$bubbleVolume = player.$fillVolume.querySelector('.bubble-volume')


/**********************
FUNCTIONS INITIALIZATION
**********************/

//Video Play Function
const togglePlay = () => {
    player.$video.play()
    //Hide play icon
    player.$play.style.display = 'none'
    //Show pause icon
    player.$pause.style.display = 'block'
}

//Video Play Function
const togglePause = () => {
    player.$video.pause()
    //Show play icon
    player.$play.style.display = 'block'
    //Hide pause icon
    player.$pause.style.display = 'none'
}

//Hide infos and controls
const hideHud = () => {
    if (!player.$controlBar.classList.contains('collapsed')) {
      player.$controlBar.classList.add('collapsed')
      player.$watching.classList.add('collapsed')
      player.$topBar.classList.add('collapsed')
      player.$upnext.classList.add('collapsed')
      player.$container.style.cursor = 'none'
    }
}

//Show infos and controls
const showHud = () => {
    if (player.$controlBar.classList.contains('collapsed')) {
      player.$controlBar.classList.remove('collapsed')
      player.$watching.classList.remove('collapsed')
      player.$topBar.classList.remove('collapsed')
      player.$upnext.classList.remove('collapsed')
      player.$container.style.cursor = 'default'
    }
}

//Reset player size after fullscreen leave
const resetPlayerStyle = () => {
    player.$container.style.width ='65%'
}

// Turn fullscreen on and off
let fullscreenExitHandled = false
const toggleFullscreen = () => {
    // Check fullscreen state
    if (window.innerHeight == screen.height) {
      // Fullscreen is on, turn it off
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
      // Reset styling
      resetPlayerStyle()
      // Confirm successful fullscreen escape
      fullscreenExitHandled = true
    } else {
      // Fullscreen is off, turn it on
      if (player.$container.requestFullscreen) {
        player.$container.requestFullscreen()
      } else if (player.$container.msRequestFullscreen) {
        player.$container.msRequestFullscreen()
      } else if (player.$container.mozRequestFullScreen) {
        player.$container.mozRequestFullScreen()
      } else if (player.$container.webkitRequestFullscreen) {
        player.$container.webkitRequestFullscreen()
      }
      // Adapt elements to fullscreen
      player.$container.style.width = '100%'
      // Initialize successful fulscreen escape
      fullscreenExitHandled = false
    }
}

//Update video progression bar (scale)
const videoProgress = () => {
    window.requestAnimationFrame(videoProgress)
    if (!player.$video.paused){
        const scale = player.$video.currentTime / player.$video.duration
        player.$fill.style.transform = `scaleX(${scale})`
        player.$fill.style.transformOrigin = `0`
        //Reset cursor scale
        player.$bubbleCursor.style.transform = `scaleX(${1/scale})`
    }
}
videoProgress()

//Update volume bar scale
const changeVolume = () => {
    let videoVolume = player.$video.volume
    player.$fillVolume.style.transform = `scaleY(${videoVolume})`
    player.$fillVolume.style.transformOrigin = `bottom`
    //Reset cursor scale
    player.$bubbleVolume.style.transform = `scaleY(${1/videoVolume})`
}
changeVolume()

//Mute the audio, change icons
const toggleMute = () => {
    player.$video.volume = 0
    player.$mute.style.display = 'block'
    player.$unmute.style.display = 'none'
    //Hide Sound bar
    player.$soundBar.style.display = 'none'
}

//Unmute the audio, change icons
const toggleUnmute = () => {
    player.$video.volume = 1
    player.$mute.style.display = 'none'
    player.$unmute.style.display = 'block'
    //Display sound bar
    player.$soundBar.style.display = 'flex'
}


/**********************
HOVER EVENTS
**********************/

//Hide hud(controls) if mouse is not moving
let collapseTimeout = () => {
    timeout = window.setTimeout(hideHud, 4000)
}
collapseTimeout()

player.$container.addEventListener('mouseenter', collapseTimeout)

player.$container.addEventListener('mousemove', () => {
    window.clearTimeout(timeout)
    showHud()
    collapseTimeout()
})

player.$background.addEventListener('mouseover', () => {
    hideHud()
})


/**********************
CLICK EVENTS
**********************/

//Play Button Callback function
player.$play.addEventListener('click', () => {
    togglePlay()
})

//Pause Button Callback function
player.$pause.addEventListener('click', () => {
    togglePause()
})

//Fullscreen Button Callback Function
player.$fullScreen.addEventListener('click', () => {
    toggleFullscreen()
})

//Double Click to fullscreen
player.$video.addEventListener('dblclick', () => {
    toggleFullscreen()
})

//Click on player to play or pause
player.$video.addEventListener('click', () => {
    if (player.$video.paused){
        togglePlay()
    } else {
        togglePause()
    }
})

//Seek clickable
player.$seek.addEventListener('click', (e) => {
    const mouseX = e.clientX
    const bounding = player.$seek.getBoundingClientRect()
    const ratio = (mouseX - bounding.left) / bounding.width
    const time = ratio * player.$video.duration

    player.$video.currentTime = time
    player.$video.play()
    player.$play.style.display = 'none'
    player.$pause.style.display = 'block'
})

//Volume Seek clickable
player.$seekVolume.addEventListener('click', (e) => {
    const mouseY = e.clientY
    const bounding = player.$seekVolume.getBoundingClientRect()
    const ratio = (mouseY - bounding.bottom) / bounding.height
    player.$video.volume = Math.abs(ratio)
    changeVolume()
})

//Mute on click
player.$mute.addEventListener('click', () => {
    toggleUnmute()
})

//Unmute on click
player.$unmute.addEventListener('click', () => {
    toggleMute()
})

/**********************
KEYBIND EVENTS
**********************/

document.addEventListener('keyup', (e) => {
    //Space bar to play
    if (e.which === 32 && player.$video.paused){
        togglePlay()
    //Space bar to pause
    } else if (e.which === 32 && player.$video.play){
        togglePause()
    //F to fullscreen
    } else if (e.which === 70 || e.which === 27){
        toggleFullscreen()
        resetPlayerStyle()
    //Left arrow to add -10 seconds on timeline
    } else if (e.which === 37){
        player.$video.currentTime -= 10
    //Right arrow to add +10 seconds on timeline
    } else if (e.which === 39){
        player.$video.currentTime += 10
    //M to unmute when volume muted
    } else if (e.which === 77 && player.$video.volume == 0){
        toggleUnmute()
    //M to mute when volume unmuted
    } else if (e.which === 77 && player.$video.volume > 0){
        toggleMute()
    //Up arrow to volume up (0.1)
    } else if (e.which === 40){
        player.$video.volume -= 0.1
        changeVolume()
    //Down arrow to volume down (0.1)
    } else if (e.which === 38){
        player.$video.volume += 0.1
        changeVolume()
    }
})


/**********************
DRAG EVENT
**********************/
//Drag on Timeline
player.$bubbleCursor.addEventListener('mousedown', () => {
    window.addEventListener('mousemove', dragging = (e) => {
        const mouseX = e.clientX
        const bounding = player.$seek.getBoundingClientRect()
        const ratio = (mouseX - bounding.left) / bounding.width
        const time = ratio * player.$video.duration
        player.$video.currentTime = time
        player.$video.play()
    })
    window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', dragging)
    })
})

//Drag on volume bar
player.$bubbleVolume.addEventListener('mousedown', () => {
    window.addEventListener('mousemove', draggingVolume = (e) => {
        const mouseY = e.clientY
        const bounding = player.$seekVolume.getBoundingClientRect()
        const ratio = (mouseY - bounding.bottom) / bounding.height
        player.$video.volume = Math.abs(ratio) 
    })
    window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', draggingVolume)
    })
})


/**********************
DISPLAY INFO
**********************/

//Display video duration after timeline
player.$video.addEventListener('loadedmetadata', () => {
    //Display video duration on player
    let durmins = Math.floor(player.$video.duration / 60)
    let dursecs = Math.round(player.$video.duration - durmins * 60)
    if (dursecs < 10){
        dursecs = `0${+ dursecs}`
    }
    player.$videoDuration.innerHTML = `${durmins}:${dursecs}`
})

const displayCurrentTime = () => {
    let durmins = Math.floor(player.$video.currentTime / 60)
    let dursecs = Math.round(player.$video.currentTime - durmins * 60)
    if (dursecs < 10){
        dursecs = `0${+ dursecs}`
    }
    player.$currentTime.textContent = `${durmins}:${dursecs}`
}
setTimeout(displayCurrentTime, 0)
setInterval(displayCurrentTime, 100)



//Database Playlist Video
const playlist = [{
    'title': 'BREAKING BAD',
    'srcV': 'videos/breaking-bad.mp4',
    'srcP': 'images/bb-poster.jpg',
    'icon': 'images/bb-icon.jpg',
    'time': '0'
}, {
    'title': 'THE WALKING DEAD',
    'srcV': 'videos/the-walking-dead.mp4',
    'srcP': 'images/twd-poster.jpg',
    'icon': 'images/twd-icon.jpg',
    'time': '0'
}, {
    'title': 'ORANGE IS THE NEW BLACK',
    'srcV': 'videos/orange-is-the-new-black.mp4',
    'srcP': 'images/oitnb.jpg',
    'icon': 'images/oitnb-icon.jpg',
    'time': '0'
}, {
    'title': 'RICK AND MORTY',
    'srcV': 'videos/rick-and-morty.mp4',
    'srcP': 'images/rm-poster.jpg',
    'icon': 'images/rm-icon.jpg',
    'time': '0'
}]

//Init first video
player.$title.innerHTML = playlist[0].title
player.$video.setAttribute('src', playlist[0].srcV)
player.$video.setAttribute('poster', playlist[0].srcP)
player.$video.currentTime = playlist[0].time

//Setup current video index
const updateCurrentVideo = () => {
    player.$title.innerHTML = playlist[index].title
    player.$video.setAttribute('src', playlist[index].srcV)
    player.$video.setAttribute('poster', playlist[index].srcP)
    player.$video.currentTime = playlist[index].time
    player.$video.play()
}

//Auto change current video when previous is over
let index = 0
const changeVideo = () => {
    if (player.$video.currentTime == player.$video.duration){
        index += 1
        updateCurrentVideo()
    }
}
window.setInterval(changeVideo, 1000)

/*const updateUpnextInfo = () => {
    for (let i = 0; i < player.$upnextIcon.length; i++){
        index += i + 1 
        player.$upnextIcon[i].setAttribute('src', playlist[index].icon)
    }
}
updateUpnextInfo()*/
