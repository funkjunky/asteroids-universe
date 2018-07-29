import asteroid from './asteroid';
import ship from './ship';

const reducers = { asteroid, ship };

export default (state, action) => {
    switch(action.type) {
        case 'UPDATE_PHYSICS':
            const pps = action.dt / 1000;

            let velx = state.accx * pps + state.velx;
            let vely = state.accy * pps + state.vely;

            const magnitude = Math.sqrt(velx*velx + vely*vely);
            if (magnitude > 300) {
                velx = (velx / magnitude) * 300;
                vely = (vely / magnitude) * 300;
            }

            // apply friction to the velocity
            if (state.friction) {
                    velx = (velx > 0
                            ? (velx - state.friction * pps)
                            : (velx + state.friction * pps));

                    vely = (vely > 0
                            ? (vely - state.friction * pps)
                            : (vely + state.friction * pps));
            }

            let x = state.velx * pps + state.x;
            if (x < 0) x = 640 - x;
            else if (x > 640) x = x - 640;

            let y = state.vely * pps + state.y;
            if (y < 0) y = 480 - y;
            else if (y > 480) y = y - 480;

            const rotation = (state.rotationVel || 0) * action.dt + state.rotation;

            return { ...state, velx, vely, x, y, rotation };

        default:
            return reducers[state.entityType](state, action);
    }
}
