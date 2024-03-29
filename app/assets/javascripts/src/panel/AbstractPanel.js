/**
 * @class Ext.panel.AbstractPanel
 * @private
 *
 * A base class which provides methods common to Panel classes across the Sencha product range.
 *
 * Please refer to sub class's documentation
 */
Ext.define('Ext.panel.AbstractPanel', {

    /* Begin Definitions */

    extend: 'Ext.container.Container',

    mixins: {
        docking: 'Ext.container.DockingContainer'
    },

    requires: ['Ext.util.MixedCollection', 'Ext.Element', 'Ext.toolbar.Toolbar'],

    /* End Definitions */

    /**
     * @cfg {String} [baseCls=x-panel]
     * The base CSS class to apply to this panel's element.
     */
    baseCls : Ext.baseCSSPrefix + 'panel',

    /**
     * @cfg {Number/String} bodyPadding
     * A shortcut for setting a padding style on the body element. The value can either be
     * a number to be applied to all sides, or a normal css string describing padding.
     * Defaults to <code>undefined</code>.
     */

    /**
     * @cfg {Boolean} bodyBorder
     * A shortcut to add or remove the border on the body of a panel. This only applies to a panel which has the {@link #frame} configuration set to `true`.
     * Defaults to <code>undefined</code>.
     */

    /**
     * @cfg {String/Object/Function} bodyStyle
     * Custom CSS styles to be applied to the panel's body element, which can be supplied as a valid CSS style string,
     * an object containing style property name/value pairs or a function that returns such a string or object.
     * For example, these two formats are interpreted to be equivalent:<pre><code>
bodyStyle: 'background:#ffc; padding:10px;'

bodyStyle: {
    background: '#ffc',
    padding: '10px'
}
     * </code></pre>
     */

    /**
     * @cfg {String/String[]} bodyCls
     * A CSS class, space-delimited string of classes, or array of classes to be applied to the panel's body element.
     * The following examples are all valid:<pre><code>
bodyCls: 'foo'
bodyCls: 'foo bar'
bodyCls: ['foo', 'bar']
     * </code></pre>
     */

    isPanel: true,

    componentLayout: 'dock',

    childEls: [
        'body'
    ],

    renderTpl: [
        // If this Panel is framed, the framing template renders the docked items round the frame
        '{% this.renderDockedItems(out,values,0); %}',
        '<div id="{id}-body" class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl>',
            ' {baseCls}-body-{ui}<tpl if="uiCls">',
                '<tpl for="uiCls"> {parent.baseCls}-body-{parent.ui}-{.}</tpl>',
            '</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
            '{%this.renderContainer(out,values);%}',
        '</div>',
        '{% this.renderDockedItems(out,values,1); %}'
    ],

    bodyPosProps: {
        x: 'x',
        y: 'y'
    },

    // TODO: Move code examples into product-specific files. The code snippet below is Touch only.
    /**
     * @cfg {Object/Object[]} dockedItems
     * A component or series of components to be added as docked items to this panel.
     * The docked items can be docked to either the top, right, left or bottom of a panel.
     * This is typically used for things like toolbars or tab bars:
     * <pre><code>
var panel = new Ext.panel.Panel({
    fullscreen: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            text: 'Docked to the top'
        }]
    }]
});</code></pre>
     */

    border: true,

    initComponent : function() {
        var me = this;

        me.addEvents(
            /**
             * @event bodyresize
             * Fires after the Panel has been resized.
             * @param {Ext.panel.Panel} p the Panel which has been resized.
             * @param {Number} width The Panel body's new width.
             * @param {Number} height The Panel body's new height.
             */
            'bodyresize'
            // // inherited
            // 'activate',
            // // inherited
            // 'deactivate'
        );

        //!frame
        //!border

        if (me.frame && me.border && me.bodyBorder === undefined) {
            me.bodyBorder = false;
        }
        if (me.frame && me.border && (me.bodyBorder === false || me.bodyBorder === 0)) {
            me.manageBodyBorders = true;
        }

        me.callParent();
    },

    beforeDestroy: function(){
        this.destroyDockedItems();
        this.callParent();
    },

    // @private
    initItems : function() {
        this.callParent();
        this.initDockingItems();
    },

    /**
     * Initialized the renderData to be used when rendering the renderTpl.
     * @return {Object} Object with keys and values that are going to be applied to the renderTpl
     * @private
     */
    initRenderData: function() {
        var me = this,
            data = me.callParent();

        me.initBodyStyles();
        me.protoBody.writeTo(data);
        delete me.protoBody;

        return data;
    },

    /**
     * Attempts a default component lookup (see {@link Ext.container.Container#getComponent}). If the component is not found in the normal
     * items, the dockedItems are searched and the matched component (if any) returned (see {@link #getDockedComponent}). Note that docked
     * items will only be matched by component id or itemId -- if you pass a numeric index only non-docked child components will be searched.
     * @param {String/Number} comp The component id, itemId or position to find
     * @return {Ext.Component} The component (if found)
     */
    getComponent: function(comp) {
        var component = this.callParent(arguments);
        if (component === undefined && !Ext.isNumber(comp)) {
            // If the arg is a numeric index skip docked items
            component = this.getDockedComponent(comp);
        }
        return component;
    },

    getProtoBody: function () {
        var me = this,
            body = me.protoBody;

        if (!body) {
            me.protoBody = body = new Ext.util.ProtoElement({
                cls: me.bodyCls,
                style: me.bodyStyle,
                clsProp: 'bodyCls',
                styleProp: 'bodyStyle',
                styleIsText: true
            });
        }

        return body;
    },

    /**
     * Parses the {@link bodyStyle} config if available to create a style string that will be applied to the body element.
     * This also includes {@link bodyPadding} and {@link bodyBorder} if available.
     * @return {String} A CSS style string with body styles, padding and border.
     * @private
     */
    initBodyStyles: function() {
        var me = this,
            body = me.getProtoBody(),
            Element = Ext.Element;

        if (me.bodyPadding !== undefined) {
            body.setStyle('padding', Element.unitizeBox((me.bodyPadding === true) ? 5 : me.bodyPadding));
        }
        if (me.frame && me.bodyBorder) {
            if (!Ext.isNumber(me.bodyBorder)) {
                me.bodyBorder = 1;
            }
            body.setStyle('border-width', Element.unitizeBox(me.bodyBorder));
        }
    },

    getCollapsedDockedItems: function () {
        return [ this.getReExpander() ];
    },

    /**
     * Sets the body style according to the passed parameters.
     * @param {Mixed} style A full style specification string, or object, or the name of a style property to set.
     * @param {String} value If the first param was a style property name, the style property value.
     */
    setBodyStyle: function(style, value) {
        var me = this,
            body = me.rendered ? me.body : me.getProtoBody();

        if (Ext.isFunction(style)) {
            style = style();
        }
        if (arguments.length == 1 && Ext.isString(style)) {
            style = Ext.Element.parseStyles(style);
        }

        body.setStyle.apply(me.body, arguments);
    },

    addBodyCls: function(cls) {
        var me = this,
            body = me.rendered ? me.body : me.getProtoBody();

        body.addCls(cls);
    },

    removeBodyCls: function(cls) {
        var me = this,
            body = me.rendered ? me.body : me.getProtoBody();

        body.removeCls(cls);
    },

    // inherit docs
    addUIClsToElement: function(cls, force) {
        var me = this,
            result = me.callParent(arguments);

        me.addBodyCls([Ext.baseCSSPrefix + cls, me.baseCls + '-body-' + cls, me.baseCls + '-body-' + me.ui + '-' + cls]);
        return result;
    },

    // inherit docs
    removeUIClsFromElement: function(cls, force) {
        var me = this,
            result = me.callParent(arguments);

        me.removeBodyCls([Ext.baseCSSPrefix + cls, me.baseCls + '-body-' + cls, me.baseCls + '-body-' + me.ui + '-' + cls]);
        return result;
    },

    // inherit docs
    addUIToElement: function(force) {
        var me = this;

        me.callParent(arguments);
        me.addBodyCls(me.baseCls + '-body-' + me.ui);
    },

    // inherit docs
    removeUIFromElement: function() {
        var me = this;

        me.callParent(arguments);
        me.removeBodyCls(me.baseCls + '-body-' + me.ui);
    },

    // @private
    getTargetEl : function() {
        return this.body;
    },

    getRefItems: function(deep) {
        var items = this.callParent(arguments);

        return this.getDockingRefItems(deep, items);
    },

    setBorder: function(border) {
        var me = this;
        me.border = (border !== undefined) ? border : true;
        if (me.rendered) {
            me.doComponentLayout();
        }
    },

    setupRenderTpl: function (renderTpl) {
        this.callParent(arguments);
        this.setupDockingRenderTpl(renderTpl);
    }
});
