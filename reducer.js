import { combineReducers } from 'redux';

import entities from './entities/index';
import game from './game';
import debug from './debugger';

export default combineReducers({
    entities,
    game,
    debug,
});
