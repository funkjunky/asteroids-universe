const c = {
    purple:     '#b35ce5',
    darkGreen:  '#2dab9a',
    blue:       '#65ecda',
    green:      '#17ff70',
    red:        '#ff3f3f',
    orange:     '#ffaf3f'
};

export default (ctx, state, dt) => {
    const drawEntity = entity => {
        ctx.translate(entity.x, entity.y);

        ctx.strokeStyle = c.blue;
        ctx.fillStyle = c.blue;
        ctx.textAlign = 'center';
        if (entity.name) {
            ctx.fillText(entity.name, 0, entity.scale * 10);   //6 is the bounds of a shape. TODO: make 6 const
        }

        ctx.rotate(entity.rotation);
        if (entity.id === 0) {
            ctx.strokeStyle = c.red;
            ctx.fillStyle = c.red;
            if (state.game.deathCount) {
                ctx.fillText('☠' + state.game.deathCount, -10, 10);
            }
            if (state.game.killCount) {
                ctx.fillText('👾'+ state.game.killCount, 10, 10);
            }
        }

        ctx.strokeStyle = entity.invuln ? c.orange : c.purple;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const getX = x => x * entity.scale;
        const getY = y => y * entity.scale;
        ctx.moveTo(
            getX(entity.shape[0][0]),
            getY(entity.shape[0][1]),
        );
        entity.shape.forEach(([x, y]) => ctx.lineTo(getX(x), getY(y)));
        ctx.closePath();
        ctx.stroke();
    };

    //BEGIN ACTUAL GRAPHICS
    ctx.clearRect(0, 0, 640, 480);
    //default colour
    ctx.fillStyle = c.darkGreen;

    // centre translate on ship location and half of screen
    ctx.save();
    ctx.translate(320 - state.entities[0].x, 240 - state.entities[0].y);

    // draw bounds
    ctx.strokeStyle = c.darkGreen;
    ctx.lineWidth = 5;
    // TODO: max_height, max_width (in entities/entity.js)
    ctx.strokeRect(0, 0, 1280, 960);


    // draw entities
    Object.values(state.entities).reverse().forEach(entity => {
        ctx.save();
        drawEntity(entity)
        ctx.restore();
    });
    ctx.restore();

    ctx.save();
    ctx.translate(640, 10);
    //ctx.fillStyle = c.orange;
    //ctx.drawRect(-80, 0, 80, 10);
    ctx.fillStyle = c.green;
    ctx.textAlign = 'center';
    state.debug.forEach((line, i) => {
        ctx.fillText(line, -40, 10 * i);
    });
    ctx.restore();
};
