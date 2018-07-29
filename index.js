import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put } from 'redux-yield-effect/lib/effects';
import { addTick } from 'effect-tick';
import { tickMiddleware, resumeTicks, pauseTicks } from 'effect-tick';
import { createEntity } from './entities/index.js';
import reducer from './reducer.js';
import metaSelector from 'redux-meta-selector';
import graphics from './graphics.js';
import 'end-polyFills';

document.addEventListener('DOMContentLoaded', () => {
    const store = createStore(
        reducer,
        applyMiddleware(
            createYieldEffectMiddleware(),
            tickMiddleware,
            metaSelector
        ),
    );
    store.dispatch(resumeTicks());

    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    const step = dt => {
        graphics(ctx, store.getState(), dt);
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);

    const shipShape = [
        [-2, 0],
        [2, 0],
        [2, -6],
        [6, -2],
        [6, 2],
        [2, 6],
        [-2, 6],
        [-6, 2],
        [-6, -2],
        [-2, -6],
        [-2, 0],
    ];

    const player = store.dispatch(createEntity({
        id: 0,
        name: 'jason',
        shape: shipShape,
        entityType: 'ship',
        x: 100,
        y: 100,
        scale: 5,
        friction: 100,
    }));

    const randomInt = max => Math.floor(Math.random() * max);
    // * * *
    // *   *
    // * * *
    const getAsteroidShape = () => [
        [ randomInt(4) - 6, randomInt(4) - 6 ],
        [ randomInt(4) - 2, randomInt(4) - 6 ],
        [ randomInt(4) + 2, randomInt(4) - 6 ],
        [ randomInt(4) + 2, randomInt(4) - 2 ],
        [ randomInt(4) + 2, randomInt(4) + 2 ],
        [ randomInt(4) - 2, randomInt(4) + 2 ],
        [ randomInt(4) - 6, randomInt(4) + 2 ],
        [ randomInt(4) - 6, randomInt(4) - 2 ],
    ];

    const createAsteroid = () => createEntity({
        entityType: 'asteroid',
        name: randomInt(1000),
        shape: getAsteroidShape(),
        x: 30 + Math.random() * (640 - 30),    // - scale * normal TODO const
        y: 30 + Math.random() * (480 - 30),
        velx: Math.random() * 50 - 25,
        vely: Math.random() * 50 - 25,
        scale: 5,
        rotationVel: 0.001 * Math.random() + 0.001,
    });

    // This updates the physics
    store.dispatch(addTick(function* _update_physics(dt) {
        yield put({
            type: 'UPDATE_PHYSICS',
            dt
        });
        store.dispatch({
            type: 'DEBUG',
            line: store.getState().entities[0].accx + ' > ' + store.getState().entities[0].velx,
        });

        // Never done?
        return false;
    }));

    // This spawns asteroids, until there are 10 of them.
    {
        const MAX_ASTEROIDS = 10;
        const ASTEROID_CD = 1000;
        let tillSpawn = ASTEROID_CD;
        store.dispatch(addTick(function* _spawn_asteroids(dt) {
            if (Object.values(store.getState().entities).filter(v => v.entityType === 'asteroid').length >= MAX_ASTEROIDS) return false;
            tillSpawn -= dt;
            if (tillSpawn < 0) {
                yield put(createAsteroid());
                tillSpawn += ASTEROID_CD;
            }

            return false;
        }));
    }

    const getRadiansFromVector = (x, y) => 0.5 * Math.PI + Math.atan2(y || 0.1, x || 0.1);
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
});
