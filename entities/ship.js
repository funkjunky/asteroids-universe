export default (state, { type, id, accx = 0, accy = 0, rotation, ...status }) => {
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

        case 'STATUS':
            if (id !== state.id) return state;
            return {
                ...state,
                ...status,
            };

        default:
            return state;
    }
};
