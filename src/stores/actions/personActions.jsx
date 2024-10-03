import axios from "../../Utils/Axios";
import { setPersonDetails, setPersonLoading, setPersonError, clearPerson } from '../reducers/personSlice';

export const fetchPersonDetails = (id) => async (dispatch) => {
  dispatch(setPersonLoading());
  try {
    const response = await axios.get(`/person/${id}`, {
      params: { append_to_response: 'combined_credits' }
    });
    dispatch(setPersonDetails(response.data));
  } catch (error) {
    console.error('Error fetching person details:', error);
    dispatch(setPersonError(error.message));
  }
};

export const clearPersonDetails = () => (dispatch) => {
  dispatch(clearPerson());
};