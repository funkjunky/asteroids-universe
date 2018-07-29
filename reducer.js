import { combineReducers } from 'redux';

import entities from './entities/index.js';
import debug from './debugger.js';

export default combineReducers({
    entities,
    debug,
});
