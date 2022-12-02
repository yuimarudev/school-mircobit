let y = 0;
let x = 0;

function toFixed(i: number) {
    if (i < 0) {
        return 0;
    }
    if (i > 4) {
        return 4;
    }
    return Math.floor(i);
}

input.onButtonPressed(Button.A, function () {
    led.enable(true);
});

input.onButtonPressed(Button.B, function () {
    led.enable(false);
});

input.onShake(() => {
    music.playTone(Note.GSharp3, 100);
});

basic.forever(function () {
    const locX = toFixed(input.rotation(Rotation.Roll) / 10);
    const locY = toFixed(input.rotation(Rotation.Pitch) / 10);
    if (locX !== x || locY !== y) led.unplot(x, y);
    led.plot(locX, locY);
    x = locX;
    y = locY;
});
