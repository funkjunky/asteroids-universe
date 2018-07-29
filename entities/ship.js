const MAX_ACC = 150;

export default (state, { type, id, accx, accy, rotation }) => {
    switch(type) {
        case 'FACE':
            if (id !== state.id) return state;
            return {
                ...state,
                rotation,
            };

        case 'MOVE':
            if (id !== state.id) return state;
            return {
                ...state,
                accx: accx * MAX_ACC,
                accy: accy * MAX_ACC,
            };

        default:
            return state;
    }
};
