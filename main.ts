let y = 0;
let x = 0;

input.onShake(() => {
    music.playTone(Note.GSharp3, 100);
});

input.onButtonPressed(Button.A, () => {
    led.enable(true);
});

input.onButtonPressed(Button.B, () => {
    led.enable(false);
});

basic.forever(function () {
    led.unplot(x, y);
    x = toFixed(input.rotation(Rotation.Roll) / 10);
    y = toFixed(input.rotation(Rotation.Pitch) / 10);
    led.plot(x, y);
});

function toFixed(i: number) {
    if (i < 0) {
        return 0;
    }
    if (i > 4) {
        return 4;
    }
    return Math.floor(i);
}