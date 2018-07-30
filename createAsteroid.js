const randomInt = max => Math.floor(Math.random() * max);

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

export default () => ({
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
