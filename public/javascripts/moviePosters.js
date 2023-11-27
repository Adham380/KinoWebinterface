

const apiKey = '49db91a557fa294324b2da6e47d6edf0'; // Replace with your API key

// Function to search for a movie
async function searchMovie(movieName) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`);
        const data = await response.json();
        return data.results[0] ? data.results[0].id : null; // Return the ID of the first movie in the results
    } catch (error) {
        console.error('Error searching for movie:', error);
    }
}

// Function to get the movie details including the poster path
async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        const movieDetails = await response.json();
        return movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null; // Construct the poster URL
    } catch (error) {
        console.error('Error getting movie details:', error);
    }
}

// Main function to execute the process
async function getMoviePoster(movieName) {
    const movieId = await searchMovie(movieName);
    if (movieId) {
        const posterUrl = await getMovieDetails(movieId);
        if (posterUrl) {
            console.log('Movie Poster URL:', posterUrl);
            // Here you can do something with the poster URL, like displaying it in your web app
            return posterUrl;
        } else {
            console.log('Poster not found');

            return null;
        }
    } else {
        return null;
        console.log('Movie not found');
    }
}

export const moviePosters = {
    getMoviePoster,
}
