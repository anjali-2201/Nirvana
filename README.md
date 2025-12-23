# Nirvana 🎶 - Your Personal Playlist Generator

**Nirvana** is a responsive and theme-enabled web application that helps users discover music based on **language**, **mood**, or direct **YouTube-based search**. It utilizes the YouTube Data API to fetch relevant music videos and presents them in a visually appealing format.

---

## 🌟 Key Features

- 🎼 **Mood & Language-Based Playlist Generator**  
  Select a language (e.g., Hindi, English, Korean) and a mood (e.g., Happy, Sad, Romantic) to generate personalized playlists.

- 🔍 **YouTube Music Search**  
  Use the search feature (via `chat.html`) to directly find music videos from YouTube by song name or artist.

- 🌗 **Theme Toggle**  
  Light and dark mode support with smooth transitions and saved preferences.

- 📱 **Fully Responsive Design**  
  Works great on mobile, tablet, and desktop devices.

---

## 🚀 Getting Started

### Requirements

- Any modern web browser (Chrome, Firefox, Safari)
- Internet connection (YouTube API access)

### Installation Steps

1. Clone or download this repository.
2. Ensure your project folder includes the following files and structure:

3. Open `index.html` in your browser.

---

## 📁 Project Structure

| File         | Description |
|--------------|-------------|
| `index.html` | Main homepage allowing selection by language and mood. |
| `chat.html`  | AI chat interface for song search using YouTube API. |
| `script.js`  | JavaScript for app interactivity, playlist generation, search handling, and theme toggling. |
| `styles.css` | Responsive and modern CSS design system. |
| `pics/`      | Folder that contains images used for language/mood cards (not included here). |

---

## 🔑 YouTube API Key

This app uses the [YouTube Data API v3](https://developers.google.com/youtube/v3):

- API key is currently hardcoded in both `index.html` and `chat.html`:

---

## 🛠️ Features to Improve

- Integrate user login & playlists saving.
- Add backend support for storing preferences.
- Improve search results relevance and fallback logic.
- Include error handling for API quota limits.

---

## 📄 License

MIT License.  
Developed for educational and demonstration purposes.

---

## 🙌 Credits

- [Font Awesome](https://fontawesome.com/)
- [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
- YouTube Data API
