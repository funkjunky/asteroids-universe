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

export default () => ({
    id: 0,
    name: 'jason',
    shape: shipShape,
    entityType: 'ship',
    x: 100,
    y: 100,
    scale: 5,
    friction: 100,
});
