import axios from "../../Utils/Axios";
import { setTvDetails, setTvLoading, setTvError, clearTv } from '../reducers/tvSlice';

export const fetchTvDetails = (id) => async (dispatch) => {
  dispatch(setTvLoading());
  try {
    const response = await axios.get(`/tv/${id}`, {
      params: { append_to_response: 'credits,videos,similar' }
    });
    console.log('TV Show API response:', response.data); // Add this line for debugging
    dispatch(setTvDetails(response.data));
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    dispatch(setTvError(error.message));
  }
};

export const clearTvDetails = () => (dispatch) => {
  dispatch(clearTv());
};