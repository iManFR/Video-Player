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
player.$upnext = player.$container.querySelector('.upnext')
player.$controlBar = player.$container.querySelector('.control-bar')
player.$play = player.$controlBar.querySelector('.play-pause .play')
player.$pause = player.$controlBar.querySelector('.play-pause .pause')
player.$seek = player.$controlBar.querySelector('.seek')
player.$fill = player.$seek.querySelector('.fill')
player.$bubbleCursor = player.$fill.querySelector('.bubble-cursor')
player.$videoDuration = player.$controlBar.querySelector('.video-duration p')
player.$fullScreen = player.$controlBar.querySelector('.fullscreen i')
player.$soundBar = player.$controlBar.querySelector('.sound-bar')
player.$unmute = player.$controlBar.querySelector('.unmuted')
player.$mute = player.$controlBar.querySelector('.muted')
player.$seekVolume = player.$controlBar.querySelector('.seek-sound')
player.$fillVolume = player.$controlBar.querySelector('.fill-sound')


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
const loop = () => {
    window.requestAnimationFrame(loop)
    if (!player.$video.paused){
        const scale = player.$video.currentTime / player.$video.duration
        player.$fill.style.transform = `scaleX(${scale})`
        player.$fill.style.transformOrigin = `0`
        //Reset cursor scale
        player.$bubbleCursor.style.transform = `scaleX(${1/scale})`
    }
}
loop()

//Update volume bar scale
const changeVolume = () => {
    let videoVolume = player.$video.volume
    player.$fillVolume.style.transform = `scaleY(${videoVolume})`
    player.$fillVolume.style.transformOrigin = `bottom`
}
changeVolume()

//
const toggleMute = () => {
    player.$video.volume = 0
    player.$mute.style.display = 'block'
    player.$unmute.style.display = 'none'
    player.$soundBar.style.display = 'none'
}

const toggleUnmute = () => {
    player.$video.volume = 1
    player.$mute.style.display = 'none'
    player.$unmute.style.display = 'block'
    player.$soundBar.style.display = 'flex'
}

/**********************
HOVER EVENTS
**********************/

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

player.$mute.addEventListener('click', () => {
    toggleUnmute()
})

player.$unmute.addEventListener('click', () => {
    toggleMute()
})

/**********************
KEYBIND EVENTS
**********************/

document.addEventListener('keyup', (e) => {
    if (e.which === 32 && player.$video.paused){
        togglePlay()
    } else if (e.which === 32 && player.$video.play){
        togglePause()
    } else if (e.which === 70 || e.which === 27){
        toggleFullscreen()
    } else if (e.which === 37){
        player.$video.currentTime -= 10
    } else if (e.which === 39){
        player.$video.currentTime += 10
    } else if (e.which === 77 && player.$video.volume == 0){
        toggleUnmute()
    } else if (e.which === 77 && player.$video.volume > 0){
        toggleMute()
    } else if (e.which === 40){
        player.$video.volume -= 0.1
        changeVolume()
    } else if (e.which === 38){
        player.$video.volume += 0.1
        changeVolume()
    }
})


/**********************
DISPLAY INFO
**********************/

player.$video.addEventListener('loadedmetadata', () => {
    //Display video duration on player
    let durmins = Math.floor(player.$video.duration / 60)
    let dursecs = Math.round(player.$video.duration - durmins * 60)
    if (dursecs < 10){
        dursecs = `0${+ dursecs}`
    }
    player.$videoDuration.innerHTML = `${durmins}:${dursecs}`
})
