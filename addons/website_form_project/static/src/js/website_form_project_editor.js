odoo.define('website_form_project.form', function (require) {
'use strict';

var core = require('web.core');
var FormEditorRegistry = require('website.form_editor_registry');

var _t = core._t;

FormEditorRegistry.add('create_task', {
    formFields: [{
        type: 'char',
        modelRequired: true,
        name: 'name',
        string: 'Título de la Tarea',
    }, {
        type: 'email',
        modelRequired: true,
        fillWith: 'email',
        name: 'email_from',
        string: 'Tu Correo Electrónico',
    }, {
        type: 'char',
        name: 'description',
        string: 'Descripción',
    }],
    fields: [{
        name: 'project_id',
        type: 'many2one',
        relation: 'project.project',
        string: _t('Project'),
        createAction: 'project.open_view_project_all',
    }],
});

});
