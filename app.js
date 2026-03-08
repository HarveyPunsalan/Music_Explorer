// ── Grab HTML elements ──
const searchInput = document.getElementById('search-input')
const searchBtn   = document.getElementById('search-btn')
const resultsGrid = document.getElementById('results-grid')
const statusMsg   = document.getElementById('status-msg')
const nowPlaying  = document.getElementById('now-playing')
const audioPlayer = document.getElementById('audio-player')
const npSong      = document.getElementById('np-song')
const npArtist    = document.getElementById('np-artist')
const npCover     = document.getElementById('np-cover')
const closeNp     = document.getElementById('close-np')

// ── Search function ──
async function searchMusic() {
    const query = searchInput.value.trim()
    if (!query) return

    statusMsg.textContent = 'Searching...'
    statusMsg.style.display = 'block'
    resultsGrid.innerHTML = ''

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=24`

    try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.resultCount === 0) {
            statusMsg.textContent = 'No results found. Try a different search!'
            return
        }

        statusMsg.style.display = 'none'
        displayResults(data.results)

    } catch (error) {
        statusMsg.textContent = 'Something went wrong. Check your internet connection!'
        console.error(error)
    }
}

// ── Build and display cards ──
function displayResults(songs) {
    songs.forEach((song, index) => {
        const card = document.createElement('div')
        card.classList.add('song-card')
        card.style.animationDelay = `${index * 40}ms`

        const hasPreview = song.previewUrl && song.previewUrl !== 'null'

        card.innerHTML = `
      <img class="song-cover" src="${song.artworkUrl100}" alt="${song.trackName}"/>
      <div class="card-body">
        <p class="song-title">${song.trackName}</p>
        <p class="song-artist">${song.artistName}</p>
        <p class="song-album">${song.collectionName || 'Unknown Album'}</p>
      </div>
      <button
        class="play-btn ${hasPreview ? '' : 'no-preview'}"
        data-preview="${song.previewUrl}"
        data-song="${song.trackName}"
        data-artist="${song.artistName}"
        data-cover="${song.artworkUrl100}">
        ${hasPreview ? '▶ Play Preview' : '✕ No Preview'}
      </button>
    `

        resultsGrid.appendChild(card)
    })

    attachPlayListeners()
}

// ── Attach click events to play buttons ──
function attachPlayListeners() {
    document.querySelectorAll('.play-btn:not(.no-preview)').forEach(btn => {
        btn.addEventListener('click', () => {
            const previewUrl = btn.dataset.preview
            const songName   = btn.dataset.song
            const artistName = btn.dataset.artist
            const coverUrl   = btn.dataset.cover

            npSong.textContent   = songName
            npArtist.textContent = artistName
            npCover.src          = coverUrl
            audioPlayer.src      = previewUrl
            audioPlayer.play()

            nowPlaying.classList.remove('hidden')
        })
    })
}

// ── Close now playing bar ──
closeNp.addEventListener('click', () => {
    audioPlayer.pause()
    audioPlayer.src = ''
    nowPlaying.classList.add('hidden')
})

// ── Event listeners ──
searchBtn.addEventListener('click', searchMusic)
searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchMusic()
})
