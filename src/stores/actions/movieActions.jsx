import axios from "../../Utils/Axios";
import { setMovieDetails, setMovieLoading, setMovieError, clearMovie } from '../reducers/movieSlice';

// Action Types
export const FETCH_MOVIE_DETAILS_REQUEST = 'FETCH_MOVIE_DETAILS_REQUEST';
export const FETCH_MOVIE_DETAILS_SUCCESS = 'FETCH_MOVIE_DETAILS_SUCCESS';
export const FETCH_MOVIE_DETAILS_FAILURE = 'FETCH_MOVIE_DETAILS_FAILURE';

// Action Creators
export const fetchMovieDetailsRequest = () => ({
  type: FETCH_MOVIE_DETAILS_REQUEST
});

export const fetchMovieDetailsSuccess = (movie) => ({
  type: FETCH_MOVIE_DETAILS_SUCCESS,
  payload: movie
});

export const fetchMovieDetailsFailure = (error) => ({
  type: FETCH_MOVIE_DETAILS_FAILURE,
  payload: error
});

// Thunk Action
export const fetchMovieDetails = (id) => async (dispatch) => {
  dispatch(setMovieLoading());
  try {
    const response = await axios.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos,similar' }
    });
    dispatch(setMovieDetails(response.data));
  } catch (error) {
    console.error('Error fetching movie details:', error);
    dispatch(setMovieError(error.message));
  }
};

export const clearMovieDetails = () => (dispatch) => {
  dispatch(clearMovie());
};

// You can add more actions here if needed, such as:
// - addToFavorites (if you have a favorites feature)
// - fetchSimilarMovies (if you want to fetch similar movies separately)
// etc.

export const addToFavorites = (movie) => ({
  type: 'ADD_TO_FAVORITES',
  payload: movie
});