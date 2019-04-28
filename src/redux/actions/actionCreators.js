import actionTypes from './actionTypes'

export const setFileData = (payload) => dispatch => {
    dispatch({
        type: actionTypes.SET_FILE_DATA,
        payload
    })
};
