/**
 * @class Ext.layout.container.Accordion
 *
 * This is a layout that manages multiple Panels in an expandable accordion style such that only
 * **one Panel can be expanded at any given time**. Each Panel has built-in support for expanding and collapsing.
 *
 * Note: Only Ext Panels and all subclasses of Ext.panel.Panel may be used in an accordion layout Container.
 *
 *     @example
 *     Ext.create('Ext.panel.Panel', {
 *         title: 'Accordion Layout',
 *         width: 300,
 *         height: 300,
 *         layout:'accordion',
 *         defaults: {
 *             // applied to each contained panel
 *             bodyStyle: 'padding:15px'
 *         },
 *         layoutConfig: {
 *             // layout-specific configs go here
 *             titleCollapse: false,
 *             animate: true,
 *             activeOnTop: true
 *         },
 *         items: [{
 *             title: 'Panel 1',
 *             html: 'Panel content!'
 *         },{
 *             title: 'Panel 2',
 *             html: 'Panel content!'
 *         },{
 *             title: 'Panel 3',
 *             html: 'Panel content!'
 *         }],
 *         renderTo: Ext.getBody()
 *     });
 */
Ext.define('Ext.layout.container.Accordion', {
    extend: 'Ext.layout.container.VBox',
    alias: ['layout.accordion'],
    alternateClassName: 'Ext.layout.AccordionLayout',

    itemCls: Ext.baseCSSPrefix + 'box-item ' + Ext.baseCSSPrefix + 'accordion-item',

    align: 'stretch',

    /**
     * @cfg {Boolean} fill
     * True to adjust the active item's height to fill the available space in the container, false to use the
     * item's current height, or auto height if not explicitly set.
     */
    fill : true,

    /**
     * @cfg {Boolean} autoWidth
     * Child Panels have their width actively managed to fit within the accordion's width.
     * @deprecated This config is ignored in ExtJS 4
     */
    autoWidth : true,

    /**
     * @cfg {Boolean} titleCollapse
     * True to allow expand/collapse of each contained panel by clicking anywhere on the title bar, false to allow
     * expand/collapse only when the toggle tool button is clicked.  When set to false,
     * {@link #hideCollapseTool} should be false also.
     */
    titleCollapse : true,

    /**
     * @cfg {Boolean} hideCollapseTool
     * True to hide the contained Panels' collapse/expand toggle buttons, false to display them.
     * When set to true, {@link #titleCollapse} is automatically set to <code>true</code>.
     */
    hideCollapseTool : false,

    /**
     * @cfg {Boolean} collapseFirst
     * True to make sure the collapse/expand toggle button always renders first (to the left of) any other tools
     * in the contained Panels' title bars, false to render it last.
     */
    collapseFirst : false,

    /**
     * @cfg {Boolean} animate
     * True to slide the contained panels open and closed during expand/collapse using animation, false to open and
     * close directly with no animation. Note: The layout performs animated collapsing
     * and expanding, <i>not</i> the child Panels.
     */
    animate : true,
    /**
     * @cfg {Boolean} activeOnTop
     * Only valid when {@link #multi} is `false` and {@link #animate} is `false`.
     *
     * True to swap the position of each panel as it is expanded so that it becomes the first item in the container,
     * false to keep the panels in the rendered order.
     */
    activeOnTop : false,
    /**
     * @cfg {Boolean} multi
     * Set to <code>true</code> to enable multiple accordion items to be open at once.
     */
    multi: false,
    
    animatePolicy: {
        y: true,
        height: true
    },

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        // animate flag must be false during initial render phase so we don't get animations.
        me.initialAnimate = me.animate;
        me.animate = false;

        // Child Panels are not absolutely positioned if we are not filling, so use a different itemCls.
        if (me.fill === false) {
            me.itemCls = Ext.baseCSSPrefix + 'accordion-item';
        }
    },

    // Cannot lay out a fitting accordion before we have been allocated a height.
    // So during render phase, layout will not be performed.
    beforeLayout: function() {
        var me = this;

        me.callParent(arguments);
        if (me.fill) {
            if (!(me.owner.el.dom.style.height || me.getLayoutTargetSize().height)) {
                return false;
            }
        } else {
            me.owner.componentLayout.monitorChildren = false;
            me.autoSize = true;
            me.owner.setAutoScroll(true);
        }
    },

    beforeRenderItems: function (items) {
        var me = this,
            ln = items.length,
            i = 0,
            comp;

        for (; i < ln; i++) {
            comp = items[i];
            if (!comp.rendered) {
                // Add class to the Panel's header before render
                comp.on({
                    beforerender: me.onChildPanelRender,
                    single: true
                });

                // Set up initial properties for Panels in an accordion.
                if (me.collapseFirst) {
                    comp.collapseFirst = me.collapseFirst;
                }
                if (me.hideCollapseTool) {
                    comp.hideCollapseTool = me.hideCollapseTool;
                    comp.titleCollapse = true;
                }
                else if (me.titleCollapse) {
                    comp.titleCollapse = me.titleCollapse;
                }

                delete comp.hideHeader;
                delete comp.width;
                comp.collapsible = true;
                comp.title = comp.title || '&#160;';
                comp.addBodyCls(Ext.baseCSSPrefix + 'accordion-body');

                // Set initial sizes
                if (me.fill) {
                    // If there is an expanded item, all others must be rendered collapsed.
                    if (me.expandedItem !== undefined) {
                        comp.collapsed = true;
                    }
                    // Otherwise expand the first item with collapsed explicitly configured as false
                    else if (comp.hasOwnProperty('collapsed') && comp.collapsed === false) {
                        me.expandedItem = i;
                    } else {
                        comp.collapsed = true;
                    }
                    // If we are fitting, then intercept expand/collapse requests.
                    me.owner.mon(comp, {
                        show: me.onComponentShow,
                        beforeexpand: me.onComponentExpand,
                        beforecollapse: me.onComponentCollapse,
                        scope: me
                    });
                } else {
                    comp.animCollapse = me.initialAnimate;
                    comp.autoScroll = false;
                }
                comp.border = comp.collapsed;
            }
        }

        // If no collapsed:false Panels found, make the first one expanded.
        if (ln && me.expandedItem === undefined) {
            me.expandedItem = 0;
            comp = items[0];
            comp.collapsed = comp.border = false;
        }
    },

    getItemsRenderTree: function(items) {
        this.beforeRenderItems(items);

        return this.callParent(arguments);
    },

    renderItems : function(items, target) {
        this.beforeRenderItems(items);

        this.callParent(arguments);
    },

    configureItem: function(item) {
        this.callParent(arguments);
        if (this.fill) {
            item.flex = 1;
        }
    },

    onChildPanelRender: function(panel) {
        panel.header.addCls(Ext.baseCSSPrefix + 'accordion-hd');
    },

    beginLayout: function (ownerContext) {
        this.callParent(arguments);
        this.updatePanelClasses(ownerContext);
    },

    calculate: function(ownerContext) {
        var me = this,
            itemContext;

        if (me.fill) {
            me.callParent(arguments);
        } else {
            var targetSize = me.getContainerSize(ownerContext),
                items = ownerContext.childItems,
                len = items.length,
                i;

            for (i = 0; i < len; i++) {
                itemContext = items[i];
                if (itemContext.target.collapsed) {
                    itemContext.setWidth(targetSize.width);
                } else {
                    itemContext.setSize(null, null);
                }
            }
        }

        return me;
    },

    updatePanelClasses: function(ownerContext) {
        var children = ownerContext.visibleItems,
            ln = children.length,
            siblingCollapsed = true,
            layoutContext = ownerContext.context,
            i, child, headerContext;

        for (i = 0; i < ln; i++) {
            child = children[i];
            headerContext = layoutContext.getCmp(child.header);

            if (siblingCollapsed) {
                headerContext.removeCls(Ext.baseCSSPrefix + 'accordion-hd-sibling-expanded');
            } else {
                headerContext.addCls(Ext.baseCSSPrefix + 'accordion-hd-sibling-expanded');
            }

            if (i + 1 == ln && child.collapsed) {
                headerContext.addCls(Ext.baseCSSPrefix + 'accordion-hd-last-collapsed');
            } else {
                headerContext.removeCls(Ext.baseCSSPrefix + 'accordion-hd-last-collapsed');
            }

            siblingCollapsed = child.collapsed;
        }
    },

    // When a Component expands, adjust the heights of the other Components to be just enough to accommodate
    // their headers.
    // The expanded Component receives the only flex value, and so gets all remaining space.
    onComponentExpand: function(toExpand) {
        var me = this,
            owner = me.owner,
            expanded,
            expandedCount, i,
            previousValue;

        if (!me.processing) {
            me.processing = true;
            previousValue = owner.deferLayout;
            owner.deferLayout = true;
            expanded = me.multi ? [] : owner.query('>panel:not([collapsed])');
            expandedCount = expanded.length;
            
            // Collapse all other expanded child items (Won't loop if multi is true)
            for (i = 0; i < expandedCount; i++) {
                expanded[i].collapse();
            }
            owner.deferLayout = previousValue;
            me.processing = false;
        }
    },

    onComponentCollapse: function(comp) {
        var me = this,
            owner = me.owner,
            toExpand,
            expanded,
            previousValue;

        if (!me.processing) {
            me.processing = true;
            previousValue = owner.deferLayout;
            owner.deferLayout = true;
            toExpand = comp.next() || comp.prev();

            // If we are allowing multi, and the "toCollapse" component is NOT the only expanded Component,
            // then ask the box layout to collapse it to its header.
            if (me.multi) {
                expanded = me.owner.query('>panel:not([collapsed])');

                // If the collapsing Panel is the only expanded one, expand the following Component.
                // All this is handling fill: true, so there must be at least one expanded,
                if (expanded.length === 1) {
                    toExpand.expand();
                }

            } else {
                toExpand.expand();
            }
            owner.deferLayout = previousValue;
            me.processing = false;
        }
    },

    onComponentShow: function(comp) {
        // Showing a Component means that you want to see it, so expand it.
        this.onComponentExpand(comp);
    }
});
