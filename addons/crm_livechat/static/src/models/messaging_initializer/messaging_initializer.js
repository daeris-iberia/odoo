/** @odoo-module **/

import { registerInstancePatchModel } from '@mail/model/model_core';
import { insert } from '@mail/model/model_field_command';

registerInstancePatchModel('mail.messaging_initializer', 'crm_livechat', {
    /**
     * @override
     */
    _initCommands() {
        this._super();
        this.messaging.update({
            commands: insert({
                help: this.env._t("Crear un cliente potencial (/lead Título)"),
                methodName: 'execute_command_lead',
                name: "lead",
            }),
        });
    },
});
