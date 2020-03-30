let colorPicker;
let colorPicke2;

let lumin;

let button;

let backCol = 0;
let foreCol = 255;

function setup() {
    createCanvas(400, 400);

    noLoop()

    textSize(25);
    textAlign(CENTER, CENTER);

    colorPicker = createColorPicker(color(255, 255, 255, 1));
    colorPicker.input(setColor);
    col = color(0, 0, 0);
}

function setColor() {
    let hexCol1 = colorPicker.value();
    predict(hexCol1).then((hexCol2) => {
        lumin = calcLumin(hexCol1, hexCol2);

        backCol = hexCol1
        foreCol = hexCol2
        redraw()
    })
}

async function predict(hexCol) {
    let color1 = color(hexCol);
    let r = red(color1);
    let g = green(color1);
    let b = blue(color1);

    let url = "http://localhost:5000/run?r=" + r + "&g=" + g + "&b=" + b;

    let resp = await fetch(url)
    let outJson = await resp.json()
    let out = outJson.value

    let or = floor(out[0] * 255)
    let og = floor(out[1] * 255)
    let ob = floor(out[2] * 255)

    let hexIn = "#" + hex(r, 2) + "" + hex(g, 2) + "" + hex(b, 2);
    let hexOut = "#" + hex(or, 2) + "" + hex(og, 2) + "" + hex(ob, 2);

    backCol = hexIn;
    foreCol = hexOut;
    return hexOut;
}

function draw() {
    background(backCol);
    fill(foreCol);

    text(lumin + ":1", width / 2, height / 2);
}

function calcLumin(hexCol1, hexCol2) {
    let color1 = color(hexCol1);
    let R1 = red(color1)
    let G1 = green(color1);
    let B1 = blue(color1);
    let rNorm1 = R1 / 255
    let gNorm1 = G1 / 255
    let bNorm1 = B1 / 255

    let r1 = rNorm1 < 0.03928 ? rNorm1 / 12.92 : Math.pow(((rNorm1 + 0.055) / 1.055), 2.4);
    let g1 = gNorm1 < 0.03928 ? gNorm1 / 12.92 : Math.pow(((gNorm1 + 0.055) / 1.055), 2.4);
    let b1 = bNorm1 < 0.03928 ? bNorm1 / 12.92 : Math.pow(((bNorm1 + 0.055) / 1.055), 2.4);
    let L1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;

    let color2 = color(hexCol2)
    let R2 = red(color2)
    let G2 = green(color2);
    let B2 = blue(color2);
    let rNorm2 = R2 / 255
    let gNorm2 = G2 / 255
    let bNorm2 = B2 / 255
    let r2 = rNorm2 < 0.03928 ? rNorm2 / 12.92 : Math.pow(((rNorm2 + 0.055) / 1.055), 2.4);
    let g2 = gNorm2 < 0.03928 ? gNorm2 / 12.92 : Math.pow(((gNorm2 + 0.055) / 1.055), 2.4);
    let b2 = bNorm2 < 0.03928 ? bNorm2 / 12.92 : Math.pow(((bNorm2 + 0.055) / 1.055), 2.4);
    let L2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;

    let l1Lighter = L1 > L2;

    return l1Lighter ?
        (L1 + 0.05) / (L2 + 0.05) :
        (L2 + 0.05) / (L1 + 0.05);
}