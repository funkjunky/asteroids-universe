import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put } from 'redux-yield-effect/lib/effects';
import { addTick } from 'effect-tick';
import { tickMiddleware, resumeTicks, pauseTicks } from 'effect-tick';
import { createEntity, removeEntity } from './entities/index';
import reducer from './reducer';
import metaSelector from 'redux-meta-selector';
import graphics from './graphics';
import createPlayer from './createPlayer';
import createAsteroid from './createAsteroid';
import controls from './controls';
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

    const player = store.dispatch(createEntity(createPlayer()));

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

    // handle collision of asteroid with ship.
    store.dispatch(addTick(function* _asteroidShip(dt) {
        const player = store.getState().entities[0];
        if (player.invuln) return;
        const asteroid = Object.values(store.getState().entities)
            .filter(e => e.entityType === 'asteroid')
            .find(a => Math.abs(a.x - player.x) < 20 && Math.abs(a.y - player.y) < 20);
        if (asteroid) {
            yield put(removeEntity(() => asteroid));
            yield put({ type: 'DEATH_INC' });
            yield put({ type: 'STATUS', id: 0, invuln: true });
            let cooldown = 2000;
            yield put(addTick(function* _respawning(dt) {
                return (cooldown -= dt) < 0;
            }));
            yield put({ type: 'STATUS', id: 0, invuln: false });
        }
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
                yield put(createEntity(createAsteroid()));
                tillSpawn += ASTEROID_CD;
            }

            return false;
        }));
    }

    controls(store);
});
