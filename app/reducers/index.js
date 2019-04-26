import axios from "axios";

const GET_DATA = "GET_DATA";

export const getData = data => {
  console.log("getdata running");
  return { type: "GET_DATA", data: data };
};

export const fetchDataThunk = () => {
  console.log("fetchdata running");
  return dispatch => {
    axios
      .get("/api/dataset")
      .then(res => res.data)
      .then(data => {
        dispatch({ type: "GET_DATA", data: data });
      })
      .catch(err => console.error("failed to get dataset", err));
  };
};

const initialState = {
  entries: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return Object.assign({}, state, { entries: action.data });

    default:
      return state;
  }
};

export default rootReducer;
