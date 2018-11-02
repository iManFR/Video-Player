class Player {
	
	init($_player, $_media, trackURL) {
		this.$player = document.querySelector($_player)
		this.$media = this.$player.querySelector($_media)

		this.$media.addEventListener('loadedmetadata', () => {
			if (this.$media.tagName == 'VIDEO') {
				const resize = () => {
					this.$media.setAttribute('height', this.$player.offsetHeight)
				}
				resize()

				window.addEventListener('resize', () => {
					resize()
				})
			}
		})

		this.$media.src = trackURL
	}

	controls($_controls) {
		const $controls = this.$player.querySelector($_controls)

		this.$player.addEventListener('mousemove', () => {
			
			$controls.classList.add('visible')
			
			setTimeout(() => {
				$controls.classList.remove('visible')
			},2000)
		})
	}

	playPause($_playPause) {
		const $playPause = this.$player.querySelector($_playPause)

		let isPlaying = false
		$playPause.classList.remove('playing')

		const updatePlayPause = () => {
			if (isPlaying == false) {
				$playPause.classList.add('playing')
				this.$media.play()
				isPlaying = true
			}
			else {
				$playPause.classList.remove('playing')
				this.$media.pause()
				isPlaying = false
			}
		}
		
		$playPause.addEventListener('mousedown', () => {
			updatePlayPause()
		})

		document.addEventListener('keydown', (event) => {
			if (event.keyCode == 32) {
				updatePlayPause()
			}
		})
	}

	time($_currentTime, $_totalTime, $_timeBar) {
		this.$media.addEventListener('loadedmetadata', () => {
			const $currentTime = this.$player.querySelector($_currentTime)
			const $totalTime = this.$player.querySelector($_totalTime)
			const $timeBar = this.$player.querySelector($_timeBar)
			const $currentTimeBar = $timeBar.querySelector('.current')
			const $currentThumbnail = document.querySelector('.current-thumbnail')

			let grabbing = false
			let nexted = false

			this.convertHHMMSS = (time) => {
				let hours = Math.floor(time / 3600)
				let minutes = Math.floor(time % 3600 / 60)
				let seconds = Math.floor(time % 3600 % 60)

				const leadingZero = (number) => {
					if (number < 10) {
						return '0' + number
					}
					else {
						return number
					}
				}

				if (this.$media.duration < 3600) {
					return `${leadingZero(minutes)}:${leadingZero(seconds)}`
				}
				else {
					return `${leadingZero(hours)}:${leadingZero(minutes)}:${leadingZero(seconds)}`
				}
			}

			const updateCurrentTime = (time, mousePercent) => {
				$currentTime.innerHTML = this.convertHHMMSS(time)
				$currentTimeBar.style.width = `${mousePercent}%`

				if (this.$media.currentTime + 1 >= this.$media.duration) {
					if (nexted == false) {
						nexted = true
						playlist.next()
					}
				}		
			}
			updateCurrentTime(this.$media.currentTime, 0)
			this.$media.addEventListener('timeupdate', () => {
				updateCurrentTime(this.$media.currentTime, this.$media.currentTime / this.$media.duration * 100)
			})

			$totalTime.innerHTML = this.convertHHMMSS(this.$media.duration)

			this.$player.addEventListener('mousemove', () => {
				const grab = () => {
					const mousePercent = ((event.clientX - $timeBar.offsetLeft - this.$player.offsetLeft) / $timeBar.offsetWidth * 100)
					
					const time = mousePercent / 100 * this.$media.duration

					this.$media.currentTime = time
					updateCurrentTime(time, mousePercent)
				}

				if (grabbing) {
					grab()
				}
				
				$timeBar.addEventListener('mousedown', () => {
					grabbing = true
					grab()
				})

				document.addEventListener('mouseup', () => {
					grabbing = false
				})
			})

			document.addEventListener('keydown', (event) => {
				switch (event.keyCode) {
				case 37: // arrow left
					this.$media.currentTime -= 5
					break
				case 39: // arrow right
					this.$media.currentTime += 5
					break
				case 49: // 1
					this.$media.currentTime = this.$media.duration * .1
					break
				case 50: // 2
					this.$media.currentTime = this.$media.duration * .2
					break
				case 51: // 3
					this.$media.currentTime = this.$media.duration * .3
					break	
				case 52: // 4
					this.$media.currentTime = this.$media.duration * .4
					break	
				case 53: // 5
					this.$media.currentTime = this.$media.duration * .5
					break
				case 54: // 6
					this.$media.currentTime = this.$media.duration * .6
					break
				case 55: // 7
					this.$media.currentTime = this.$media.duration * .7
					break	
				case 56: // 8
					this.$media.currentTime = this.$media.duration * .8
					break	
				case 57: // 9
					this.$media.currentTime = this.$media.duration * .9
					break	
				case 48: // 0
					this.$media.currentTime = this.$media.duration
					break	
				}
				updateCurrentTime(this.$media.currentTime)
			})
		})
	}

	volume($_volumeIcon, $_volumeBar) {
		const $volumeIcon = this.$player.querySelector($_volumeIcon)
		const $volumeBar = this.$player.querySelector($_volumeBar)
		const $currentVolumeBar = $volumeBar.querySelector('.current')

		this.volume = .5
		let memVolume = null
		let isMuted = false
		let grabbing = false

		const updateVolume = (volume) => {
			this.volume = volume

			if (this.volume < 0) {
				this.volume = 0
			}

			if (this.volume >= .75) {
				$volumeIcon.innerHTML = '<i class="fa fa-volume-up" aria-hidden="true"></i>'
			}
			else if (this.volume == 0) {
				$volumeIcon.innerHTML = '<i class="fa fa-volume-off" aria-hidden="true"></i>'
			}
			else {
				$volumeIcon.innerHTML = '<i class="fa fa-volume-down" aria-hidden="true"></i>'
			}

			$currentVolumeBar.style.width = `${volume * $volumeBar.offsetWidth}px`
			
			this.$media.volume = this.volume
		}
		updateVolume(.5)

		const mute = () => {
			if (isMuted) {
				isMuted = false
				updateVolume(memVolume)
			}
			else {
				memVolume = this.volume
				isMuted = true
				updateVolume(0)
			}
		}

		$volumeIcon.addEventListener('mousedown', () => {
			mute()
		})

		$volumeBar.addEventListener('mousemove', () => {
			if (grabbing) {
				let mousePosX = (event.clientX - $volumeBar.offsetLeft - this.$player.offsetLeft)
				if (mousePosX > $volumeBar.offsetWidth) {
					mousePosX = $volumeBar.offsetWidth
				}
				updateVolume(mousePosX / $volumeBar.offsetWidth)
			}
			
			$volumeBar.addEventListener('mousedown', () => {
				grabbing = true
			})

			$volumeBar.addEventListener('mouseup', () => {
				grabbing = false
			})

			$volumeBar.addEventListener('mouseout', () => {
				grabbing = false
			})
		})

		document.addEventListener('keydown', (event) => {
			switch (event.keyCode) {
			case 38:
				if (this.$media.volume <= .9) {
					this.$media.volume += .1
				}
				else {
					this.$media.volume = 1
				}
				updateVolume(this.$media.volume)	
				break
			case 40:
				if (this.$media.volume >= .1) {
					this.$media.volume -= .1
				}
				else {
					this.$media.volume = 0
				}
				updateVolume(this.$media.volume)
				break
			case 77:
				mute()
				break
			}	
		})
	}

	fullscreen() {
		const $fullscreen = this.$player.querySelector('.fullscreen')

		const fullscreen = () => {
			if (navigator.userAgent.indexOf('Chrome') != -1) {
				this.$media.webkitRequestFullscreen()
			}
			else if (navigator.userAgent.indexOf('Firefox') != -1) {
				this.$media.mozRequestFullscreen()
			}
			else if ((navigator.userAgent.indexOf('MSIE') != -1 ) || (!!document.documentMode == true )) {
				this.$media.msRequestFullscreen()
			}
			else {
				alert('Plein écran non supporté...')
			}
		}

		$fullscreen.addEventListener('mousedown', () => {
			fullscreen()
		})

		document.addEventListener('keydown', (event) => {
			if (event.keyCode == 70) {
				fullscreen()
			}
		})
	}
}