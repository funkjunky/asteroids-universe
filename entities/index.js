import { metaEntitiesSelector } from './metaEntitySelector';
import entityReducer from './entity';

let _id = 0;
export const createEntity = props => ({
    type: 'CREATE_ENTITY',
    entity: {
        id: ++_id,
        ...props
    },
    meta: metaEntitiesSelector
});

export const removeEntity = entity => ({
    type: 'REMOVE_ENTITY',
    entity: entity()
});

export default (state={}, action) => {
    switch(action.type) {
        case 'CREATE_ENTITY':
            return {
                ...state,
                [action.entity.id]: {
                    x: 0,
                    y: 0,
                    velx: 0,
                    vely: 0,
                    // accx: 0, optional
                    // accy: 0, optional
                    rotation: 0,
                    // rotationVel: 0, optional
                    ...action.entity,
                }
            };

        case 'REMOVE_ENTITY':
            const newState = { ...state };
            delete newState[action.entity.id];
            return newState;

        default:
            for(const k in state) {
                state[k] = entityReducer(state[k], action);
            }
            return state;
    }
};
