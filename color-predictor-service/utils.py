import math


def toHex(color):
    hexChar = hex(color)
    hexChar = hexChar[2:]
    if len(hexChar) < 2:
        hexChar = "0" + hexChar
    return hexChar


def color(color):
    colors = color[1:]
    red = colors[:2]
    green = colors[2:4]
    blue = colors[4:6]
    return red + "," + green + "," + blue


def digit(color):
    return int(color, 16)


def red(color):
    return digit(color.split(",")[0])


def green(color):
    return digit(color.split(",")[1])


def blue(color):
    return digit(color.split(",")[2])


def normalize(color):
    return color / 255


def luminOfColPart(partNorm):
    return partNorm / 12.92 if partNorm < 0.03928 else math.pow(((partNorm + 0.055) / 1.055), 2.4)


def lumOfCColor(r, g, b):
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def lumin(lighter, darker):
    return (lighter + 0.05) / (darker + 0.05)


def calcLumin(hex1, hex2):
    color1 = color(hex1)
    redOfFirst = red(color1)
    greenOfFirst = green(color1)
    blueOfFirst = blue(color1)

    color2 = color(hex2)
    redOfSec = red(color2)
    greenOfSec = green(color2)
    blueOfSec = blue(color2)

    rFirstNorm = normalize(redOfFirst)
    gFirstNorm = normalize(greenOfFirst)
    bFirstNorm = normalize(blueOfFirst)

    rSecNorm = normalize(redOfSec)
    gSecNorm = normalize(greenOfSec)
    bSecNorm = normalize(blueOfSec)

    rFirstLum = luminOfColPart(rFirstNorm)
    gFirstLum = luminOfColPart(gFirstNorm)
    bFirstLum = luminOfColPart(bFirstNorm)

    rSecLum = luminOfColPart(rSecNorm)
    gSecLum = luminOfColPart(gSecNorm)
    bSecLum = luminOfColPart(bSecNorm)

    lumFirst = lumOfCColor(rFirstLum, gFirstLum, bFirstLum)
    lumSec = lumOfCColor(rSecLum, gSecLum, bSecLum)

    colFirstLighter = lumFirst > lumSec

    return lumin(lumFirst, lumSec) if colFirstLighter else lumin(lumSec, lumFirst)
