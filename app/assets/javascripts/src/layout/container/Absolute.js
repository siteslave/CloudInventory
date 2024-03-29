/**
 * @class Ext.layout.container.Absolute
 *
 * This is a layout that inherits the anchoring of {@link Ext.layout.container.Anchor} and adds the
 * ability for x/y positioning using the standard x and y component config options.
 *
 * This class is intended to be extended or created via the {@link Ext.container.Container#layout layout}
 * configuration property.  See {@link Ext.container.Container#layout} for additional details.
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         title: 'Absolute Layout',
 *         width: 300,
 *         height: 275,
 *         layout:'absolute',
 *         layoutConfig: {
 *             // layout-specific configs go here
 *             //itemCls: 'x-abs-layout-item',
 *         },
 *         url:'save-form.php',
 *         defaultType: 'textfield',
 *         items: [{
 *             x: 10,
 *             y: 10,
 *             xtype:'label',
 *             text: 'Send To:'
 *         },{
 *             x: 80,
 *             y: 10,
 *             name: 'to',
 *             anchor:'90%'  // anchor width by percentage
 *         },{
 *             x: 10,
 *             y: 40,
 *             xtype:'label',
 *             text: 'Subject:'
 *         },{
 *             x: 80,
 *             y: 40,
 *             name: 'subject',
 *             anchor: '90%'  // anchor width by percentage
 *         },{
 *             x:0,
 *             y: 80,
 *             xtype: 'textareafield',
 *             name: 'msg',
 *             anchor: '100% 100%'  // anchor width and height
 *         }],
 *         renderTo: Ext.getBody()
 *     });
 */
Ext.define('Ext.layout.container.Absolute', {

    /* Begin Definitions */

    alias: 'layout.absolute',
    extend: 'Ext.layout.container.Anchor',
    alternateClassName: 'Ext.layout.AbsoluteLayout',

    /* End Definitions */

    targetCls: Ext.baseCSSPrefix + 'abs-layout-ct',
    itemCls: Ext.baseCSSPrefix + 'abs-layout-item',

    type: 'absolute',

    // private
    adjustWidthAnchor: function(value, childContext) {
        var padding = this.targetPadding,
            x = childContext.getStyle('left');

        return value - x + padding.left;
    },

    // private
    adjustHeightAnchor: function(value, childContext) {
        var padding = this.targetPadding,
            y = childContext.getStyle('top');

        return value - y + padding.top;
    },

    // private
    isValidParent : function(item, target, position) {
        // Note: Absolute layout does not care about order within the innerCt element because it's an absolutely positioning layout
        // We only care whether the item is a direct child of the innerCt element.
        var itemEl = item.el ? item.el.dom : Ext.getDom(item);
        return (itemEl && itemEl.parentNode === this.getRenderTarget().dom) || false;
    },

    beginLayout: function (ownerContext) {
        var me = this,
            target = me.getTarget();

        me.callParent(arguments);

        // Do not set position: relative; when the absolute layout target is the body
        if (target.dom !== document.body) {
            target.position();
        }

        me.targetPadding = ownerContext.targetContext.getPaddingInfo();
    },

    isItemBoxParent: function (itemContext) {
        return true;
    }
});
