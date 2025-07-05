document.addEventListener('DOMContentLoaded', () => {
    // Initialize all necessary elements
    const welcomeContainer = document.querySelector('.welcome-container');
    const selectionContainer = document.querySelector('.selection-container');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const languageCards = document.querySelectorAll('.language-card');
    const moodCards = document.querySelectorAll('.mood-card');
    const moodContainer = document.querySelector('.mood-container');
    const playlistContainer = document.querySelector('.playlist-container');
    const playlist = document.querySelector('.playlist');
    const backToLanguageBtn = document.getElementById('backToLanguage');
    const backToMoodBtn = document.getElementById('backToMood');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    let selectedLanguage = '';
    let selectedMood = '';

    // Search functionality
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    document.querySelector('.search-container').appendChild(searchResults);

    function performSearch(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            searchResults.classList.remove('active');
            return;
        }

        const results = [];
        
        // Search languages
        languageCards.forEach(card => {
            const language = card.dataset.language;
            if (language.toLowerCase().includes(query)) {
                results.push({
                    type: 'language',
                    name: language.charAt(0).toUpperCase() + language.slice(1),
                    element: card
                });
            }
        });

        // Search moods
        moodCards.forEach(card => {
            const mood = card.dataset.mood;
            if (mood.toLowerCase().includes(query)) {
                results.push({
                    type: 'mood',
                    name: mood.charAt(0).toUpperCase() + mood.slice(1),
                    element: card
                });
            }
        });

        displaySearchResults(results);
    }

    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-result-item';
            noResults.textContent = 'No results found';
            searchResults.appendChild(noResults);
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = `search-result-item ${result.type}`;
                resultItem.innerHTML = `
                    <i class="fas fa-${result.type === 'language' ? 'globe' : 'heart'}"></i>
                    ${result.name}
                `;
                
                resultItem.addEventListener('click', () => {
                    if (result.type === 'language') {
                        selectedLanguage = result.element.dataset.language;
                        selectionContainer.classList.add('hidden');
                        moodContainer.classList.remove('hidden');
                    } else {
                        selectedMood = result.element.dataset.mood;
                        moodContainer.classList.add('hidden');
                        playlistContainer.classList.remove('hidden');
                        generatePlaylist();
                    }
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.classList.add('active');
    }

    // Search event listeners
    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value);
    });

    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });

    // Welcome page interaction
    const exploreBtn = document.querySelector('.explore-btn');
    const playlistBtn = document.querySelector('.playlist-btn');

    exploreBtn.addEventListener('click', () => {
        welcomeContainer.classList.add('hidden');
        selectionContainer.classList.remove('hidden');
    });

    playlistBtn.addEventListener('click', () => {
        welcomeContainer.classList.add('hidden');
        selectionContainer.classList.remove('hidden');
    });

    // Theme Toggle Functionality
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Mood to search query mapping
    const moodToQuery = {
        'happy': 'happy upbeat cheerful feel-good pop songs positive vibes',
        'relaxing': 'relaxing chill acoustic calm peaceful lo-fi smooth vibes',
        'sad': 'sad emotional heartbroken melancholic slow ballads moody music',
        'romantic': 'romantic love songs date night slow dance passionate music',
        'focus': 'focus concentration deep work study music instrumental ambient productivity',
        'workout': 'workout energetic gym power cardio running high tempo beats',
        'dark': 'dark ambient moody eerie mysterious deep gothic cinematic music',
        'party': 'party dance club bangers EDM night out fun hits',
        'roadtrip': 'roadtrip travel driving adventure car journey open road playlist',
        'sleep': 'sleep calm soothing ambient lullabies peaceful rest nighttime',
        'random': 'random top hits trending popular viral mixed genres surprise me'
    };
    
    // Language to query mapping
    const languageToQuery = {
        'english': 'english',
        'hindi': 'hindi',
        'korean': 'korean',
        'japanese': 'japanese',
        'punjabi': 'punjabi',
        'tamil': 'tamil',
        'telugu': 'telugu',
        'malayalam': 'malayalam',
        'bhojpuri': 'bhojpuri',
        'haryanvi': 'haryanvi',
        'marathi': 'marathi',
        'mix': ''
    };

    // Function to fetch songs from YouTube Data API
    async function fetchSongsByMood(mood, language = '') {
        try {
            let query = moodToQuery[mood] || 'popular songs';
            if (language && languageToQuery[language]) {
                query += ` ${languageToQuery[language]}`;
            }
            
            const API_KEY = '12345678';
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&videoDuration=medium&key=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                // Filter out shorts and get top 10 results
                const filteredItems = data.items
                    .filter(item => {
                        const title = item.snippet.title.toLowerCase();
                        return !title.includes('shorts') && 
                               !title.includes('#shorts') && 
                               !title.includes('short') &&
                               !title.includes('yt shorts') &&
                               !title.includes('short') &&
                               !title.includes('funny') &&
                               !title.includes('youtube shorts');
                    })
                    .slice(0, 10);
                
                return filteredItems.map(item => ({
                    title: item.snippet.title,
                    artist: item.snippet.channelTitle,
                    youtubeLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    image: item.snippet.thumbnails.default.url
                }));
            } else {
                console.error('No songs found in API response:', data);
                return getFallbackSongs(mood, language);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            return getFallbackSongs(mood, language);
        }
    }

    // Language selection
    languageCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedLanguage = card.dataset.language;
            selectionContainer.classList.add('hidden');
            moodContainer.classList.remove('hidden');
        });
    });

    // Mood selection
    moodCards.forEach(card => {
        card.addEventListener('click', async () => {
            selectedMood = card.dataset.mood;
            moodContainer.classList.add('hidden');
            playlistContainer.classList.remove('hidden');
            await generatePlaylist();
        });
    });

    // Back to language selection
    backToLanguageBtn.addEventListener('click', () => {
        moodContainer.classList.add('hidden');
        selectionContainer.classList.remove('hidden');
    });

    // Back to mood selection
    backToMoodBtn.addEventListener('click', () => {
        playlistContainer.classList.add('hidden');
        moodContainer.classList.remove('hidden');
    });

    async function generatePlaylist() {
        playlist.innerHTML = '<div class="loading">Loading songs...</div>';
        
        const songs = await fetchSongsByMood(selectedMood, selectedLanguage);
        
        if (songs.length === 0) {
            playlist.innerHTML = '<div class="error">No songs found. Please try a different mood or language.</div>';
            return;
        }

        playlist.innerHTML = '';
        songs.forEach((song, index) => {
            const songElement = document.createElement('a');
            songElement.href = song.youtubeLink;
            songElement.target = '_blank';
            songElement.className = 'song-item';
            songElement.innerHTML = `
                <div class="song-number">${index + 1}</div>
                <img src="${song.image}" alt="${song.title}" class="song-thumbnail">
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            `;
            playlist.appendChild(songElement);
        });
    }

    // Initialize generate button after DOM is loaded
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePlaylist);
    }

    // Function to fetch trending songs from YouTube
    async function fetchTrendingSongs() {
        try {
            const API_KEY = 'AIzaSyAwj91rSbLhOSl7nR8t14sufB10OHmnlts'; // Replace with your YouTube API key
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=10&videoCategoryId=10&type=video&key=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch trending songs');
            }
            
            const data = await response.json();
            // Filter out shorts by checking video duration and title
            const filteredItems = data.items.filter(item => {
                const title = item.snippet.title.toLowerCase();
                return !title.includes('shorts') && !title.includes('#shorts');
            });
            
            return filteredItems.map(item => ({
                id: item.id,
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.high.url,
                views: formatViews(item.statistics.viewCount)
            }));
        } catch (error) {
            console.error('Error fetching trending songs:', error);
            return [];
        }
    }

    // Helper function to format view count
    function formatViews(views) {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`;
        }
        return `${views} views`;
    }

    // Function to display trending songs
    function displayTrendingSongs(songs) {
        const trendingSongsContainer = document.querySelector('.trending-songs');
        trendingSongsContainer.innerHTML = '';
        
        songs.forEach(song => {
            const songCard = document.createElement('div');
            songCard.className = 'trending-song-card';
            songCard.innerHTML = `
                <img src="${song.thumbnail}" alt="${song.title}" class="trending-song-thumbnail">
                <div class="trending-song-info">
                    <div class="trending-song-title">${song.title}</div>
                    <div class="trending-song-channel">${song.channel}</div>
                    <div class="trending-song-views">${song.views}</div>
                </div>
            `;
            songCard.addEventListener('click', () => {
                window.open(`https://www.youtube.com/watch?v=${song.id}`, '_blank');
            });
            trendingSongsContainer.appendChild(songCard);
        });
    }

    // Library navigation
    const libraryLink = document.querySelector('a[href="#"]:nth-child(3)');
    const backToHomeBtn = document.getElementById('backToHome');
    const libraryContainer = document.querySelector('.library-container');

    libraryLink.addEventListener('click', async (e) => {
        e.preventDefault();
        welcomeContainer.classList.add('hidden');
        selectionContainer.classList.add('hidden');
        libraryContainer.classList.remove('hidden');
        
        const songs = await fetchTrendingSongs();
        displayTrendingSongs(songs);
    });

    backToHomeBtn.addEventListener('click', () => {
        libraryContainer.classList.add('hidden');
        welcomeContainer.classList.remove('hidden');
    });
});
