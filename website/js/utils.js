class Utils {

    toHex(color) {
        let hexChar = color.toString(16)
        if (hexChar.length < 2)
            hexChar = "0" + hexChar
        return hexChar
    }

    color(color) {
        color = color.slice(1)
        let red = color.slice(0, 2)
        let green = color.slice(2, 4)
        let blue = color.slice(4, 6)
        return red + "," + green + "," + blue
    }

    digit(color) {
        return parseInt(color, 16)
    }

    red(color) {
        return this.digit(color.split(",")[0])
    }


    green(color) {
        return this.digit(color.split(",")[1])
    }


    blue(color) {
        return this.digit(color.split(",")[2])
    }

    normalize(color) {
        return color / 255
    }


    luminOfColPart(partNorm) {
        return partNorm < 0.03928 ? partNorm / 12.92 : Math.pow(((partNorm + 0.055) / 1.055), 2.4)
    }


    lumOfCColor(r, g, b) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }


    lumin = function(lighter, darker) {
        return (lighter + 0.05) / (darker + 0.05)
    }


    calcLumin(hex1, hex2) {
        let color1 = this.color(hex1)
        let redOfFirst = this.red(color1)
        let greenOfFirst = this.green(color1)
        let blueOfFirst = this.blue(color1)

        let color2 = this.color(hex2)
        let redOfSec = this.red(color2)
        let greenOfSec = this.green(color2)
        let blueOfSec = this.blue(color2)

        let rFirstNorm = this.normalize(redOfFirst)
        let gFirstNorm = this.normalize(greenOfFirst)
        let bFirstNorm = this.normalize(blueOfFirst)

        let rSecNorm = this.normalize(redOfSec)
        let gSecNorm = this.normalize(greenOfSec)
        let bSecNorm = this.normalize(blueOfSec)

        let rFirstLum = this.luminOfColPart(rFirstNorm)
        let gFirstLum = this.luminOfColPart(gFirstNorm)
        let bFirstLum = this.luminOfColPart(bFirstNorm)

        let rSecLum = this.luminOfColPart(rSecNorm)
        let gSecLum = this.luminOfColPart(gSecNorm)
        let bSecLum = this.luminOfColPart(bSecNorm)

        let lumFirst = this.lumOfCColor(rFirstLum, gFirstLum, bFirstLum)
        let lumSec = this.lumOfCColor(rSecLum, gSecLum, bSecLum)

        let colFirstLighter = lumFirst > lumSec

        return colFirstLighter ? this.lumin(lumFirst, lumSec) : this.lumin(lumSec, lumFirst)
    }

}