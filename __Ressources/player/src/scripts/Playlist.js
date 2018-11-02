class Playlist {

	init($_import) {
		this.list = []
		this.$temp = document.querySelector('.temp')
		this.$mediaName = document.querySelector('.media-name')

		const $import = document.querySelector($_import)
		$import.addEventListener('change', () => {
			playlist.add($import)
		})
	}

	add($import) {
		const $video = document.querySelector('video')
		const $file = $import.files[0]
		const reader = new FileReader()

		reader.addEventListener('load', () => {
			this.$mediaName.innerHTML 

			const cleanName = (url) => {
				url = url.split('\\')[2].split('.')[0]
				url = url.replace('-', ' ')
				return url
			}
	
			const trackName = cleanName($import.value)
			this.$temp.src = reader.result

			this.list.push([reader.result, trackName])
			playlist.updateList(this.list)

		}, false)

		if ($file) {
			reader.readAsDataURL($file)
		}
	}

	updateList(tracks) {
		const $tracks = document.querySelector('.tracks')

		$tracks.innerHTML = ''
		
		for (const track of tracks) {
			const trackURL = track[0]
			const trackName = track[1]

			const $track = document.createElement('div')
			$track.classList.add('track')
			$tracks.appendChild($track)

			const $trackName = document.createElement('div')
			$trackName.classList.add('track-name')
			$trackName.innerHTML = trackName
			$track.appendChild($trackName)

			const $skip = document.createElement('button')
			$skip.classList.add('skip')
			$skip.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>'
			$track.appendChild($skip)

			playlist.skip()
		}
	}

	next() {
		if (this.list[0]) {
			const trackURL = this.list[0][0]
			const trackName = this.list[0][1]
			this.list.splice(0, 1)
			playlist.updateList(this.list)
			this.$mediaName.innerHTML = trackName
			player.init('.player', 'video', trackURL)
			player.playPause('.play-pause')
		}
	}

	skip() {
		const $skips = document.querySelectorAll('.skip')

		for (let skip = 0; skip < $skips.length; skip++) {
			$skips[skip].addEventListener('mousedown', () => {
				player.init('.player', '.media', this.list[skip][0])
				this.list.splice(skip, 1)
				updateList(this.list)
			})
		}
	}
}
