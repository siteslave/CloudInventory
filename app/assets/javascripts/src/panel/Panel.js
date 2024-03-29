/**
 * Panel is a container that has specific functionality and structural components that make it the perfect building
 * block for application-oriented user interfaces.
 *
 * Panels are, by virtue of their inheritance from {@link Ext.container.Container}, capable of being configured with a
 * {@link Ext.container.Container#layout layout}, and containing child Components.
 *
 * When either specifying child {@link #items} of a Panel, or dynamically {@link Ext.container.Container#add adding}
 * Components to a Panel, remember to consider how you wish the Panel to arrange those child elements, and whether those
 * child elements need to be sized using one of Ext's built-in `{@link Ext.container.Container#layout layout}`
 * schemes. By default, Panels use the {@link Ext.layout.container.Auto Auto} scheme. This simply renders child
 * components, appending them one after the other inside the Container, and **does not apply any sizing** at all.
 *
 * {@img Ext.panel.Panel/panel.png Panel components}
 *
 * A Panel may also contain {@link #bbar bottom} and {@link #tbar top} toolbars, along with separate {@link
 * Ext.panel.Header header}, {@link #fbar footer} and body sections.
 *
 * Panel also provides built-in {@link #collapsible collapsible, expandable} and {@link #closable} behavior. Panels can
 * be easily dropped into any {@link Ext.container.Container Container} or layout, and the layout and rendering pipeline
 * is {@link Ext.container.Container#add completely managed by the framework}.
 *
 * **Note:** By default, the `{@link #closable close}` header tool _destroys_ the Panel resulting in removal of the
 * Panel and the destruction of any descendant Components. This makes the Panel object, and all its descendants
 * **unusable**. To enable the close tool to simply _hide_ a Panel for later re-use, configure the Panel with
 * `{@link #closeAction closeAction}: 'hide'`.
 *
 * Usually, Panels are used as constituents within an application, in which case, they would be used as child items of
 * Containers, and would themselves use Ext.Components as child {@link #items}. However to illustrate simply rendering a
 * Panel into the document, here's how to do it:
 *
 *     @example
 *     Ext.create('Ext.panel.Panel', {
 *         title: 'Hello',
 *         width: 200,
 *         html: '<p>World!</p>',
 *         renderTo: Ext.getBody()
 *     });
 *
 * A more realistic scenario is a Panel created to house input fields which will not be rendered, but used as a
 * constituent part of a Container:
 *
 *     @example
 *     var filterPanel = Ext.create('Ext.panel.Panel', {
 *         bodyPadding: 5,  // Don't want content to crunch against the borders
 *         width: 300,
 *         title: 'Filters',
 *         items: [{
 *             xtype: 'datefield',
 *             fieldLabel: 'Start date'
 *         }, {
 *             xtype: 'datefield',
 *             fieldLabel: 'End date'
 *         }],
 *         renderTo: Ext.getBody()
 *     });
 *
 * Note that the Panel above is configured to render into the document and assigned a size. In a real world scenario,
 * the Panel will often be added inside a Container which will use a {@link #layout} to render, size and position its
 * child Components.
 *
 * Panels will often use specific {@link #layout}s to provide an application with shape and structure by containing and
 * arranging child Components:
 *
 *     @example
 *     var resultsPanel = Ext.create('Ext.panel.Panel', {
 *         title: 'Results',
 *         width: 600,
 *         height: 400,
 *         renderTo: Ext.getBody(),
 *         layout: {
 *             type: 'vbox',       // Arrange child items vertically
 *             align: 'stretch',    // Each takes up full width
 *             padding: 5
 *         },
 *         items: [{               // Results grid specified as a config object with an xtype of 'grid'
 *             xtype: 'grid',
 *             columns: [{header: 'Column One'}],            // One header just for show. There's no data,
 *             store: Ext.create('Ext.data.ArrayStore', {}), // A dummy empty data store
 *             flex: 1                                       // Use 1/3 of Container's height (hint to Box layout)
 *         }, {
 *             xtype: 'splitter'   // A splitter between the two child items
 *         }, {                    // Details Panel specified as a config object (no xtype defaults to 'panel').
 *             title: 'Details',
 *             bodyPadding: 5,
 *             items: [{
 *                 fieldLabel: 'Data item',
 *                 xtype: 'textfield'
 *             }], // An array of form fields
 *             flex: 2             // Use 2/3 of Container's height (hint to Box layout)
 *         }]
 *     });
 *
 * The example illustrates one possible method of displaying search results. The Panel contains a grid with the
 * resulting data arranged in rows. Each selected row may be displayed in detail in the Panel below. The {@link
 * Ext.layout.container.VBox vbox} layout is used to arrange the two vertically. It is configured to stretch child items
 * horizontally to full width. Child items may either be configured with a numeric height, or with a `flex` value to
 * distribute available space proportionately.
 *
 * This Panel itself may be a child item of, for exaple, a {@link Ext.tab.Panel} which will size its child items to fit
 * within its content area.
 *
 * Using these techniques, as long as the **layout** is chosen and configured correctly, an application may have any
 * level of nested containment, all dynamically sized according to configuration, the user's preference and available
 * browser size.
 */
Ext.define('Ext.panel.Panel', {
    extend: 'Ext.panel.AbstractPanel',
    requires: [
        'Ext.panel.Header',
        'Ext.fx.Anim',
        'Ext.util.KeyMap',
        'Ext.panel.DD',
        'Ext.XTemplate',
        'Ext.layout.component.Dock',
        'Ext.util.Memento'
    ],
    alias: 'widget.panel',
    alternateClassName: 'Ext.Panel',

    /**
     * @cfg {String} collapsedCls
     * A CSS class to add to the panel's element after it has been collapsed.
     */
    collapsedCls: 'collapsed',

    /**
     * @cfg {Boolean} animCollapse
     * `true` to animate the transition when the panel is collapsed, `false` to skip the animation (defaults to `true`
     * if the {@link Ext.fx.Anim} class is available, otherwise `false`). May also be specified as the animation
     * duration in milliseconds.
     */
    animCollapse: Ext.enableFx,

    /**
     * @cfg {Number} minButtonWidth
     * Minimum width of all footer toolbar buttons in pixels. If set, this will be used as the default
     * value for the {@link Ext.button.Button#minWidth} config of each Button added to the **footer toolbar** via the
     * {@link #fbar} or {@link #buttons} configurations. It will be ignored for buttons that have a minWidth configured
     * some other way, e.g. in their own config object or via the {@link Ext.container.Container#defaults defaults} of
     * their parent container.
     */
    minButtonWidth: 75,

    /**
     * @cfg {Boolean} collapsed
     * `true` to render the panel collapsed, `false` to render it expanded.
     */
    collapsed: false,

    /**
     * @cfg {Boolean} collapseFirst
     * `true` to make sure the collapse/expand toggle button always renders first (to the left of) any other tools in
     * the panel's title bar, `false` to render it last.
     */
    collapseFirst: true,

    /**
     * @cfg {Boolean} hideCollapseTool
     * `true` to hide the expand/collapse toggle button when `{@link #collapsible} == true`, `false` to display it.
     */
    hideCollapseTool: false,

    /**
     * @cfg {Boolean} titleCollapse
     * `true` to allow expanding and collapsing the panel (when `{@link #collapsible} = true`) by clicking anywhere in
     * the header bar, `false`) to allow it only by clicking to tool butto).
     */
    titleCollapse: false,

    /**
     * @cfg {String} collapseMode
     * **Important: this config is only effective for {@link #collapsible} Panels which are direct child items of a
     * {@link Ext.layout.container.Border border layout}.**
     *
     * When _not_ a direct child item of a {@link Ext.layout.container.Border border layout}, then the Panel's header
     * remains visible, and the body is collapsed to zero dimensions. If the Panel has no header, then a new header
     * (orientated correctly depending on the {@link #collapseDirection}) will be inserted to show a the title and a re-
     * expand tool.
     *
     * When a child item of a {@link Ext.layout.container.Border border layout}, this config has two options:
     *
     * - **`undefined/omitted`**
     *
     *   When collapsed, a placeholder {@link Ext.panel.Header Header} is injected into the layout to represent the Panel
     *   and to provide a UI with a Tool to allow the user to re-expand the Panel.
     *
     * - **`header`** :
     *
     *   The Panel collapses to leave its header visible as when not inside a {@link Ext.layout.container.Border border
     *   layout}.
     */

    /**
     * @cfg {Ext.Component/Object} placeholder
     * **Important: This config is only effective for {@link #collapsible} Panels which are direct child items of a
     * {@link Ext.layout.container.Border border layout} when not using the `'header'` {@link #collapseMode}.**
     *
     * **Optional.** A Component (or config object for a Component) to show in place of this Panel when this Panel is
     * collapsed by a {@link Ext.layout.container.Border border layout}. Defaults to a generated {@link Ext.panel.Header
     * Header} containing a {@link Ext.panel.Tool Tool} to re-expand the Panel.
     */

    /**
     * @cfg {Boolean} floatable
     * **Important: This config is only effective for {@link #collapsible} Panels which are direct child items of a
     * {@link Ext.layout.container.Border border layout}.**
     *
     * true to allow clicking a collapsed Panel's {@link #placeholder} to display the Panel floated above the layout,
     * false to force the user to fully expand a collapsed region by clicking the expand button to see it again.
     */
    floatable: true,

    /**
     * @cfg {Boolean} overlapHeader
     * True to overlap the header in a panel over the framing of the panel itself. This is needed when frame:true (and
     * is done automatically for you). Otherwise it is undefined. If you manually add rounded corners to a panel header
     * which does not have frame:true, this will need to be set to true.
     */

    /**
     * @cfg {Boolean} collapsible
     * True to make the panel collapsible and have an expand/collapse toggle Tool added into the header tool button
     * area. False to keep the panel sized either statically, or by an owning layout manager, with no toggle Tool.
     *
     * See {@link #collapseMode} and {@link #collapseDirection}
     */
    collapsible: false,

    /**
     * @cfg {Boolean} collapseDirection
     * The direction to collapse the Panel when the toggle button is clicked.
     *
     * Defaults to the {@link #headerPosition}
     *
     * **Important: This config is _ignored_ for {@link #collapsible} Panels which are direct child items of a {@link
     * Ext.layout.container.Border border layout}.**
     *
     * Specify as `'top'`, `'bottom'`, `'left'` or `'right'`.
     */

    /**
     * @cfg {Boolean} closable
     * True to display the 'close' tool button and allow the user to close the window, false to hide the button and
     * disallow closing the window.
     *
     * By default, when close is requested by clicking the close button in the header, the {@link #close} method will be
     * called. This will _{@link Ext.Component#destroy destroy}_ the Panel and its content meaning that it may not be
     * reused.
     *
     * To make closing a Panel _hide_ the Panel so that it may be reused, set {@link #closeAction} to 'hide'.
     */
    closable: false,

    /**
     * @cfg {String} closeAction
     * The action to take when the close header tool is clicked:
     *
     * - **`'{@link #destroy}'`** :
     *
     *   {@link #destroy remove} the window from the DOM and {@link Ext.Component#destroy destroy} it and all descendant
     *   Components. The window will **not** be available to be redisplayed via the {@link #show} method.
     *
     * - **`'{@link #hide}'`** :
     *
     *   {@link #hide} the window by setting visibility to hidden and applying negative offsets. The window will be
     *   available to be redisplayed via the {@link #show} method.
     *
     * **Note:** This behavior has changed! setting *does* affect the {@link #close} method which will invoke the
     * approriate closeAction.
     */
    closeAction: 'destroy',

    /**
     * @cfg {Object/Object[]} dockedItems
     * A component or series of components to be added as docked items to this panel. The docked items can be docked to
     * either the top, right, left or bottom of a panel. This is typically used for things like toolbars or tab bars:
     *
     *     var panel = new Ext.panel.Panel({
     *         dockedItems: [{
     *             xtype: 'toolbar',
     *             dock: 'top',
     *             items: [{
     *                 text: 'Docked to the top'
     *             }]
     *         }]
     *     });
     */

    /**
      * @cfg {Boolean} preventHeader
      * Prevent a Header from being created and shown.
      */
    preventHeader: false,

     /**
      * @cfg {String} headerPosition
      * Specify as `'top'`, `'bottom'`, `'left'` or `'right'`.
      */
    headerPosition: 'top',

     /**
     * @cfg {Boolean} frame
     * True to apply a frame to the panel.
     */
    frame: false,

    /**
     * @cfg {Boolean} frameHeader
     * True to apply a frame to the panel panels header (if 'frame' is true).
     */
    frameHeader: true,

    /**
     * @cfg {Object[]/Ext.panel.Tool[]} tools
     * An array of {@link Ext.panel.Tool} configs/instances to be added to the header tool area. The tools are stored as
     * child components of the header container. They can be accessed using {@link #down} and {#query}, as well as the
     * other component methods. The toggle tool is automatically created if {@link #collapsible} is set to true.
     *
     * Note that, apart from the toggle tool which is provided when a panel is collapsible, these tools only provide the
     * visual button. Any required functionality must be provided by adding handlers that implement the necessary
     * behavior.
     *
     * Example usage:
     *
     *     tools:[{
     *         type:'refresh',
     *         tooltip: 'Refresh form Data',
     *         // hidden:true,
     *         handler: function(event, toolEl, panel){
     *             // refresh logic
     *         }
     *     },
     *     {
     *         type:'help',
     *         tooltip: 'Get Help',
     *         handler: function(event, toolEl, panel){
     *             // show help here
     *         }
     *     }]
     */

    /**
     * @cfg {String} [title='']
     * The title text to be used to display in the {@link Ext.panel.Header panel header}. When a
     * `title` is specified the {@link Ext.panel.Header} will automatically be created and displayed unless
     * {@link #preventHeader} is set to `true`.
     */

    /**
     * @cfg {String} iconCls
     * CSS class for icon in header. Used for displaying an icon to the left of a title.
     */

    initComponent: function() {
        var me = this,
            cls;

        me.addEvents(

            /**
             * @event beforeclose
             * Fires before the user closes the panel. Return false from any listener to stop the close event being
             * fired
             * @param {Ext.panel.Panel} panel The Panel object
             */
            'beforeclose',
            
            /**
             * @event close
             * Fires when the user closes the panel.
             * @param {Ext.panel.Panel} panel The Panel object
             */
            'close',

            /**
             * @event beforeexpand
             * Fires before this panel is expanded. Return false to prevent the expand.
             * @param {Ext.panel.Panel} p The Panel being expanded.
             * @param {Boolean} animate True if the expand is animated, else false.
             */
            "beforeexpand",

            /**
             * @event beforecollapse
             * Fires before this panel is collapsed. Return false to prevent the collapse.
             * @param {Ext.panel.Panel} p The Panel being collapsed.
             * @param {String} direction . The direction of the collapse. One of
             *
             *   - Ext.Component.DIRECTION_TOP
             *   - Ext.Component.DIRECTION_RIGHT
             *   - Ext.Component.DIRECTION_BOTTOM
             *   - Ext.Component.DIRECTION_LEFT
             *
             * @param {Boolean} animate True if the collapse is animated, else false.
             */
            "beforecollapse",

            /**
             * @event expand
             * Fires after this Panel has expanded.
             * @param {Ext.panel.Panel} p The Panel that has been expanded.
             */
            "expand",

            /**
             * @event collapse
             * Fires after this Panel hass collapsed.
             * @param {Ext.panel.Panel} p The Panel that has been collapsed.
             */
            "collapse",

            /**
             * @event titlechange
             * Fires after the Panel title has been set or changed.
             * @param {Ext.panel.Panel} p the Panel which has been resized.
             * @param {String} newTitle The new title.
             * @param {String} oldTitle The previous panel title.
             */
            'titlechange',

            /**
             * @event iconchange
             * Fires after the Panel iconCls has been set or changed.
             * @param {Ext.panel.Panel} p the Panel which has been resized.
             * @param {String} newIconCls The new iconCls.
             * @param {String} oldIconCls The previous panel iconCls.
             */
            'iconchange'
        );

        if (me.collapsible) {
        // Save state on these two events.
            this.addStateEvents(['expand', 'collapse']);
        }
        if (me.unstyled) {
            me.setUI('plain');
        }

        if (me.frame) {
            me.setUI(me.ui + '-framed');
        }

        // Backwards compatibility
        me.bridgeToolbars();

        me.callParent();
        me.collapseDirection = me.collapseDirection || me.headerPosition || Ext.Component.DIRECTION_TOP;
    },

    setBorder: function(border) {
        // var me     = this,
        //     method = (border === false || border === 0) ? 'addClsWithUI' : 'removeClsWithUI';
        //
        // me.callParent(arguments);
        //
        // if (me.collapsed) {
        //     me[method](me.collapsedCls + '-noborder');
        // }
        //
        // if (me.header) {
        //     me.header.setBorder(border);
        //     if (me.collapsed) {
        //         me.header[method](me.collapsedCls + '-noborder');
        //     }
        // }

        this.callParent(arguments);
    },

    beforeDestroy: function() {
        Ext.destroy(
            this.ghostPanel,
            this.dd
        );
        this.callParent();
    },

    initAria: function() {
        this.callParent();
        this.initHeaderAria();
    },

    initHeaderAria: function() {
        var me = this,
            el = me.el,
            header = me.header;
        if (el && header) {
            el.dom.setAttribute('aria-labelledby', header.titleCmp.id);
        }
    },

    getHeader: function() {
        return this.header;
    },

    /**
     * Set a title for the panel's header. See {@link Ext.panel.Header#title}.
     * @param {String} newTitle
     */
    setTitle: function(newTitle) {
        var me = this,
        oldTitle = this.title;

        me.title = newTitle;
        if (me.header) {
            me.header.setTitle(newTitle);
        } else {
            me.updateHeader();
        }

        if (me.reExpander) {
            me.reExpander.setTitle(newTitle);
        }
        me.fireEvent('titlechange', me, newTitle, oldTitle);
    },

    /**
     * Set the iconCls for the panel's header. See {@link Ext.panel.Header#iconCls}. It will fire the
     * {@link #iconchange} event after completion.
     * @param {String} newIconCls The new CSS class name
     */
    setIconCls: function(newIconCls) {
        var me = this,
            oldIconCls = me.iconCls;

        me.iconCls = newIconCls;
        var header = me.header;
        if (header) {
            header.setIconCls(newIconCls);
        }
        me.fireEvent('iconchange', me, newIconCls, oldIconCls);
    },

    bridgeToolbars: function() {
        var me = this,
            docked = [],
            fbar,
            fbarDefaults,
            minButtonWidth = me.minButtonWidth;

        function initToolbar (toolbar, pos, useButtonAlign) {
            if (Ext.isArray(toolbar)) {
                toolbar = {
                    xtype: 'toolbar',
                    items: toolbar
                };
            }
            else if (!toolbar.xtype) {
                toolbar.xtype = 'toolbar';
            }
            toolbar.dock = pos;
            if (pos == 'left' || pos == 'right') {
                toolbar.vertical = true;
            }

            // Legacy support for buttonAlign (only used by buttons/fbar)
            if (useButtonAlign) {
                toolbar.layout = Ext.applyIf(toolbar.layout || {}, {
                    // default to 'end' (right-aligned) if me.buttonAlign is undefined or invalid
                    pack: { left:'start', center:'center' }[me.buttonAlign] || 'end'
                });
            }
            return toolbar;
        }

        // Short-hand toolbars (tbar, bbar and fbar plus new lbar and rbar):

        /**
         * @cfg {String} buttonAlign
         * The alignment of any buttons added to this panel. Valid values are 'right', 'left' and 'center' (defaults to
         * 'right' for buttons/fbar, 'left' for other toolbar types).
         *
         * **NOTE:** The prefered way to specify toolbars is to use the dockedItems config. Instead of buttonAlign you
         * would add the layout: { pack: 'start' | 'center' | 'end' } option to the dockedItem config.
         */

        /**
         * @cfg {Object/Object[]} tbar
         * Convenience config. Short for 'Top Bar'.
         *
         *     tbar: [
         *       { xtype: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'top',
         *         items: [
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         */
        if (me.tbar) {
            docked.push(initToolbar(me.tbar, 'top'));
            me.tbar = null;
        }

        /**
         * @cfg {Object/Object[]} bbar
         * Convenience config. Short for 'Bottom Bar'.
         *
         *     bbar: [
         *       { xtype: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'bottom',
         *         items: [
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         */
        if (me.bbar) {
            docked.push(initToolbar(me.bbar, 'bottom'));
            me.bbar = null;
        }

        /**
         * @cfg {Object/Object[]} buttons
         * Convenience config used for adding buttons docked to the bottom of the panel. This is a
         * synonym for the {@link #fbar} config.
         *
         *     buttons: [
         *       { text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'bottom',
         *         ui: 'footer',
         *         defaults: {minWidth: {@link #minButtonWidth}},
         *         items: [
         *             { xtype: 'component', flex: 1 },
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         *
         * The {@link #minButtonWidth} is used as the default {@link Ext.button.Button#minWidth minWidth} for
         * each of the buttons in the buttons toolbar.
         */
        if (me.buttons) {
            me.fbar = me.buttons;
            me.buttons = null;
        }

        /**
         * @cfg {Object/Object[]} fbar
         * Convenience config used for adding items to the bottom of the panel. Short for Footer Bar.
         *
         *     fbar: [
         *       { type: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'bottom',
         *         ui: 'footer',
         *         defaults: {minWidth: {@link #minButtonWidth}},
         *         items: [
         *             { xtype: 'component', flex: 1 },
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         *
         * The {@link #minButtonWidth} is used as the default {@link Ext.button.Button#minWidth minWidth} for
         * each of the buttons in the fbar.
         */
        if (me.fbar) {
            fbar = initToolbar(me.fbar, 'bottom', true); // only we useButtonAlign
            fbar.ui = 'footer';

            // Apply the minButtonWidth config to buttons in the toolbar
            if (minButtonWidth) {
                fbarDefaults = fbar.defaults;
                fbar.defaults = function(config) {
                    var defaults = fbarDefaults || {};
                    if ((!config.xtype || config.xtype === 'button' || (config.isComponent && config.isXType('button'))) &&
                            !('minWidth' in defaults)) {
                        defaults = Ext.apply({minWidth: minButtonWidth}, defaults);
                    }
                    return defaults;
                };
            }

            docked.push(fbar);
            me.fbar = null;
        }

        /**
         * @cfg {Object/Object[]} lbar
         * Convenience config. Short for 'Left Bar' (left-docked, vertical toolbar).
         *
         *     lbar: [
         *       { xtype: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'left',
         *         items: [
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         */
        if (me.lbar) {
            docked.push(initToolbar(me.lbar, 'left'));
            me.lbar = null;
        }

        /**
         * @cfg {Object/Object[]} rbar
         * Convenience config. Short for 'Right Bar' (right-docked, vertical toolbar).
         *
         *     rbar: [
         *       { xtype: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'right',
         *         items: [
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         */
        if (me.rbar) {
            docked.push(initToolbar(me.rbar, 'right'));
            me.rbar = null;
        }

        if (me.dockedItems) {
            if (!Ext.isArray(me.dockedItems)) {
                me.dockedItems = [me.dockedItems];
            }
            me.dockedItems = me.dockedItems.concat(docked);
        } else {
            me.dockedItems = docked;
        }
    },

    beforeRender: function() {
        var me = this;

        me.callParent();

        // If we are rendering collapsed, we still need to save and modify various configs
        if (me.collapsed) {
            me.beginCollapse();
            me.addClsWithUI(me.collapsedCls);
        }

        // Add class-specific header tools.
        // Panel adds collapsible and closable.
        me.initTools();

        // Dock the header/title
        me.updateHeader();
    },

    /**
     * @private
     * Tools are a Panel-specific capabilty.
     * Panel uses initTools. Subclasses may contribute tools by implementing addTools.
     */
    initTools: function() {
        var me = this;

        me.tools = me.tools ? Ext.Array.clone(me.tools) : [];

        // Add a collapse tool unless configured to not show a collapse tool
        // or to not even show a header.
        if (me.collapsible && !(me.hideCollapseTool || me.header === false)) {
            me.collapseDirection = me.collapseDirection || me.headerPosition || 'top';
            me.collapseTool = me.expandTool = Ext.widget({
                xtype: 'tool',
                type: me.collapsed ? ('expand-' + me.getOppositeDirection(me.collapseDirection)) : ('collapse-' + me.collapseDirection),
                handler: me.toggleCollapse,
                scope: me
            });

            // Prepend collapse tool is configured to do so.
            if (me.collapseFirst) {
                me.tools.unshift(me.collapseTool);
            }
        }

        // Add subclass-specific tools.
        me.addTools();

        // Make Panel closable.
        if (me.closable) {
            me.addClsWithUI('closable');
            me.addTool({
                type: 'close',
                handler: Ext.Function.bind(me.close, me, [])
            });
        }

        // Append collapse tool if needed.
        if (me.collapseTool && !me.collapseFirst) {
            me.tools.push(me.collapseTool);
        }
    },

    /**
     * @private
     * @template
     * Template method to be implemented in subclasses to add their tools after the collapsible tool.
     */
    addTools: Ext.emptyFn,

    /**
     * Closes the Panel. By default, this method, removes it from the DOM, {@link Ext.Component#destroy destroy}s the
     * Panel object and all its descendant Components. The {@link #beforeclose beforeclose} event is fired before the
     * close happens and will cancel the close action if it returns false.
     *
     * **Note:** This method is also affected by the {@link #closeAction} setting. For more explicit control use
     * {@link #destroy} and {@link #hide} methods.
     */
    close: function() {
        if (this.fireEvent('beforeclose', this) !== false) {
            this.doClose();
        }
    },

    // private
    doClose: function() {
        this.fireEvent('close', this);
        this[this.closeAction]();
    },

    /**
     * Create, hide, or show the header component as appropriate based on the current config.
     * @private
     * @param {Boolean} force True to force the header to be created
     */
    updateHeader: function(force) {
        var me = this,
            header = me.header,
            title = me.title,
            tools = me.tools;

        if (!me.preventHeader && (force || title || (tools && tools.length))) {
            if (header) {
                header.show();
            } else {
                header = me.header = new Ext.panel.Header({
                    title       : title,
                    orientation : (me.headerPosition == 'left' || me.headerPosition == 'right') ? 'vertical' : 'horizontal',
                    dock        : me.headerPosition || 'top',
                    textCls     : me.headerTextCls,
                    iconCls     : me.iconCls,
                    baseCls     : me.baseCls + '-header',
                    tools       : tools,
                    ui          : me.ui,
                    id          : me.id + '_header',
                    indicateDrag: me.draggable,
                    border      : me.border,
                    frame       : me.frame && me.frameHeader,
                    ignoreParentFrame : me.frame || me.overlapHeader,
                    ignoreBorderManagement: me.frame || me.ignoreHeaderBorderManagement,
                    listeners   : me.collapsible && me.titleCollapse ? {
                        click: me.toggleCollapse,
                        scope: me
                    } : null
                });
                me.addDocked(header, 0);

                // Reference the Header's tool array.
                // Header injects named references.
                me.tools = header.tools;
            }
            me.initHeaderAria();
        } else if (header) {
            header.hide();
        }
    },

    // inherit docs
    setUI: function(ui) {
        var me = this;

        me.callParent(arguments);

        if (me.header) {
            me.header.setUI(ui);
        }
    },

    // private
    getContentTarget: function() {
        return this.body;
    },

    getTargetEl: function() {
        return this.body || this.frameBody || this.el;
    },

    // the overrides below allow for collapsed regions inside the border layout to be hidden

    // inherit docs
    isVisible: function(deep){
        var me = this;
        if (me.collapsed && me.placeholder) {
            return me.placeholder.isVisible(deep);
        }
        return me.callParent(arguments);
    },

    // inherit docs
    onHide: function(){
        var me = this;
        if (me.collapsed && me.placeholder) {
            me.placeholder.hide();
        } else {
            me.callParent(arguments);
        }
    },

    // inherit docs
    onShow: function(){
        var me = this;
        if (me.collapsed && me.placeholder) {
            // force hidden back to true, since this gets set by the layout
            me.hidden = true;
            me.placeholder.show();
        } else {
            me.callParent(arguments);
        }
    },

    addTool: function(tool) {
        var me = this,
            header = me.header;

        if (Ext.isArray(tool)) {
            Ext.each(tool, me.addTool, me);
            return;
        }
        me.tools.push(tool);
        if (header) {
            header.addTool(tool);
        }
        me.updateHeader();
    },

    getOppositeDirection: function(d) {
        var c = Ext.Component;
        switch (d) {
            case c.DIRECTION_TOP:
                return c.DIRECTION_BOTTOM;
            case c.DIRECTION_RIGHT:
                return c.DIRECTION_LEFT;
            case c.DIRECTION_BOTTOM:
                return c.DIRECTION_TOP;
            case c.DIRECTION_LEFT:
                return c.DIRECTION_RIGHT;
        }
    },

    getWidthAuthority: function() {
        if (this.collapsed && this.collapsedHorizontal()) {
            return 1; // the panel determine's its own width
        }

        return this.callParent();
    },

    getHeightAuthority: function() {
        if (this.collapsed && this.collapsedVertical()) {
            return 1; // the panel determine's its own height
        }

        return this.callParent();
    },

    collapsedHorizontal: function () {
        var dir = this.getCollapsed();
        return dir == 'left' || dir == 'right';
    },

    collapsedVertical: function () {
        var dir = this.getCollapsed();
        return dir == 'top' || dir == 'bottom';
    },

    getCollapsed: function() {
        var me = this;
        // The collapsed flag, when the Panel is collapsed acts as the direction in which the collapse took
        // place. It can still be tested as truthy/falsy if only a truth value is required.
        if (me.collapsed === true) {
            return me.collapseDirection;
        }
        return me.collapsed;
    },

    getState: function() {
        var me = this,
            state = me.callParent(),
            memento;

        state = me.addPropertyToState(state, 'collapsed');

        // If a collapse has taken place, use remembered values as the dimensions.
        if (me.collapsed) {
            memento = me.collapseMemento;
            memento = memento && memento.data;

            if (me.collapsedVertical()) {
                if (state) {
                    delete state.height;
                }
                if (memento) {
                    state = me.addPropertyToState(state, 'height', memento.height);
                }
            } else {
                if (state) {
                    delete state.width;
                }
                if (memento) {
                    state = me.addPropertyToState(state, 'width', memento.width);
                }
            }
        }

        return state;
    },

    findReExpander: function (direction) {
        var me = this,
            c = Ext.Component,
            dockedItems = me.dockedItems.items,
            dockedItemCount = dockedItems.length,
            comp, i;

        switch (direction) {
            case c.DIRECTION_TOP:
            case c.DIRECTION_BOTTOM:

                // Attempt to find a reExpander Component (docked in a horizontal orientation)
                // Also, collect all other docked items which we must hide after collapse. 
                for (i = 0; i < dockedItemCount; i++) {
                    comp = dockedItems[i];
                    if (comp.isVisible()) {
                        if (comp.isHeader && (!comp.dock || comp.dock == 'top' || comp.dock == 'bottom')) {
                            return comp;
                        }
                    }
                }
                break;

            case c.DIRECTION_LEFT:
            case c.DIRECTION_RIGHT:

                // Attempt to find a reExpander Component (docked in a vecrtical orientation)
                // Also, collect all other docked items which we must hide after collapse. 
                for (i = 0; i < dockedItemCount; i++) {
                    comp = dockedItems[i];
                    if (comp.isVisible()) {
                        if (comp.isHeader && (comp.dock == 'left' || comp.dock == 'right')) {
                            return comp;
                        }
                    }
                }
                break;

            default:
                throw('Panel#findReExpander must be passed a valid collapseDirection');
        }
    },

    getReExpander: function (direction) {
        var me = this,
            collapsedCls = me.collapsedCls,
            collapseDir = direction || me.collapseDirection,
            reExpander = me.reExpander || me.findReExpander(collapseDir),
            add, classes;

        me.expandDirection = me.getOppositeDirection(collapseDir);

        // We did not find a Header of the required orientation: create one.
        if (!reExpander) {
            me.reExpander = reExpander = Ext.widget(me.createReExpander(collapseDir, {
                dock: collapseDir,
                cls: Ext.baseCSSPrefix + 'docked ' + me.baseCls + '-' + me.ui + '-collapsed',
                ownerCt: me,
                ownerLayout: me.componentLayout
            }));

            me.dockedItems.insert(0, reExpander);
        }

        // Add collapsed class to header if collapsing, remove if expanding

        classes = [ collapsedCls, collapsedCls + '-' + reExpander.dock];
        if (me.border && (!me.frame || (me.frame && Ext.supports.CSS3BorderRadius))) {
            classes.push(collapsedCls + '-border-' + reExpander.dock);
        }

        if (me.isCollapsingOrExpanding == 1) {
            add = true;
        } else if (me.isCollapsingOrExpanding != 2) {
            add = me.collapsed;
        }

        if (add) {
            reExpander.addClsWithUI(classes);
        } else {
            reExpander.removeClsWithUI(classes);
        }

        return reExpander;
    },

    createReExpander: function(direction, defaults) {
        var me = this,
            result = Ext.apply({
                xtype: 'header',
                hideMode: 'offsets',
                temporary: true,
                title: me.title,
                orientation: (direction == 'top' || direction == 'bottom') ? 'horizontal' : 'vertical',
                textCls: me.headerTextCls,
                iconCls: me.iconCls,
                baseCls: me.baseCls + '-header',
                ui: me.ui,
                frame: me.frame && me.frameHeader,
                ignoreParentFrame: me.frame || me.overlapHeader,
                indicateDrag: me.draggable,
                style: {
                    "z-index": 2 // Put it above any other docks which might still occupy the space this will be allocated as the sole visible dock.
                }
            }, defaults);

        if (!me.hideCollapseTool) {
            result[(result.orientation == 'horizontal') ? 'tools' : 'items'] = [{
                xtype: 'tool',
                type: 'expand-' + me.getOppositeDirection(direction),
                handler: me.toggleCollapse,
                scope: me
            }];
        }

        return result;
    },

    /**
     * @private
     * Called before the change from default, configured state into the collapsed state.
     * This method may be called at render time to enable rendering in an initially collapsed state,
     * or at runtime when an existing, fully layed out Panel may be collapsed.
     * It basically saves configs which need to be clobbered for the duration of the collapsed state.
     */
    beginCollapse: function() {
        var me = this;

        // When we collapse a panel, the panel is in control of one dimension (depending on
        // collapse direction) and sets that on the component. We must restore the user's
        // original value (including non-existance) when we expand. Using this technique, we
        // mimic setCalculatedSize for the dimension we do not control and setSize for the
        // one we do (only while collapsed).
        if (!me.collapseMemento) {
            me.collapseMemento = new Ext.util.Memento(me);
        }
        if (me.collapsedVertical()) {
            me.collapseMemento.capture(['height', 'minHeight']);
            delete me.height;
            me.minHeight = 0;
        } else {
            me.collapseMemento.capture(['width', 'minWidth']);
            delete me.width;
            me.minWidth = 0;
        }

        if (me.ownerCt) {
            me.ownerCt.getLayout().beginCollapse(me);
        }
        if (me.resizer) {
            me.resizer.disable();
        }
    },
    
    beginExpand: function() {
        var me = this;

        if (me.collapsedVertical()) {
            me.collapseMemento.restore(['height', 'minHeight']);
        } else {
            me.collapseMemento.restore(['width', 'minWidth']);
        }

        if (me.ownerCt) {
            me.ownerCt.getLayout().beginExpand(me);
        }
    },

    /**
     * Collapses the panel body so that the body becomes hidden. Docked Components parallel to the border towards which
     * the collapse takes place will remain visible. Fires the {@link #beforecollapse} event which will cancel the
     * collapse action if it returns false.
     *
     * @param {String} direction . The direction to collapse towards. Must be one of
     *
     *   - Ext.Component.DIRECTION_TOP
     *   - Ext.Component.DIRECTION_RIGHT
     *   - Ext.Component.DIRECTION_BOTTOM
     *   - Ext.Component.DIRECTION_LEFT
     *
     * @param {Boolean} [animate] True to animate the transition, else false (defaults to the value of the
     * {@link #animCollapse} panel config)
     * @return {Ext.panel.Panel} this
     */
    collapse: function(direction, animate) {
        var me = this,
            collapseDir = direction || me.collapseDirection,
            horizontalCollapse = collapseDir == 'left' || collapseDir == 'right';

        if (arguments.length < 2) {
            animate = me.animCollapse;
        }

        if (me.collapsed || me.fireEvent('beforecollapse', me, direction, animate) === false) {
            return false;
        }

        if (me.ownerCt && me.collapseMode === 'placeholder') {
            return me.placeholderCollapse(direction, animate);
        }

        me.collapsed = collapseDir;
        me.beginCollapse();

        // Flag used by the layouy ContextItem to impose an animation policy based upon the
        // collapse direction and the animCollapse setting.
        me.isCollapsingOrExpanding = 1;

        // Ensure that the header has the collapse class added, and the correct framing applied.
        me.getReExpander().updateFrame();

        (me.ownerCt || me).onContentSizeChange(horizontalCollapse, !horizontalCollapse);
    },

    placeholderCollapse: function(direction, animate) {
        var me = this,
            ownerCt = me.ownerCt,
            collapseDir = direction || me.collapseDirection,
            floatCls = Ext.baseCSSPrefix + 'border-region-slide-in',
            listeners = null;

        // Upcoming layout run will ignore this Component
        me.hidden = true;
        me.collapsed = collapseDir;

        if (me.placeholder) {
            me.placeholder.hidden = false;
            me.placeholder.el.show();
            ownerCt.updateLayout();
        } else {
            
            if (me.floatable || (me.collapsible && me.titleCollapse)) {
                listeners = {
                    click: {
                        fn: me.floatable ? me.floatCollapsedPanel : me.toggleCollapse,
                        element: 'el',
                        scope: me
                    }
                };
            }
            
            me.placeholder = Ext.widget(me.createReExpander(collapseDir, {
                id: me.id + '-placeholder',
                placeholderFor: me,
                margins: me.margins,
                cls: Ext.baseCSSPrefix + 'region-collapsed-placeholder ' + Ext.baseCSSPrefix + 'region-collapsed-' + collapseDir + '-placeholder ' + me.collapsedCls,
                listeners: listeners
            }));

            ownerCt.insert(ownerCt.items.indexOf(me), me.placeholder);
        }

        if (animate) {
            me.el.addCls(floatCls);
            me.el.slideOut(collapseDir.substr(0, 1), {
                duration: Ext.Number.from(animate, Ext.fx.Anim.prototype.duration),
                listeners: {
                    afteranimate: function() {
                        me.el.removeCls(floatCls);

                        me.placeholder.el.slideIn(collapseDir.substr(0, 1), {
                            easing: 'linear',
                            duration: 100
                        });
                    }
                }
            });
        } else {
            me.el.hide();
        }

        me.fireEvent('collapse', me);
    },
    
    floatCollapsedPanel: function() {
        var me = this,
            placeholder = me.placeholder,
            pb = placeholder.getBox(true),
            myBox,
            floatCls = Ext.baseCSSPrefix + 'border-region-slide-in',
            collapsed = me.collapsed;

        // Already floated
        if (me.el.hasCls(floatCls)) {
            return me.slideOutFloatedPanel();
        }

        // Function to be called when the mouse leaves the floated Panel
        // Slide out when the mouse leaves the region bounded by the slid Component and its placeholder.
        function onMouseLeaveFloated(e) {
            var slideRegion = me.el.getRegion().union(placeholder.el.getRegion()).adjust(1, -1, -1, 1);

            // If mouse is not within slide Region, slide it out
            if (!slideRegion.contains(e.getPoint())) {
                me.slideOutFloatedPanel();
            }
        }

        // Lay out in fully uncollapsed mode to ensure we are at the correct size
        delete me.collapsed;
        me.placeholder.el.hide();
        me.placeholder.hidden = true;
        me.show();
        myBox = me.getBox(true);

        // Then go back immediately to collapsed state
        me.placeholder.el.show();
        me.placeholder.hidden = false;
        me.hide();
        me.collapsed = collapsed;

        // Monitor for mouseouting of the placeholder. Hide it if they exit for half a second or more
        me.placeholderMouseMon = placeholder.el.monitorMouseLeave(500, onMouseLeaveFloated);
        me.panelMouseMon       = me.el.monitorMouseLeave(500, onMouseLeaveFloated);
        me.el.addCls(floatCls);
        me.collapseTool.el.hide();

        switch (me.collapsed) {
            case 'top':
                me.el.setLeftTop(pb.x, pb.y + pb.height - 1);
                me.el.slideIn('t');
                break;
            case 'right':
                me.el.setLeftTop(pb.x - myBox.width + 1, pb.Y);
                me.el.slideIn('r');
                break;
            case 'bottom':
                me.el.setLeftTop(pb.x, pb.y - myBox.height + 1);
                me.el.slideIn('b');
                break;
            case 'left':
                me.el.setLeftTop(pb.x + pb.width - 1, pb.y);
                me.el.slideIn('l');
                break;
        }
    },

    slideOutFloatedPanel: function() {
        var me = this,
            compEl = this.el,
            floatCls = Ext.baseCSSPrefix + 'border-region-slide-in';

        // Remove mouse leave monitors
        compEl.un(me.panelMouseMon);
        me.placeholder.el.un(me.placeholderMouseMon);

        // Slide the Component out
        me.el.removeCls(floatCls);
        compEl.slideOut(me.collapsed.substr(0, 1), me.slideOutAnim);
    },

    /**
     * Expands the panel body so that it becomes visible.  Fires the {@link #beforeexpand} event which will
     * cancel the expand action if it returns false.
     * @param {Boolean} animate True to animate the transition, else false (defaults to the value of the
     * {@link #animCollapse} panel config)
     * @return {Ext.panel.Panel} this
     */
    expand: function(animate) {
        var me = this,
            horizontalCollapse = me.collapsedHorizontal();

        if (arguments.length < 2) {
            animate = me.animCollapse;
        }

        if (!me.collapsed || me.fireEvent('beforeexpand', me, animate) === false) {
            return false;
        }

        if (me.collapseMode === 'placeholder') {
            return me.placeholderExpand(animate);
        }

        if (me.reExpander) {
            me.reExpander.hidden = true;
            me.reExpander.el.hide();
        }
        me.beginExpand();
        me.collapsed = false;

        // Flag used by the layouy ContextItem to impose an animation policy based upon the
        // collapse direction and the animCollapse setting.
        me.isCollapsingOrExpanding = 2;

        // Ensure that the header has the collapse class removed, and the correct framing applied.
        me.getReExpander().updateFrame();
        
        (me.ownerCt || me).onContentSizeChange(horizontalCollapse, !horizontalCollapse);
    },

    placeholderExpand: function(animate) {
        var me = this,
            collapseDir = me.collapsed,
            floatCls = Ext.baseCSSPrefix + 'border-region-slide-in',
            finalPos,
            floatedPos,
            slideInDirection;


        // If it's floated...
        if (me.el.hasCls(floatCls)) {
            // Remove mouse leave monitors
            me.el.un(me.panelMouseMon);
            me.placeholder.el.un(me.placeholderMouseMon);

            me.el.removeCls(floatCls);
            floatedPos = me.getPosition(true);
            if (me.collapseTool) {
                me.collapseTool.el.show();
            }
        }

        // Expand me and hide the placeholder
        me.placeholder.hidden = true;
        me.placeholder.el.hide();
        me.collapsed = false;
        me.show();

        if (animate) {

            // Floated, move it back to the floated pos, and thence into the correct place
            if (floatedPos) {
                finalPos = me.el.getXY();
                me.el.setLeftTop(floatedPos[0], floatedPos[1]);
                me.el.removeCls(floatCls);
                me.el.moveTo(finalPos[0], finalPos[1], {
                    duration: Ext.Number.from(animate, Ext.fx.Anim.prototype.duration),
                    listeners: {
                        afteranimate: function() {
                            me.fireEvent('expand', me);
                        }
                    }
                });
            }
            // Not floated, slide it in to the correct place
            else {
                me.hidden = true;
                me.el.hide();
                me.collapsed = collapseDir;
                me.placeholder.show();
                slideInDirection = collapseDir.substr(0, 1);

                // Slide this Component's el back into place, after which we lay out AGAIN
                me.hidden = false;
                me.el.slideIn(slideInDirection, {
                    duration: Ext.Number.from(animate, Ext.fx.Anim.prototype.duration),
                    listeners: {
                        afteranimate: function() {
                            me.collapsed = false;
                            me.placeholder.hide();
                            me.fireEvent('expand', me);
                        }
                    }
                });
            }

        } else {
            me.fireEvent('expand', me);
        }
    },

    afterCollapse: function(animated, internal) {
        var me = this;

        me.isCollapsingOrExpanding = false;
        if (me.collapseTool) {
            me.collapseTool.setType('expand-' + me.getOppositeDirection(me.collapseDirection));
        }
        me.fireEvent('collapse', me);
    },

    afterExpand: function(animated) {
        var me = this;

        me.isCollapsingOrExpanding = false;
        if (me.collapseTool) {
            me.collapseTool.setType('collapse-' + me.collapseDirection);
        }
        me.fireEvent('expand', me);
    },

    /**
     * Shortcut for performing an {@link #expand} or {@link #collapse} based on the current state of the panel.
     * @return {Ext.panel.Panel} this
     */
    toggleCollapse: function() {
        var me = this;
        if (me.isCollapsingOrExpanding) {
            return me;
        }
        if (me.collapsed) {
            me.expand(me.animCollapse);
        } else {
            me.collapse(me.collapseDirection, me.animCollapse);
        }
        return me;
    },

    // private
    getKeyMap : function(){
        if(!this.keyMap){
            this.keyMap = new Ext.util.KeyMap(this.el, this.keys);
        }
        return this.keyMap;
    },

    // private
    initDraggable : function(){
        /**
         * @property {Ext.dd.DragSource} dd
         * If this Panel is configured {@link #draggable}, this property will contain an instance of {@link
         * Ext.dd.DragSource} which handles dragging the Panel.
         *
         * The developer must provide implementations of the abstract methods of {@link Ext.dd.DragSource} in order to
         * supply behaviour for each stage of the drag/drop process. See {@link #draggable}.
         */
        this.dd = new Ext.panel.DD(this, Ext.isBoolean(this.draggable) ? null : this.draggable);
    },

    // private - helper function for ghost
    ghostTools : function() {
        var tools = [],
            headerTools = this.header.query('tool[hidden=false]');

        if (headerTools.length) {
            Ext.each(headerTools, function(tool) {
                // Some tools can be full components, and copying them into the ghost
                // actually removes them from the owning panel. You could also potentially
                // end up with duplicate DOM ids as well. To avoid any issues we just make
                // a simple bare-minimum clone of each tool for ghosting purposes.
                tools.push({
                    type: tool.type
                });
            });
        } else {
            tools = [{
                type: 'placeholder'
            }];
        }
        return tools;
    },

    // private - used for dragging
    ghost: function(cls) {
        var me = this,
            ghostPanel = me.ghostPanel,
            box = me.getBox(),
            header;

        if (!ghostPanel) {
            ghostPanel = new Ext.panel.Panel({
                renderTo: me.floating ? me.el.dom.parentNode : document.body,
                floating: {
                    shadow: false
                },
                frame: Ext.supports.CSS3BorderRadius ? me.frame : false,
                overlapHeader: me.overlapHeader,
                headerPosition: me.headerPosition,
                baseCls: me.baseCls,
                cls: me.baseCls + '-ghost ' + (cls ||'')
            });
            me.ghostPanel = ghostPanel;
        }
        ghostPanel.floatParent = me.floatParent;
        if (me.floating) {
            ghostPanel.setZIndex(Ext.Number.from(me.el.getStyle('zIndex'), 0));
        } else {
            ghostPanel.toFront();
        }
        header = ghostPanel.header;
        // restore options
        if (header) {
            header.suspendLayouts();
            Ext.Array.forEach(header.query('tool'), function(tool){
                header.remove(tool);
            });
            header.resumeLayouts();
        }
        ghostPanel.addTool(me.ghostTools());
        ghostPanel.setTitle(me.title);
        ghostPanel.setIconCls(me.iconCls);

        ghostPanel.el.show();
        ghostPanel.setPosition(box.x, box.y);
        ghostPanel.setSize(box.width, box.height);
        me.el.hide();
        if (me.floatingItems) {
            me.floatingItems.hide();
        }
        return ghostPanel;
    },

    // private
    unghost: function(show, matchPosition) {
        var me = this;
        if (!me.ghostPanel) {
            return;
        }
        if (show !== false) {
            if (matchPosition !== false) {
                me.setPosition(me.ghostPanel.getPosition());
            }
            me.el.show();
            if (me.floatingItems) {
                me.floatingItems.show();
            }
            Ext.defer(me.focus, 10, me);
        }
        me.ghostPanel.el.hide();
    },

    initResizable: function(resizable) {
        if (this.collapsed) {
            resizable.disabled = true;
        }
        this.callParent([resizable]);
    }
}, function(){
    this.prototype.animCollapse = Ext.enableFx;
});
