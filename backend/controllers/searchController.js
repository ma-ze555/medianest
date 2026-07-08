const axios = require("axios");

// Helper: delay in ms
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// @desc    Search anime via Jikan API (MyAnimeList)
// @route   GET /api/search/anime?q=query
// @access  Private
const searchAnime = async (req, res) => {
  const { q } = req.query;

  const fetchAnime = async () => {
    const response = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=10`,
      { timeout: 12000 }
    );
    return response.data.data.map((item) => ({
      externalId: String(item.mal_id),
      title: item.title,
      coverImage: item.images?.jpg?.image_url || "",
      description: item.synopsis || "",
      genres: item.genres?.map((g) => g.name) || [],
      totalEpisodes: item.episodes || 0,
      category: "anime",
    }));
  };

  try {
    const results = await fetchAnime();
    res.json(results);
  } catch (error) {
    if (error.response?.status === 429) {
      // Retry once after 1.5 seconds
      try {
        await delay(1500);
        const results = await fetchAnime();
        return res.json(results);
      } catch {
        return res.status(429).json({ message: "Too many requests. Please wait a few seconds and try again." });
      }
    }
    res.status(500).json({ message: "Failed to fetch anime data. Try again in a moment." });
  }
};

// @desc    Search movies via TMDB API
// @route   GET /api/search/movie?q=query
// @access  Private
const searchMovie = async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q)}`
    );
    const results = response.data.results.slice(0, 10).map((item) => ({
      externalId: String(item.id),
      title: item.title,
      coverImage: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "",
      description: item.overview || "",
      genres: [],
      category: "movie",
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movie data" });
  }
};

// @desc    Search TV series via TMDB API
// @route   GET /api/search/series?q=query
// @access  Private
const searchSeries = async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q)}`
    );
    const results = response.data.results.slice(0, 10).map((item) => ({
      externalId: String(item.id),
      title: item.name,
      coverImage: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "",
      description: item.overview || "",
      genres: [],
      category: "series",
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch series data" });
  }
};

// @desc    Search novels via Open Library API (no quota limits)
// @route   GET /api/search/novel?q=query
// @access  Private
const searchNovel = async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10&fields=key,title,author_name,cover_i,subject,number_of_pages_median,first_publish_year`
    );
    const results = (response.data.docs || []).map((item) => ({
      externalId: item.key || "",
      title: item.title || "Unknown",
      coverImage: item.cover_i
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
        : "",
      description: item.author_name
        ? `By ${item.author_name.slice(0, 2).join(", ")}${item.first_publish_year ? ` · ${item.first_publish_year}` : ""}`
        : "",
      genres: item.subject ? item.subject.slice(0, 4) : [],
      totalPages: item.number_of_pages_median || 0,
      category: "novel",
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch novel data" });
  }
};

// @desc    Search music via iTunes Search API (no key needed)
// @route   GET /api/search/music?q=query
// @access  Private
const searchMusic = async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=album&limit=10`
    );
    const results = response.data.results.map((item) => ({
      externalId: String(item.collectionId),
      title: `${item.collectionName} — ${item.artistName}`,
      coverImage: item.artworkUrl100?.replace("100x100", "500x500") || "",
      description: `Artist: ${item.artistName} · Genre: ${item.primaryGenreName || ""}`,
      genres: item.primaryGenreName ? [item.primaryGenreName] : [],
      totalPages: item.trackCount || 0,
      category: "music",
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch music data" });
  }
};

module.exports = { searchAnime, searchMovie, searchSeries, searchNovel, searchMusic };
