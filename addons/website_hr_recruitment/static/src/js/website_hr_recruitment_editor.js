odoo.define('website_hr_recruitment.form', function (require) {
'use strict';

var core = require('web.core');
var FormEditorRegistry = require('website.form_editor_registry');

var _t = core._t;

FormEditorRegistry.add('apply_job', {
    formFields: [{
        type: 'char',
        modelRequired: true,
        name: 'partner_name',
        fillWith: 'name',
        string: 'Tu Nombre',
    }, {
        type: 'email',
        required: true,
        fillWith: 'email',
        name: 'email_from',
        string: 'Tu Correo Electrónico',
    }, {
        type: 'char',
        required: true,
        fillWith: 'phone',
        name: 'partner_phone',
        string: 'Teléfono',
    }, {
        type: 'text',
        name: 'description',
        string: 'Descripción Breve',
    }, {
        type: 'binary',
        custom: true,
        name: 'CV',
    }],
    fields: [{
        name: 'job_id',
        type: 'many2one',
        relation: 'hr.job',
        string: _t('Applied Job'),
    }, {
        name: 'department_id',
        type: 'many2one',
        relation: 'hr.department',
        string: _t('Department'),
    }],
    successPage: '/job-thank-you',
});

});
