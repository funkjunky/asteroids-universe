export default (state, { type, id, accx = 0, accy = 0, rotation }) => {
    switch(type) {
        case 'FACE':
            if (id !== state.id) return state;
            return {
                ...state,
                rotation,
            };

        case 'ADD_ACC':
            if (id !== state.id) return state;
            return {
                ...state,
                accx: accx || state.accx,
                accy: accy || state.accy,
            };

        default:
            return state;
    }
};
