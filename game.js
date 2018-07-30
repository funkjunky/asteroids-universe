const initialState = {
    deathCount: 0,
    killCount: 0,
};

export default (state=initialState, action) => {
    switch(action.type) {
        case 'DEATH_INC':
            return { ...state, deathCount: state.deathCount + 1 };
        case 'KILL_INC':
            return { ...state, killCount: state.killCount + 1 };
        default:
            return state;
    }
};
