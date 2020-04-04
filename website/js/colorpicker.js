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

        // $('.level').each(function() {
        //     $(this).hover(
        //         function() {
        //             $(this).children("i").toggleClass("hidden")
        //             $(this).css("backgroundColor", "red")
        //         },
        //         function() {
        //             $(this).children("i").toggleClass("hidden")
        //             $(this).css("backgroundColor", "rgb(0, 192, 0)")
        //         }
        //     )
        // })


    })
    //     var selected = false
    //     var redraw = true
    //     var baseColor = { r: 255, g: 255, b: 255 }
    //     var lightness = 0.5
    //     var canvas = $("#picker")[0]
    //     var ctx = canvas.getContext('2d')
    //     var greyCanvas = $('#greyScale')[0]
    //     var greyCtx = greyCanvas.getContext('2d')
    //     createGradient("white")


//     greyCtx.fillRect(0, 0, greyCanvas.width, greyCanvas.height)

//     var img = new Image()
//     img.src = "../images/colorWheel.png"
//     img.onload = function() {
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         ctx.beginPath();
//         ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, 2 * Math.PI);
//         ctx.stroke();
//     }

//     updateControls()

//     $('#picker').mousemove(e => {
//         if (selected) {
//             calcPosition(e, canvas, ctx)
//             createGradient("rgb(" + baseColor.r + ", " + baseColor.g + ", " + baseColor.b + ")")
//         }
//     })

//     function calcPosition(e, cvs, context) {
//         var canvasOffset = $(cvs).offset()
//         var cX = Math.floor(e.pageX - canvasOffset.left)
//         var cY = Math.floor(e.pageY - canvasOffset.top)

//         var xCurr = cvs.width / 2
//         var yCurr = cvs.height / 2

//         var a = xCurr - cX;
//         var b = yCurr - cY;

//         var c = Math.sqrt(a * a + b * b);

//         if (c > 126) {
//             $(cvs).css('cursor', 'default')
//             selected = false
//         } else {
//             $(cvs).css('cursor', 'crosshair')
//             var imgData = context.getImageData(cX, cY, 1, 1)
//             var pix = imgData.data

//             context.clearRect(0, 0, cvs.width, cvs.height)
//             if (cvs.id === "picker") {
//                 context.drawImage(img, 0, 0, cvs.width, cvs.height);
//                 greyCtx.fillRect(0, 0, greyCanvas.width, greyCanvas.height)
//             } else if (cvs.id === "greyScale") {
//                 context.fillRect(0, 0, cvs.width, cvs.height)
//             }
//             context.beginPath();
//             context.arc(cX, cY, 5, 0, 2 * Math.PI);
//             context.stroke();

//             //if (cvs.id === "picker") {
//             baseColor.r = pix[0]
//             baseColor.g = pix[1]
//             baseColor.b = pix[2]
//                 // } else if (cvs.id === "greyScale") {
//                 //     lightness = (pix[0]) / 255
//                 //     calcLightness(baseColor, lightness)
//                 // }
//             $('.color').css('backgroundColor', 'rgb(' + baseColor.r + ', ' + baseColor.g + ', ' + baseColor.b + ')')

//             updateControls()
//         }
//     }

//     $(document).mouseup(e => {
//         selected = false
//         $('#picker').css('cursor', 'crosshair')
//         $('#greyScale').css('cursor', 'crosshair')
//     })

//     $('#greyScale').mousemove(e => {
//         if (selected) {
//             calcPosition(e, greyCanvas, greyCtx)
//         }
//     })

//     $('#picker').mousedown(e => {
//         selected = true
//         calcPosition(e, canvas, ctx)
//     })

//     $('#picker').mouseup(e => {
//         selected = false
//         $(this).css('cursor', 'crosshair')
//     })

//     $('#greyScale').mousedown(e => {
//         selected = true
//         calcPosition(e, greyCanvas, greyCtx)
//     })

//     $('#greyScale').mouseup(e => {
//         selected = false
//         $(this).css('cursor', 'crosshair')
//     })

//     $('.color').click(e => {
//         $('.colorpicker').fadeToggle('slow', 'linear')
//         selected = false
//     })

//     // $('body').click(e => {
//     //     $('.colorpicker').fadeOut('slow', 'linear')
//     // })

//     function updateControls() {
//         // update controls
//         $('#rVal').val(Math.round(baseColor.r));
//         $('#gVal').val(Math.round(baseColor.g));
//         $('#bVal').val(Math.round(baseColor.b));
//         $('#rgbVal').val(Math.round(baseColor.r) + ',' + Math.round(baseColor.g) + ',' + Math.round(baseColor.b));

//         var dColor = baseColor.b + 256 * baseColor.g + 65536 * baseColor.r;
//         $('#hexVal').val('#' + ('0000' + dColor.toString(16)).substr(-6));
//     }

//     $('#rVal').keyup(e => {
//         let inp = e.target
//         if (inp.value.length < 1) {
//             inp.value = "0"
//         } else if (parseInt(inp.value) > 255) {
//             inp.value = "255"
//         }

//         inp.value = parseInt(inp.value)

//         let val = parseInt(inp.value)
//         baseColor.r = val
//         $('.color').css('backgroundColor', 'rgb(' + baseColor.r + ', ' + baseColor.g + ', ' + baseColor.b + ')')

//     })

//     $('#gVal').keyup(e => {
//         let inp = e.target
//         if (inp.value.length < 1) {
//             inp.value = "0"
//         } else if (parseInt(inp.value) > 255) {
//             inp.value = "255"
//         }

//         let val = parseInt(inp.value)
//         baseColor.r = val
//         $('.color').css('backgroundColor', 'rgb(' + baseColor.r + ', ' + baseColor.g + ', ' + baseColor.b + ')')
//     })

//     $('#bVal').keyup(e => {
//         let inp = e.target
//         if (inp.value.length < 1) {
//             inp.value = "0"
//         } else if (parseInt(inp.value) > 255) {
//             inp.value = "255"
//         }

//         let val = parseInt(inp.value)
//         baseColor.r = val
//         $('.color').css('backgroundColor', 'rgb(' + baseColor.r + ', ' + baseColor.g + ', ' + baseColor.b + ')')
//     })

//     function createGradient(startColor) {
//         var my_gradient = ctx.createLinearGradient(0, 0, 0, 250);
//         my_gradient.addColorStop(0, startColor)
//             // my_gradient.addColorStop(0.05, "rgb(194, 194, 194)");
//             // my_gradient.addColorStop(0.25, "rgb(115, 115, 115)")
//         my_gradient.addColorStop(1, "black");
//         greyCtx.fillStyle = my_gradient;
//     }
// })


// function calcLightness(baseColor, lightness) {
//     let hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b)
//     hsl[2] = lightness
//     let newCol = hslToRgb(hsl[0], hsl[1], hsl[2])
//     baseColor.r = newCol[0]
//     baseColor.g = newCol[1]
//     baseColor.b = newCol[2]

// }

// function rgbToHsl(r, g, b) {
//     r /= 255, g /= 255, b /= 255;
//     var max = Math.max(r, g, b),
//         min = Math.min(r, g, b);
//     var h, s, l = (max + min) / 2;

//     if (max == min) {
//         h = s = 0; // achromatic
//     } else {
//         var d = max - min;
//         s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//         switch (max) {
//             case r:
//                 h = (g - b) / d + (g < b ? 6 : 0);
//                 break;
//             case g:
//                 h = (b - r) / d + 2;
//                 break;
//             case b:
//                 h = (r - g) / d + 4;
//                 break;
//         }
//         h /= 6;
//     }

//     return [h, s, l];
// }

// function hslToRgb(h, s, l) {
//     var r, g, b;

//     if (s == 0) {
//         r = g = b = l; // achromatic
//     } else {
//         function hue2rgb(p, q, t) {
//             if (t < 0) t += 1;
//             if (t > 1) t -= 1;
//             if (t < 1 / 6) return p + (q - p) * 6 * t;
//             if (t < 1 / 2) return q;
//             if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
//             return p;
//         }

//         var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//         var p = 2 * l - q;
//         r = hue2rgb(p, q, h + 1 / 3);
//         g = hue2rgb(p, q, h);
//         b = hue2rgb(p, q, h - 1 / 3);
//     }

//     return [r * 255, g * 255, b * 255];
// }