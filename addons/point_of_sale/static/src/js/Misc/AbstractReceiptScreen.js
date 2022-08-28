odoo.define('point_of_sale.AbstractReceiptScreen', function (require) {
    'use strict';

    const { useRef } = owl.hooks;
    const { nextFrame } = require('point_of_sale.utils');
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    /**
     * This relies on the assumption that there is a reference to
     * `order-receipt` so it is important to declare a `t-ref` to
     * `order-receipt` in the template of the Component that extends
     * this abstract component.
     */
    class AbstractReceiptScreen extends PosComponent {
        constructor() {
            super(...arguments);
            this.orderReceipt = useRef('order-receipt');
        }
        async _printReceipt() {
            if (this.env.pos.proxy.printer) {
                const printResult = await this.env.pos.proxy.printer.print_receipt(this.orderReceipt.el.outerHTML);
                if (printResult.successful) {
                    return true;
                } else {
                    const { confirmed } = await this.showPopup('ConfirmPopup', {
                        title: printResult.message.title,
                        body: '¿Quieres realizar la impresión usando la impresora web?',
                    });
                    if (confirmed) {
                        // We want to call the _printWeb when the popup is fully gone
                        // from the screen which happens after the next animation frame.
                        await nextFrame();
                        return await this._printWeb();
                    }
                    return false;
                }
            } else {
                return await this._printWeb();
            }
        }
        async _printWeb() {
            try {
                window.print();
                return true;
            } catch (err) {
                await this.showPopup('ErrorPopup', {
                    title: this.env._t('La impresión no está soportada en algunos navegadores'),
                    body: this.env._t(
                        'La impresión no es compatible con algunos navegadores debido a que no existe un protocolo de impresión predeterminado ' +
                            'disponible.'
                    ),
                });
                return false;
            }
        }
    }

    Registries.Component.add(AbstractReceiptScreen);

    return AbstractReceiptScreen;
});
