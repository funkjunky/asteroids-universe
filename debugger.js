const MAX_LINES = 5;
export default (state=[], { type, line }) => {
    switch(type) {
        case 'DEBUG':
            return [ line, ...state.slice(0, 4) ];
        default:
            return state;
    }
};
