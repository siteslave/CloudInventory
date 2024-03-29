/**
 * An internally used DataView for {@link Ext.form.field.ComboBox ComboBox}.
 */
Ext.define('Ext.view.BoundList', {
    extend: 'Ext.view.View',
    alias: 'widget.boundlist',
    alternateClassName: 'Ext.BoundList',
    requires: ['Ext.layout.component.BoundList', 'Ext.toolbar.Paging'],

    /**
     * @cfg {Number} pageSize
     * If greater than `0`, a {@link Ext.toolbar.Paging} is displayed at the bottom of the list and store
     * queries will execute with page {@link Ext.data.Operation#start start} and
     * {@link Ext.data.Operation#limit limit} parameters. Defaults to `0`.
     */
    pageSize: 0,

    /**
     * @property {Ext.toolbar.Paging} pagingToolbar
     * A reference to the PagingToolbar instance in this view. Only populated if {@link #pageSize} is greater
     * than zero and the BoundList has been rendered.
     */

    // private overrides
    baseCls: Ext.baseCSSPrefix + 'boundlist',
    itemCls: Ext.baseCSSPrefix + 'boundlist-item',
    listItemCls: '',
    shadow: false,
    trackOver: true,
    refreshed: 0,
    
    // This Component is used as a popup, not part of a complex layout. Display data immediately.
    deferInitialRefresh: false,

    componentLayout: 'boundlist',

    childEls: [
        'listEl'
    ],

    renderTpl: [
        '<div id="{id}-listEl" class="list-ct" style="overflow:auto"></div>' +
        '{%this.renderToolbar(out, values)%}', {

            disableFormats: true,

            renderToolbar: function(out, values) {
                var me = values.$comp;
                if (me.pagingToolbar) {
                    me.pagingToolbar.ownerLayout = me.componentLayout;
                    Ext.DomHelper.generateMarkup(me.pagingToolbar.getRenderTree(), out);
                }
            }
        }
    ],
    /**
     * @cfg {String/Ext.XTemplate} tpl
     * A String or Ext.XTemplate instance to apply to inner template.
     *
     * {@link Ext.view.BoundList} is used for the dropdown list of {@link Ext.form.field.ComboBox}. To customize the template you can do this:<pre><code>
     * Ext.create('Ext.form.field.ComboBox', {
     *     fieldLabel   : 'State',
     *     queryMode    : 'local',
     *     displayField : 'text',
     *     valueField   : 'abbr',
     *     store        : Ext.create('StateStore', {
     *         fields : ['abbr', 'text'],
     *         data   : [
     *             {"abbr":"AL", "name":"Alabama"},
     *             {"abbr":"AK", "name":"Alaska"},
     *             {"abbr":"AZ", "name":"Arizona"}
     *             //...
     *         ]
     *     }),
     *     listConfig : {
     *         tpl : '<tpl for="."><div class="x-combo-list-item">{abbr}</div></tpl>'
     *     }
     * });
     * </code></pre>
     * Defaults to: <pre><code>
     *     Ext.create('Ext.XTemplate',
                '<ul><tpl for=".">',
                    '<li role="option" class="' + itemCls + '">' + me.getInnerTpl(me.displayField) + '</li>',
                '</tpl></ul>'
            );
     * </code></pre>
     */

    initComponent: function() {
        var me = this,
            baseCls = me.baseCls,
            itemCls = me.itemCls;
            
        me.selectedItemCls = baseCls + '-selected';
        me.overItemCls = baseCls + '-item-over';
        me.itemSelector = "." + itemCls;

        if (me.floating) {
            me.addCls(baseCls + '-floating');
        }

        if (!me.tpl) {
            // should be setting aria-posinset based on entire set of data
            // not filtered set
            me.tpl = new Ext.XTemplate(
                '<ul><tpl for=".">',
                    '<li role="option" class="' + itemCls + '">' + me.getInnerTpl(me.displayField) + '</li>',
                '</tpl></ul>'
            );
        } else if (Ext.isString(me.tpl)) {
            me.tpl = new Ext.XTemplate(me.tpl);
        }

        if (me.pageSize) {
            me.pagingToolbar = me.createPagingToolbar();
        }

        me.callParent();
    },

    createPagingToolbar: function() {
        return Ext.widget('pagingtoolbar', {
            id: this.id + '-paging-toolbar',
            pageSize: this.pageSize,
            store: this.store,
            border: false
        });
    },

    // Do the job of a container layout at this point even though we are not a Container.
    // TODO: Refactor as a Container.
    finishRenderChildren: function () {
        var toolbar = this.pagingToolbar;

        this.callParent(arguments);

        if (toolbar) {
            toolbar.finishRender();
        }
    },

    bindStore : function(store, initial) {
        var toolbar = this.pagingToolbar;
            
        this.callParent(arguments);
        if (toolbar) {
            toolbar.bindStore(this.store, initial);
        }
    },

    getTargetEl: function() {
        return this.listEl || this.el;
    },

    getInnerTpl: function(displayField) {
        return '{' + displayField + '}';
    },

    onDestroy: function() {
        Ext.destroyMembers(this, 'pagingToolbar', 'listEl');
        this.callParent();
    }
});
