/**
 * @class Ext.grid.property.Grid
 *
 * A specialized grid implementation intended to mimic the traditional property grid as typically seen in
 * development IDEs.  Each row in the grid represents a property of some object, and the data is stored
 * as a set of name/value pairs in {@link Ext.grid.property.Property Properties}.  Example usage:
 *
 *     @example
 *     Ext.create('Ext.grid.property.Grid', {
 *         title: 'Properties Grid',
 *         width: 300,
 *         renderTo: Ext.getBody(),
 *         source: {
 *             "(name)": "My Object",
 *             "Created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
 *             "Available": false,
 *             "Version": .01,
 *             "Description": "A test object"
 *         }
 *     });
 */
Ext.define('Ext.grid.property.Grid', {

    extend: 'Ext.grid.Panel',

    alias: 'widget.propertygrid',

    alternateClassName: 'Ext.grid.PropertyGrid',

    uses: [
       'Ext.grid.plugin.CellEditing',
       'Ext.grid.property.Store',
       'Ext.grid.property.HeaderContainer',
       'Ext.XTemplate',
       'Ext.grid.CellEditor',
       'Ext.form.field.Date',
       'Ext.form.field.Text',
       'Ext.form.field.Number',
       'Ext.form.field.ComboBox'
    ],

   /**
    * @cfg {Object} propertyNames An object containing custom property name/display name pairs.
    * If specified, the display name will be shown in the name column instead of the property name.
    */

    /**
    * @cfg {Object} source A data object to use as the data source of the grid (see {@link #setSource} for details).
    */

    /**
    * @cfg {Object} customEditors An object containing name/value pairs of custom editor type definitions that allow
    * the grid to support additional types of editable fields.  By default, the grid supports strongly-typed editing
    * of strings, dates, numbers and booleans using built-in form editors, but any custom type can be supported and
    * associated with a custom input control by specifying a custom editor.  The name of the editor
    * type should correspond with the name of the property that will use the editor.  Example usage:
    * <pre><code>
var grid = new Ext.grid.property.Grid({

    // Custom editors for certain property names
    customEditors: {
        evtStart: Ext.create('Ext.form.TimeField' {selectOnFocus:true})
    },

    // Displayed name for property names in the source
    propertyNames: {
        evtStart: 'Start Time'
    },

    // Data object containing properties to edit
    source: {
        evtStart: '10:00 AM'
    }
});
</code></pre>
    */

    /**
    * @cfg {Object} source A data object to use as the data source of the grid (see {@link #setSource} for details).
    */

    /**
    * @cfg {Object} customRenderers An object containing name/value pairs of custom renderer type definitions that allow
    * the grid to support custom rendering of fields.  By default, the grid supports strongly-typed rendering
    * of strings, dates, numbers and booleans using built-in form editors, but any custom type can be supported and
    * associated with the type of the value.  The name of the renderer type should correspond with the name of the property
    * that it will render.  Example usage:
    * <pre><code>
var grid = Ext.create('Ext.grid.property.Grid', {
    customRenderers: {
        Available: function(v){
            if (v) {
                return '<span style="color: green;">Yes</span>';
            } else {
                return '<span style="color: red;">No</span>';
            }
        }
    },
    source: {
        Available: true
    }
});
</code></pre>
    */

    /**
     * @cfg {String} valueField
     * Optional. The name of the field from the property store to use as the value field name. Defaults to <code>'value'</code>
     * This may be useful if you do not configure the property Grid from an object, but use your own store configuration.
     */
    valueField: 'value',

    /**
     * @cfg {String} nameField
     * Optional. The name of the field from the property store to use as the property field name. Defaults to <code>'name'</code>
     * This may be useful if you do not configure the property Grid from an object, but use your own store configuration.
     */
    nameField: 'name',

    /**
     * @cfg {Number} nameColumnWidth
     * Optional. Specify the width for the name column. The value column will take any remaining space. Defaults to <tt>115</tt>.
     */

    // private config overrides
    enableColumnMove: false,
    columnLines: true,
    stripeRows: false,
    trackMouseOver: false,
    clicksToEdit: 1,
    enableHdMenu: false,

    // private
    initComponent : function(){
        var me = this;

        me.addCls(Ext.baseCSSPrefix + 'property-grid');
        me.plugins = me.plugins || [];

        // Enable cell editing. Inject a custom startEdit which always edits column 1 regardless of which column was clicked.
        me.plugins.push(new Ext.grid.plugin.CellEditing({
            clicksToEdit: me.clicksToEdit,

            // Inject a startEdit which always edits the value column
            startEdit: function(record, column) {
                // Maintainer: Do not change this 'this' to 'me'! It is the CellEditing object's own scope.
                return this.self.prototype.startEdit.call(this, record, me.headerCt.child('#' + me.valueField));
            }
        }));

        me.selModel = {
            selType: 'cellmodel',
            onCellSelect: function(position) {
                if (position.column != 1) {
                    position.column = 1;
                }
                return this.self.prototype.onCellSelect.call(this, position);
            }
        };
        me.customRenderers = me.customRenderers || {};
        me.customEditors = me.customEditors || {};

        // Create a property.Store from the source object unless configured with a store
        if (!me.store) {
            me.propStore = me.store = new Ext.grid.property.Store(me, me.source);
        }

        me.store.sort('name', 'ASC');
        me.columns = new Ext.grid.property.HeaderContainer(me, me.store);

        me.addEvents(
            /**
             * @event beforepropertychange
             * Fires before a property value changes.  Handlers can return false to cancel the property change
             * (this will internally call {@link Ext.data.Model#reject} on the property's record).
             * @param {Object} source The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId The record's id in the data store
             * @param {Object} value The current edited property value
             * @param {Object} oldValue The original property value prior to editing
             */
            'beforepropertychange',
            /**
             * @event propertychange
             * Fires after a property value has changed.
             * @param {Object} source The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId The record's id in the data store
             * @param {Object} value The current edited property value
             * @param {Object} oldValue The original property value prior to editing
             */
            'propertychange'
        );
        me.callParent();

        // Inject a custom implementation of walkCells which only goes up or down
        me.getView().walkCells = this.walkCells;

        // Set up our default editor set for the 4 atomic data types
        me.editors = {
            'date'    : new Ext.grid.CellEditor({ field: new Ext.form.field.Date({selectOnFocus: true})}),
            'string'  : new Ext.grid.CellEditor({ field: new Ext.form.field.Text({selectOnFocus: true})}),
            'number'  : new Ext.grid.CellEditor({ field: new Ext.form.field.Number({selectOnFocus: true})}),
            'boolean' : new Ext.grid.CellEditor({ field: new Ext.form.field.ComboBox({
                editable: false,
                store: [[ true, me.headerCt.trueText ], [false, me.headerCt.falseText ]]
            })})
        };

        // Track changes to the data so we can fire our events.
        me.store.on('update', me.onUpdate, me);
    },

    // private
    onUpdate : function(store, record, operation) {
        var me = this,
            v, oldValue;

        if (operation == Ext.data.Model.EDIT) {
            v = record.get(me.valueField);
            oldValue = record.modified.value;
            if (me.fireEvent('beforepropertychange', me.source, record.getId(), v, oldValue) !== false) {
                if (me.source) {
                    me.source[record.getId()] = v;
                }
                record.commit();
                me.fireEvent('propertychange', me.source, record.getId(), v, oldValue);
            } else {
                record.reject();
            }
        }
    },

    // Custom implementation of walkCells which only goes up and down.
    walkCells: function(pos, direction, e, preventWrap, verifierFn, scope) {
        if (direction == 'left') {
            direction = 'up';
        } else if (direction == 'right') {
            direction = 'down';
        }
        pos = Ext.view.Table.prototype.walkCells.call(this, pos, direction, e, preventWrap, verifierFn, scope);
        if (!pos.column) {
            pos.column = 1;
        }
        return pos;
    },

    // private
    // returns the correct editor type for the property type, or a custom one keyed by the property name
    getCellEditor : function(record, column) {
        var me = this,
            propName = record.get(me.nameField),
            val = record.get(me.valueField),
            editor = me.customEditors[propName];

        // A custom editor was found. If not already wrapped with a CellEditor, wrap it, and stash it back
        // If it's not even a Field, just a config object, instantiate it before wrapping it.
        if (editor) {
            if (!(editor instanceof Ext.grid.CellEditor)) {
                if (!(editor instanceof Ext.form.field.Base)) {
                    editor = Ext.ComponentManager.create(editor, 'textfield');
                }
                editor = me.customEditors[propName] = new Ext.grid.CellEditor({ field: editor });
            }
        } else if (Ext.isDate(val)) {
            editor = me.editors.date;
        } else if (Ext.isNumber(val)) {
            editor = me.editors.number;
        } else if (Ext.isBoolean(val)) {
            editor = me.editors['boolean'];
        } else {
            editor = me.editors.string;
        }

        // Give the editor a unique ID because the CellEditing plugin caches them
        editor.editorId = propName;
        return editor;
    },

    beforeDestroy: function() {
        var me = this;
        me.callParent();
        me.destroyEditors(me.editors);
        me.destroyEditors(me.customEditors);
        delete me.source;
    },

    destroyEditors: function (editors) {
        for (var ed in editors) {
            if (editors.hasOwnProperty(ed)) {
                Ext.destroy(editors[ed]);
            }
        }
    },

    /**
     * Sets the source data object containing the property data.  The data object can contain one or more name/value
     * pairs representing all of the properties of an object to display in the grid, and this data will automatically
     * be loaded into the grid's {@link #store}.  The values should be supplied in the proper data type if needed,
     * otherwise string type will be assumed.  If the grid already contains data, this method will replace any
     * existing data.  See also the {@link #source} config value.  Example usage:
     * <pre><code>
grid.setSource({
    "(name)": "My Object",
    "Created": Ext.Date.parse('10/15/2006', 'm/d/Y'),  // date type
    "Available": false,  // boolean type
    "Version": .01,      // decimal type
    "Description": "A test object"
});
</code></pre>
     * @param {Object} source The data object
     */
    setSource: function(source) {
        this.source = source;
        this.propStore.setSource(source);
    },

    /**
     * Gets the source data object containing the property data.  See {@link #setSource} for details regarding the
     * format of the data object.
     * @return {Object} The data object
     */
    getSource: function() {
        return this.propStore.getSource();
    },

    /**
     * Sets the value of a property.
     * @param {String} prop The name of the property to set
     * @param {Object} value The value to test
     * @param {Boolean} create (Optional) True to create the property if it doesn't already exist. Defaults to <tt>false</tt>.
     */
    setProperty: function(prop, value, create) {
        this.propStore.setValue(prop, value, create);
    },

    /**
     * Removes a property from the grid.
     * @param {String} prop The name of the property to remove
     */
    removeProperty: function(prop) {
        this.propStore.remove(prop);
    }

    /**
     * @cfg store
     * Not applicable for property grid.
     */
    /**
     * @cfg columns
     * Not applicable for property grid.
     */
});