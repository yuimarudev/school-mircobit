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
    let parsed: Query = {
        type: 255
    };

    try {
        parsed = JSON.parse(query.slice(0, query.length - 1));
    } catch { }

    let res: Response = { type: 255 };

    switch (parsed.type) {
        case 0:
            res = {
                type: 0,
                temp: input.temperature()
            };
            break;
        case 1:
            res = {
                type: 1,
                vec: input.compassHeading()
            }
            break;
        case 2:
            res = {
                type: 2,
                level: input.lightLevel()
            };
            break;
    }

    bluetooth.uartWriteString(JSON.stringify(res) + "\n");
});

bluetooth.startUartService();

type Query = TempertureQuery | CompassQuery | LightQuery | InvalidQuery;
type Response = TempertureQueryResponse | CompassQueryResponse | LightQueryResponse | InvalidQueryResponse;

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

interface InvalidQuery {
    type: 255
}

interface InvalidQueryResponse {
    type: 255
}