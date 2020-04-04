let utils = new Utils()
let bgPickr, fgPickr

$(document).ready(function() {
    bgPickr = createPicker('colorpickerOne', 'bgPrev', '#000')
    fgPickr = createPicker('colorpickerTwo', 'fgPrev', '#fff')

    bgPickr.on('change', async(color, instance) => {
        let hex = color.toHEXA().toString()
        setBgColor(hex)
        calculate()
    })

    fgPickr.on('init', instance => {
        setColors(convert(bgPickr.getColor()), convert(fgPickr.getColor()))
    }).on('change', async(color, instance) => {
        let hex = color.toHEXA().toString()
        setFgColor(hex)
        calculate()
    })

    function setBgColor(color) {
        $('#bgPrev').css('backgroundColor', color)
        $('.bg').css('backgroundColor', color)
    }

    function setFgColor(color) {
        $('#fgPrev').css('backgroundColor', color)
        $('.spacer').css('backgroundColor', color)
        $('.container').css('border-bottom-color', color)
        $('.text').css('color', color)
    }

    function setColors(bg, fg) {
        setBgColor(bg)
        setFgColor(fg)
    }

    function convert(col) {
        return col.toHEXA().toString()
    }

    function calculate() {
        let hexOne = bgPickr.getColor().toHEXA().toString()
        let hexTwo = fgPickr.getColor().toHEXA().toString()
        let lumin = utils.calcLumin(hexOne, hexTwo)

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

        $('#lum').text(lumin)

        return lumin
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

    function createPicker(id, prev, defaultColor) {
        return Pickr.create({
            el: '#' + prev,
            container: '#' + id,
            appClass: 'picker-class',
            theme: 'nano', // or 'monolith', or 'nano'
            default: defaultColor,
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
    }
})