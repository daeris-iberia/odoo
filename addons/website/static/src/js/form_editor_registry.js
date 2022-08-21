odoo.define('website.form_editor_registry', function (require) {
'use strict';

var Registry = require('web.Registry');

return new Registry();

});

odoo.define('website.send_mail_form', function (require) {
'use strict';

var core = require('web.core');
var FormEditorRegistry = require('website.form_editor_registry');

var _t = core._t;

FormEditorRegistry.add('send_mail', {
    formFields: [{
        type: 'char',
        custom: true,
        required: true,
        fillWith: 'name',
        name: 'name',
        string: 'Tu Nombre',
    }, {
        type: 'tel',
        custom: true,
        fillWith: 'phone',
        name: 'phone',
        string: 'Teléfono',
    }, {
        type: 'email',
        modelRequired: true,
        fillWith: 'email',
        name: 'email_from',
        string: 'Tu Correo Electrónico',
    }, {
        type: 'char',
        custom: true,
        fillWith: 'commercial_company_name',
        name: 'company',
        string: 'Tu Compañía',
    }, {
        type: 'char',
        modelRequired: true,
        name: 'subject',
        string: 'Asunto',
    }, {
        type: 'text',
        custom: true,
        required: true,
        name: 'description',
        string: 'Tu Pregunta',
    }],
    fields: [{
        name: 'email_to',
        type: 'char',
        required: true,
        string: _t('Recipient Email'),
        defaultValue: 'info@yourcompany.example.com',
    }],
});

});
