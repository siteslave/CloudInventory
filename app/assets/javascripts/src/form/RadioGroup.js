/**
 * A {@link Ext.form.FieldContainer field container} which has a specialized layout for arranging
 * {@link Ext.form.field.Radio} controls into columns, and provides convenience {@link Ext.form.field.Field}
 * methods for {@link #getValue getting}, {@link #setValue setting}, and {@link #validate validating} the
 * group of radio buttons as a whole.
 *
 * # Validation
 *
 * Individual radio buttons themselves have no default validation behavior, but
 * sometimes you want to require a user to select one of a group of radios. RadioGroup
 * allows this by setting the config `{@link #allowBlank}:false`; when the user does not check at
 * one of the radio buttons, the entire group will be highlighted as invalid and the
 * {@link #blankText error message} will be displayed according to the {@link #msgTarget} config.</p>
 *
 * # Layout
 *
 * The default layout for RadioGroup makes it easy to arrange the radio buttons into
 * columns; see the {@link #columns} and {@link #vertical} config documentation for details. You may also
 * use a completely different layout by setting the {@link #layout} to one of the other supported layout
 * types; for instance you may wish to use a custom arrangement of hbox and vbox containers. In that case
 * the Radio components at any depth will still be managed by the RadioGroup's validation.
 *
 * # Example usage
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         title: 'RadioGroup Example',
 *         width: 300,
 *         height: 125,
 *         bodyPadding: 10,
 *         renderTo: Ext.getBody(),
 *         items:[{
 *             xtype: 'radiogroup',
 *             fieldLabel: 'Two Columns',
 *             // Arrange radio buttons into two columns, distributed vertically
 *             columns: 2,
 *             vertical: true,
 *             items: [
 *                 { boxLabel: 'Item 1', name: 'rb', inputValue: '1' },
 *                 { boxLabel: 'Item 2', name: 'rb', inputValue: '2', checked: true},
 *                 { boxLabel: 'Item 3', name: 'rb', inputValue: '3' },
 *                 { boxLabel: 'Item 4', name: 'rb', inputValue: '4' },
 *                 { boxLabel: 'Item 5', name: 'rb', inputValue: '5' },
 *                 { boxLabel: 'Item 6', name: 'rb', inputValue: '6' }
 *             ]
 *         }]
 *     });
 *
 */
Ext.define('Ext.form.RadioGroup', {
    extend: 'Ext.form.CheckboxGroup',
    alias: 'widget.radiogroup',

    /**
     * @cfg {Ext.form.field.Radio[]/Object[]} items
     * An Array of {@link Ext.form.field.Radio Radio}s or Radio config objects to arrange in the group.
     */
    /**
     * @cfg {Boolean} allowBlank True to allow every item in the group to be blank.
     * If allowBlank = false and no items are selected at validation time, {@link #blankText} will
     * be used as the error text.
     */
    allowBlank : true,
    /**
     * @cfg {String} blankText Error text to display if the {@link #allowBlank} validation fails
     */
    blankText : 'You must select one item in this group',

    // private
    defaultType : 'radiofield',

    // private
    groupCls : Ext.baseCSSPrefix + 'form-radio-group',

    getBoxes: function() {
        return this.query('[isRadio]');
    },

    /**
     * Sets the value of the radio group. The radio with corresponding name and value will be set.
     * This method is simpler than {@link Ext.form.CheckboxGroup#setValue} because only 1 value is allowed
     * for each name.
     * 
     * @param {Object} value The map from names to values to be set.
     * @return {Ext.form.CheckboxGroup} this
     */
    setValue: function(value) {
        var me = this;
        if (Ext.isObject(value)) {
            Ext.Object.each(value, function(name, cbValue) {
                var radios = Ext.form.RadioManager.getWithValue(name, cbValue);
                radios.each(function(cb) {
                    cb.setValue(true);
                });
            });
        }
        return me;
    }
});
