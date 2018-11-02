/* global Player */

const player = new Player()
const playlist = new Playlist()

let trackURL = 'assets/media/cabiac.mp4'

player.init('.player', '.media', trackURL)

// PLAYER FEATURES 
player.controls('.controls')
player.playPause('.play-pause')
player.time('.current-time', '.total-time', '.time-bar')
player.volume('.volume-icon', '.volume-bar')
player.fullscreen('.fullscreen')


playlist.init('.import')