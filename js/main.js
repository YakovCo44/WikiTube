'use strict'

const YOUTUBE_API_KEY = 'AIzaSyDhvfxTUodMlBwcJh2RiE2CivYen5Ug1gE'

async function top5SearchResults(query){
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&maxResults=10&key=${YOUTUBE_API_KEY}&q=${query}`

    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log('fetched data:', data.items)
        searchResultsDisplay(data.items)
    }
    catch (error) {
        console.log(error)
    }
}

function searchResultsDisplay(videos) {
    const videoList = document.getElementById('video-list').querySelector('ul')
    videoList.innerHTML = ''

    if (!videos || videos.length === 0) {
        videoList.innerHTML = '<li>No videos found. Please try a different search.</li>'
        return
    }

    videos.forEach(video => {
        const listItem = document.createElement('li')
        listItem.classList.add('video-item') 

        const thumbnailUrl = video.snippet.thumbnails.default.url 
        const title = video.snippet.title

        listItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="Video thumbnail" class="video-thumbnail">
            <span class="video-title">${title}</span>
        `

        listItem.dataset.videoId = video.id.videoId
        listItem.addEventListener('click', () => {
            const videoId = video.id.videoId
            const videoTitle = video.snippet.title
            loadVideo(videoId, videoTitle)
        })

        videoList.appendChild(listItem)
    })
}

function loadVideo(videoId, videoTitle){
    const player = document.getElementById('player')
    player.innerHTML = `<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/${videoId}"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
    </frame>`
}

function performSearch() {
    const query = document.getElementById('search-bar').value.trim()
    if (query) {
        top5SearchResults(query) 
        wikiInfo(query)
        saveSearch(query)
        updateSearchHistory() 
    } else {
        alert('Please enter a search term!')
    }
}

function updateSearchHistory() {
    const historyList = document.getElementById('search-history')
    const history = JSON.parse(localStorage.getItem('searchHistory')) || []

    historyList.innerHTML = ''
    history.forEach(term => {
        const listItem = document.createElement('li')
        listItem.textContent = term
        historyList.appendChild(listItem)
    })
}

function saveSearch(term){
    let history = JSON.parse(localStorage.getItem('searchHistory')) || []
    if (!history.includes(term)) {
        history.push(term)
        localStorage.setItem('searchHistory', JSON.stringify(history))
    }
}

document.getElementById('search-bar').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch()
    }
})

document.getElementById('searchBtn').addEventListener('click', performSearch)

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal')
    const savedColor = localStorage.getItem('themeColor')
    console.log('aplying saved color:', savedColor)
    if (savedColor) {
        document.body.style.backgroundColor = savedColor
    }
    modal.style.display = 'none'
    top5SearchResults('trending videos')
    updateSearchHistory() 
})

async function wikiInfo(query) {
    const sanitizedQuery = encodeURIComponent(query) 
    const url = `https://en.wikipedia.org/w/api.php?&origin=*&action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${sanitizedQuery}&format=json`

    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log('Wikipedia Extract Data:', data) 
        wikiInfoDisplay(data.query.pages) 
    } catch (error) {
        console.error('Error fetching Wikipedia info:', error)
    }
}

function wikiInfoDisplay(pages) {
    const wikiContent = document.getElementById('wiki')
    const page = Object.values(pages)[0] 

    if (page && page.extract) {
        const title = page.title || 'No title available'
        const extract = page.extract

        wikiContent.innerHTML = `
            <h4>${title}</h4>
            <p>${extract}</p>
            <a href="https://en.wikipedia.org/wiki/${title.replace(/ /g, '_')}" target="_blank">Read more on Wikipedia</a>
        `
    } else {
        wikiContent.innerHTML = '<p>No detailed Wikipedia information found for this search term.</p>'
    }
}

document.getElementById('clear-history').addEventListener('click', () => {
    const modal = document.getElementById('modal')
    modal.style.display = 'flex' 
})

document.getElementById('yesBtn').addEventListener('click', () => {
    clearSearchHistory() 
    closeModal() 
})

document.getElementById('noBtn').addEventListener('click', closeModal)

function closeModal() {
    const modal = document.getElementById('modal')
    modal.style.display = 'none' 
}

function clearSearchHistory() {
    localStorage.removeItem('searchHistory')
    updateSearchHistory() 
}

document.getElementById('themeBtn').addEventListener('click', () => {
    const themeModal = document.getElementById('themeModal')
    themeModal.style.display = 'flex'
})

document.getElementById('closeThemeModal').addEventListener('click', () => {
    const themeModal = document.getElementById('themeModal')
    themeModal.style.display = 'none'
})

document.querySelectorAll('.color-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const color = event.target.getAttribute('data-color')
        console.log('themecolor:', color)

        if (color){
            document.body.style.backgroundColor = color
            localStorage.setItem('themeColor', color)
            console.log('saved color:', document.body.style.backgroundColor)
        } else {
            console.error('Color not found')
        } 
        const themeModal = document.getElementById('themeModal')
        themeModal.style.display = 'none' 
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const savedColor = localStorage.getItem('themeColor')
    if (savedColor) {
        document.body.style.backgroundColor = savedColor
    }
})






