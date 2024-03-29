/**
 * Component layout for tabs
 * @class Ext.layout.component.Tab
 * @private
 */
Ext.define('Ext.layout.component.Tab', {

    extend: 'Ext.layout.component.Button',
    alias: 'layout.tab',

    beginLayout: function(ownerContext) {
        var me = this,
            closable = me.owner.closable;

        // Changing the close button visibility causes our cached measurements to be wrong,
        // so we must convince our base class to re-cache those adjustments...
        //
        if (me.lastClosable !== closable) {
            me.lastClosable = closable;
            delete me.adjWidth;
        }

        me.callParent(arguments);
    }
});
