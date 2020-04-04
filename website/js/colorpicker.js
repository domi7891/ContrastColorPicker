var utils = new Utils()

$(document).ready(function() {

    const pickr = Pickr.create({
        el: '.color',
        container: '#colorpicker',
        appClass: 'picker-class',
        theme: 'nano', // or 'monolith', or 'nano'
        default: '#000000',
        defaultRepresentation: 'RGBA',
        adjustableNumbers: false,
        useAsButton: true,
        showAlways: true,
        lockOpacity: true,
        components: {

            // Main components
            preview: true,
            opacity: true,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                input: true,
                save: true
            }
        }
    });

    pickr.on('change', async(color, instance) => {
        let hex = color.toHEXA().toString()
        $('.color').css('backgroundColor', hex)
    })

    $('#submit').click(async(e) => {

        let hex = pickr.getColor().toHEXA().toString()
        let out = await predict(hex)
        setColor(out)
    })

    function setColor(color) {
        $('.bg').css('backgroundColor', color[0])
        $('.spacer').css('backgroundColor', color[1])
        $('.container').css('border-bottom-color', color[1])
        $('.text').css('color', color[1])
        $('#lum').text(color[2].toFixed(2))
    }

    async function predict(hexCol) {
        let color1 = utils.color(hexCol);
        let r = utils.red(color1);
        let g = utils.green(color1);
        let b = utils.blue(color1);

        let url = "http://localhost:5000/run?r=" + r + "&g=" + g + "&b=" + b;

        let resp = await fetch(url)
        let outJson = await resp.json()
        let out = outJson.value

        let or = Math.floor(out[0] * 255)
        let og = Math.floor(out[1] * 255)
        let ob = Math.floor(out[2] * 255)

        let hexIn = "#" + utils.toHex(r) + "" + utils.toHex(g) + "" + utils.toHex(b);
        let hexOut = "#" + utils.toHex(or) + "" + utils.toHex(og) + "" + utils.toHex(ob);

        let lumin = utils.calcLumin(hexIn, hexOut)

        if (lumin >= 7) {
            $('.level').each(function() {
                passed(this, true)
            })
        } else if (lumin >= 4.5) {
            $('.level').each(function() {
                let normalAAA = $(this).find('#AAANormal')
                if (normalAAA.length) {
                    passed(this, false)
                } else {
                    passed(this, true)
                }
            })
        } else if (lumin >= 3) {
            $('.level').each(function() {
                let largeAA = $(this).find('#AALarge')
                if (largeAA.length) {
                    passed(this, true)
                } else {
                    passed(this, false)
                }
            })
        } else {
            $('.level').each(function() {
                passed(this, false)
            })
        }

        return [hexIn, hexOut, lumin];
    }

    function passed(element, passed) {
        if (passed) {
            $(element).children(".fa-check").removeClass("hidden")
            $(element).children(".fa-times").addClass("hidden")
            $(element).css("backgroundColor", "rgb(0, 192, 0)")
        } else {
            $(element).children(".fa-check").addClass("hidden")
            $(element).children(".fa-times").removeClass("hidden")
            $(element).css("backgroundColor", "red")
        }
    }
})