import { put } from 'redux-yield-effect/lib/effects';
import { addTick } from 'effect-tick';

import { createEntity, removeEntity } from './entities';
//TODO: randomInt in createAsteroid
const randomInt = max => Math.floor(Math.random() * max);

const getBulletShape = () => [
    [ randomInt(4) - 6, randomInt(4) - 6 ],
    [ randomInt(4) + 6, randomInt(4) - 6 ],
    [ randomInt(4) + 6, randomInt(4) + 6 ],
    [ randomInt(4) - 6, randomInt(4) + 6 ],
];

const createBullet = (x, y, rotation) => ({
    entityType: 'bullet',
    shape: getBulletShape(),
    x, y,
    velx: Math.cos(rotation - Math.PI / 2) * 400,
    vely: Math.sin(rotation - Math.PI / 2) * 400,
    scale: 0.5,
    rotationVel: 0.005,
});

//TODO: create collision test based on shape

const getRadiansFromVector = (x, y) => 0.5 * Math.PI + Math.atan2(y || 0.1, x || 0.1);
export default store => {
    document.addEventListener('mouseup', () => {
        const player = store.getState().entities[0];
        if (player.invuln) return;
        store.dispatch(function* _fire() {
            const asteroids = () => Object.values(store.getState().entities).filter(e => e.entityType === 'asteroid');
            let bullet = yield put(createEntity(createBullet(player.x, player.y, player.rotation)));
            let lifeSpan = 2000;
            yield put(addTick(function* (dt) {
                const asteroid = asteroids().find(a => Math.abs(a.x - bullet().x) < 20 && Math.abs(a.y - bullet().y) < 20);
                if (asteroid) {
                    yield put(removeEntity(() => asteroid));
                    yield put({ type: 'KILL_INC' });
                }
                return (lifeSpan -= dt) < 0 || asteroid;
            }));
            yield put(removeEntity(bullet));
        }());
    });

    document.addEventListener('mousemove', e => {
        if (!store.getState().entities[0]) return;
        const x = e.clientX - store.getState().entities[0].x;
        const y = e.clientY - store.getState().entities[0].y;
        const rotation = getRadiansFromVector(x, y);

        store.dispatch({
            type: 'FACE',
            id: 0,
            rotation,
        });
    });

    let keysPressed = {};
    let dispatchAddAcc = () => {
        let accx = 0.001;
        let accy = 0.001;
        if (keysPressed[37] && !keysPressed[39]) accx = -700;
        else if (!keysPressed[37] && keysPressed[39]) accx = 700;

        if (keysPressed[38] && !keysPressed[40]) accy = -700;
        else if (!keysPressed[38] && keysPressed[40]) accy = 700;

        store.dispatch({ type: 'ADD_ACC', id: 0, accx, accy });
    };
    // First store the key change, then update ADD_ACC accordingly.
    document.addEventListener('keydown', e => dispatchAddAcc(keysPressed[e.keyCode] = true));
    document.addEventListener('keyup', e => dispatchAddAcc(keysPressed[e.keyCode] = false));
};
