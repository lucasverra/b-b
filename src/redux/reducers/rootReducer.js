import { combineReducers } from 'redux';

// reducers
import fileReducer from './fileReducer';

export default combineReducers({
    file: fileReducer,
});
