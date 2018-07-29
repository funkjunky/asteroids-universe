import asteroid from './asteroid';
import ship from './ship';

const reducers = { asteroid, ship };

export default (state, action) => {
    switch(action.type) {
        case 'UPDATE_PHYSICS':
            const velx = (state.accx || 0) * action.dt + state.velx;
            const vely = (state.accy || 0) * action.dt + state.vely;

            let x = state.velx * action.dt + state.x;
            if (x < 0) x = 640 - x;
            else if (x > 640) x = x - 640;

            let y = state.vely * action.dt + state.y;
            if (y < 0) y = 480 - y;
            else if (y > 480) y = y - 480;

            const rotation = (state.rotationVel || 0) * action.dt + state.rotation;

            return { ...state, velx, vely, x, y, rotation };

        default:
            return reducers[state.entityType](state, action);
    }
}
