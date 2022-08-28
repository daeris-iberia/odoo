
odoo.define('pos_epson_printer.Printer', function (require) {
"use strict";

var core = require('web.core');
var { PrinterMixin, PrintResult, PrintResultGenerator } = require('point_of_sale.Printer');

var QWeb = core.qweb;
var _t = core._t;

class EpsonPrintResultGenerator extends PrintResultGenerator {
    constructor(address) {
        super();
        this.address = address;
    }

    IoTActionError() {
        var printRes = new PrintResult({
            successful: false,
            message: {
                title: _t('La conexión a la impresora falló'),
                body: _t('Por favor, compruebe si la impresora todavía está conectada. \n' +
                    'Algunos navegadores no permiten llamadas HTTP desde sitios web a dispositivos en la red (por razones de seguridad). ' +
                    'Si es el caso, deberá seguir la documentación de Daeris para' +
                    '\'Certificado autofirmado para impresoras ePOS\' y \'Conexión segura (HTTPS)\' para resolver el problema'
                ),
            }
        });

        if (window.location.protocol === 'https:') {
            printRes.message.body += _.str.sprintf(
                _t('Si está en un servidor seguro (HTTPS), asegúrese de aceptar manualmente el certificado accediendo %s'),
                this.address
            );
        }

        return printRes;
    }

    IoTResultError() {
        return new PrintResult({
            successful: false,
            message: {
                title: _t('Error al imprimir'),
                body: _t('Compruebe si la impresora tiene suficiente papel y está lista para imprimir.'),
            },
        });
    }
}

var EpsonPrinter = core.Class.extend(PrinterMixin, {
    init(ip, pos) {
        PrinterMixin.init.call(this, pos);
        var url = window.location.protocol + '//' + ip;
        this.address = url + '/cgi-bin/epos/service.cgi?devid=local_printer';
        this.printResultGenerator = new EpsonPrintResultGenerator(url);
    },


    /**
     * Transform a (potentially colored) canvas into a monochrome raster image.
     * We will use Floyd-Steinberg dithering.
     */
    _canvasToRaster(canvas) {
        var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        var width = imageData.width;
        var height = imageData.height;
        var errors = Array.from(Array(width), _ => Array(height).fill(0));
        var rasterData = new Array(width * height).fill(0);

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var idx, oldColor, newColor;

                // Compute grayscale level. Those coefficients were found online
                // as R, G and B have different impacts on the darkness
                // perception (e.g. pure blue is darker than red or green).
                idx = (y * width + x) * 4;
                oldColor = pixels[idx] * 0.299 + pixels[idx+1] * 0.587 + pixels[idx+2] * 0.114;

                // Propagate the error from neighbor pixels 
                oldColor += errors[x][y];
                oldColor = Math.min(255, Math.max(0, oldColor));

                if (oldColor < 128) {
                    // This pixel should be black
                    newColor = 0;
                    rasterData[y * width + x] = 1;
                } else {
                    // This pixel should be white
                    newColor = 255;
                    rasterData[y * width + x] = 0;
                }

                // Propagate the error to the following pixels, based on
                // Floyd-Steinberg dithering.
                var error = oldColor - newColor;
                if (error) {
                    if (x < width - 1) {
                        // Pixel on the right
                        errors[x + 1][y] += 7/16 * error;
                    }
                    if (x > 0 && y < height - 1) {
                        // Pixel on the bottom left
                        errors[x - 1][y + 1] += 3/16 * error;
                    }
                    if (y < height - 1) {
                        // Pixel below
                        errors[x][y + 1] += 5/16 * error;
                    }
                    if (x < width - 1 && y < height - 1) {
                        // Pixel on the bottom right
                        errors[x + 1][y + 1] += 1/16 * error;
                    }
                }
            }
        }

        return rasterData.join('');
    },

    /**
     * Base 64 encode a raster image
     */
    _encodeRaster(rasterData) {
        var encodedData = '';
        for(var i = 0; i < rasterData.length; i+=8){
            var sub = rasterData.substr(i, 8);
            encodedData += String.fromCharCode(parseInt(sub, 2));
        }
        return btoa(encodedData);
    },

    /**
     * Create the raster data from a canvas
     * 
     * @override
     */
    process_canvas(canvas) {
        var rasterData = this._canvasToRaster(canvas);
        var encodedData = this._encodeRaster(rasterData);
        return QWeb.render('ePOSPrintImage', {
            image: encodedData,
            width: canvas.width,
            height: canvas.height,
        });
    },

    /**
     * @override
     */
    open_cashbox() {
        var pulse = QWeb.render('ePOSDrawer');
        this.send_printing_job(pulse);
    },

    /**
     * @override
     */
    async send_printing_job(img) {
        const res = await $.ajax({
            url: this.address,
            method: 'POST',
            data: img,
        });
        return $(res).find('response').attr('success') === 'true';
    },
});

return EpsonPrinter;

});
