/*jshint node: true*/
'use strict';

// Clay component that shows one group of items at a time.
// Usage: { type: 'tabs', options: [{ label: 'A', group: 'group-a' }, ...] }
// and give each item a matching `group`. Hidden items are still saved.
// The functions are serialized into the config page, so they must not
// reference anything outside their own scope.
module.exports = {
    name: 'tabs',
    template:
        '<div class="component component-tabs">' +
        // Clay sets every item's value after building; this keeps that from wiping the buttons.
        '<span data-manipulator-target style="display: none"></span>' +
        '{{each options}}' +
        '<button type="button" class="tab" data-group="{{this.group}}">{{{this.label}}}</button>' +
        '{{/each}}' +
        '</div>',
    style:
        '.component-tabs { display: flex; padding: 0 0.75rem; }' +
        '.component-tabs .tab { flex: 1; min-width: 0; margin: 0; padding: 0.6rem 0; border: 0;' +
        ' border-radius: 0; border-bottom: 2px solid transparent; background: none; opacity: 0.6; }' +
        '.component-tabs .tab.active { border-bottom-color: #ff4700; opacity: 1; }',
    manipulator: 'html',
    defaults: {
        options: []
    },
    initialize: function(minified, clayConfig) {
        var self = this;
        clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
            var buttons = self.$element[0].querySelectorAll('.tab');

            function select(group) {
                self.config.options.forEach(function(option) {
                    clayConfig.getItemsByGroup(option.group).forEach(function(item) {
                        if (option.group === group) {
                            item.show();
                        } else {
                            item.hide();
                        }
                    });
                });
                Array.prototype.forEach.call(buttons, function(button) {
                    button.classList.toggle('active', button.getAttribute('data-group') === group);
                });
            }

            Array.prototype.forEach.call(buttons, function(button) {
                button.addEventListener('click', function() {
                    select(button.getAttribute('data-group'));
                });
            });

            if (self.config.options.length) {
                select(self.config.options[0].group);
            }
        });
    }
};
