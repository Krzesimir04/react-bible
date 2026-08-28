# React Bible Reader 📖

> **Live demo:**  [https://krzesimir04.github.io/react-bible/](https://krzesimir04.github.io/react-bible/)

A light-weight, responsive web app for reading scriptures in multiple languages, powered by the API.Bible REST API.

## Features

* **Multi-Language Support:** Browse and select Bibles available in different languages.
* **Cascading Selectors:** Seamless navigation from Bible translation → Book → Chapter.
* **Dark Mode:** Persists user theme preference via `localStorage` and system media queries.
* **Responsive SVG Loader:** Custom inline feedback during asynchronous API fetches.

## Tech Stack

* **Frontend:** React, Vite
* **Styling:** SCSS
* **API:** [API.Bible REST API](https://scripture.api.bible/)

## Getting Started

### Prerequisites

* Node.js (v18.0.0 or higher)
* `npm` or `yarn`
* An API Key from [API.Bible](https://scripture.api.bible/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/krzesimir04/react-bible.git
   cd react-bible
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API Key:
   ```env
   VITE_API_KEY=your_scripture_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
