import actionTypes from '../actions/actionTypes'

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_FILE_DATA:
            return {
                ...state,
                data: action.payload,
            };
        default:
            return state;
    }
}
