/**
 * A display-only text field which is not validated and not submitted. This is useful for when you want to display a
 * value from a form's {@link Ext.form.Basic#load loaded data} but do not want to allow the user to edit or submit that
 * value. The value can be optionally {@link #htmlEncode HTML encoded} if it contains HTML markup that you do not want
 * to be rendered.
 *
 * If you have more complex content, or need to include components within the displayed content, also consider using a
 * {@link Ext.form.FieldContainer} instead.
 *
 * Example:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         renderTo: Ext.getBody(),
 *         width: 175,
 *         height: 120,
 *         bodyPadding: 10,
 *         title: 'Final Score',
 *         items: [{
 *             xtype: 'displayfield',
 *             fieldLabel: 'Home',
 *             name: 'home_score',
 *             value: '10'
 *         }, {
 *             xtype: 'displayfield',
 *             fieldLabel: 'Visitor',
 *             name: 'visitor_score',
 *             value: '11'
 *         }],
 *         buttons: [{
 *             text: 'Update',
 *         }]
 *     });
 */
Ext.define('Ext.form.field.Display', {
    extend:'Ext.form.field.Base',
    alias: 'widget.displayfield',
    requires: ['Ext.util.Format', 'Ext.XTemplate'],
    alternateClassName: ['Ext.form.DisplayField', 'Ext.form.Display'],
    fieldSubTpl: [
        '<div id="{id}" class="{fieldCls}">{value}</div>',
        {
            compiled: true,
            disableFormats: true
        }
    ],

    /**
     * @cfg {String} [fieldCls="x-form-display-field"]
     * The default CSS class for the field.
     */
    fieldCls: Ext.baseCSSPrefix + 'form-display-field',

    /**
     * @cfg {Boolean} htmlEncode
     * false to skip HTML-encoding the text when rendering it. This might be useful if you want to
     * include tags in the field's innerHTML rather than rendering them as string literals per the default logic.
     */
    htmlEncode: false,
    
    /**
     * @cfg {Function} renderer
     * A function to transform the raw value for display in the field. The function will receive 2 arguments, the raw value
     * and the {@link Ext.form.field.Display} object.
     */
    
    /**
     * @cfg {Object} scope
     * The scope to execute the {@link #renderer} function. Defaults to this.
     */

    validateOnChange: false,

    initEvents: Ext.emptyFn,

    submitValue: false,

    isValid: function() {
        return true;
    },

    validate: function() {
        return true;
    },

    getRawValue: function() {
        return this.rawValue;
    },

    setRawValue: function(value) {
        var me = this,
            display;
            
        value = Ext.value(value, '');
        me.rawValue = value;
        if (me.rendered) {
            me.inputEl.dom.innerHTML = me.getDisplayValue();
        }
        return value;
    },

    /**
     * @private
     * Format the value to display.
     */
    getDisplayValue: function() {
        var me = this,
            value = this.getRawValue(),
            display;
        if (me.renderer) {
             display = me.renderer.call(me.scope || me, value, me);
        } else {
             display = me.htmlEncode ? Ext.util.Format.htmlEncode(value) : value;
        }
        return display;
    },
        
    getSubTplData: function() {
        var me = this;
        me.callParent(arguments);
        me.subTplData.value = me.getDisplayValue();
        return me.subTplData;
    }

    /**
     * @cfg {String} inputType
     * Not applicable for Display field.
     */
    /**
     * @cfg {Boolean} disabled
     * Not applicable for Display field.
     */
    /**
     * @cfg {Boolean} readOnly
     * Not applicable for Display field.
     */
    /**
     * @cfg {Boolean} validateOnChange
     * Not applicable for Display field.
     */
    /**
     * @cfg {Number} checkChangeEvents
     * Not applicable for Display field.
     */
    /**
     * @cfg {Number} checkChangeBuffer
     * Not applicable for Display field.
     */
});
