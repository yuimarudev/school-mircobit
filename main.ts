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

basic.forever(function () {
    if (input.logoIsPressed()) music.playTone(Note.G4, 10);
    const locX = toFixed(input.rotation(Rotation.Roll) / 10);
    const locY = toFixed(input.rotation(Rotation.Pitch) / 10);
    if (locX !== x || locY !== y) led.unplot(x, y);
    led.plot(locX, locY);
    x = locX;
    y = locY;
});

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
    const query = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine));
    const parsed = JSON.parse(query.slice(0, query.length - 1)) as Query;
    let res: Response;

    switch (parsed.type) {
        case 0:
            res = {
                type: 0,
                temp: input.temperature()
            };
            bluetooth.uartWriteString(JSON.stringify(res));
            break;
        case 1:
            res = {
                type: 1,
                vec: input.compassHeading()
            }
            bluetooth.uartWriteString(JSON.stringify(res));
            break;
        case 2:
            res = {
                type: 2,
                level: input.lightLevel()
            };
            bluetooth.uartWriteString(JSON.stringify(res));
            break;
    }
});

bluetooth.startUartService();

type Query = TempertureQuery | CompassQuery | LightQuery;
type Response = TempertureQueryResponse | CompassQueryResponse | LightQueryResponse;

interface TempertureQuery {
    type: 0
}

interface TempertureQueryResponse {
    type: 0,
    temp: number
}

interface CompassQuery {
    type: 1,
}

interface CompassQueryResponse {
    type: 1,
    vec: number
}

interface LightQuery {
    type: 2
}

interface LightQueryResponse {
    type: 2,
    level: number
}