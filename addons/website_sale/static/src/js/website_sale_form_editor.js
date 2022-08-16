odoo.define('website_sale.form', function (require) {
'use strict';

var FormEditorRegistry = require('website.form_editor_registry');

FormEditorRegistry.add('create_customer', {
    formFields: [{
        type: 'char',
        modelRequired: true,
        name: 'name',
        fillWith: 'name',
        string: 'Tu Nombre',
    }, {
        type: 'email',
        required: true,
        fillWith: 'email',
        name: 'email',
        string: 'Tu Correo Electrónico',
    }, {
        type: 'tel',
        fillWith: 'phone',
        name: 'phone',
        string: 'Teléfono',
    }, {
        type: 'char',
        name: 'company_name',
        fillWith: 'commercial_company_name',
        string: 'Compañía',
    }],
});

});
