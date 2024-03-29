/**
 * An abstract base class which provides shared methods for Containers across the Sencha product line.
 *
 * Please refer to sub class's documentation
 *
 * @private
 */
Ext.define('Ext.container.AbstractContainer', {

    /* Begin Definitions */

    extend: 'Ext.Component',

    requires: [
        'Ext.util.MixedCollection',
        'Ext.layout.container.Auto',
        'Ext.ZIndexManager'
    ],

    /* End Definitions */

    renderTpl: '{%this.renderContainer(out,values)%}',

    /**
     * @cfg {String/Object} layout
     * **Important**: In order for child items to be correctly sized and
     * positioned, typically a layout manager **must** be specified through
     * the `layout` configuration option.
     *
     * The sizing and positioning of child {@link #items} is the responsibility of
     * the Container's layout manager which creates and manages the type of layout
     * you have in mind.  For example:
     *
     * If the {@link #layout} configuration is not explicitly specified for
     * a general purpose container (e.g. Container or Panel) the
     * {@link Ext.layout.container.Auto default layout manager} will be used
     * which does nothing but render child components sequentially into the
     * Container (no sizing or positioning will be performed in this situation).
     *
     * **layout** may be specified as either as an Object or as a String:
     *
     * # Specify as an Object
     *
     * Example usage:
     *
     *     layout: {
     *         type: 'vbox',
     *         align: 'left'
     *     }
     *
     *   - **type**
     *
     *     The layout type to be used for this container.  If not specified,
     *     a default {@link Ext.layout.container.Auto} will be created and used.
     *
     *     Valid layout <code>type</code> values are:
     *
     *     - {@link Ext.layout.container.Auto Auto} - **Default**
     *     - {@link Ext.layout.container.Card card}
     *     - {@link Ext.layout.container.Fit fit}
     *     - {@link Ext.layout.container.HBox hbox}
     *     - {@link Ext.layout.container.VBox vbox}
     *     - {@link Ext.layout.container.Anchor anchor}
     *     - {@link Ext.layout.container.Table table}
     *
     *   - Layout specific configuration properties
     *
     *     Additional layout specific configuration properties may also be
     *     specified. For complete details regarding the valid config options for
     *     each layout type, see the layout class corresponding to the `type`
     *     specified.
     *
     * # Specify as a String
     *
     * Example usage:
     *
     *     layout: 'vbox'
     *
     *   - **layout**
     *
     *     The layout `type` to be used for this container (see list
     *     of valid layout type values above).
     *
     *     Additional layout specific configuration properties. For complete
     *     details regarding the valid config options for each layout type, see the
     *     layout class corresponding to the `layout` specified.
     */

    /**
     * @cfg {String/Number} activeItem
     * A string component id or the numeric index of the component that should be
     * initially activated within the container's layout on render.  For example,
     * activeItem: 'item-1' or activeItem: 0 (index 0 = the first item in the
     * container's collection).  activeItem only applies to layout styles that can
     * display items one at a time (like {@link Ext.layout.container.Card} and
     * {@link Ext.layout.container.Fit}).
     */

    /**
     * @cfg {Object/Object[]} items
     * A single item, or an array of child Components to be added to this container
     *
     * **Unless configured with a {@link #layout}, a Container simply renders child
     * Components serially into its encapsulating element and performs no sizing or
     * positioning upon them.**
     *
     * Example:
     *
     *     // specifying a single item
     *     items: {...},
     *     layout: 'fit',    // The single items is sized to fit
     *      
     *     // specifying multiple items
     *     items: [{...}, {...}],
     *     layout: 'hbox', // The items are arranged horizontally
     *
     * Each item may be:
     *
     * - A {@link Ext.Component Component}
     * - A Component configuration object
     *
     * If a configuration object is specified, the actual type of Component to be
     * instantiated my be indicated by using the {@link Ext.Component#xtype xtype} option.
     *
     * Every Component class has its own {@link Ext.Component#xtype xtype}.
     *
     * If an {@link Ext.Component#xtype xtype} is not explicitly specified, the
     * {@link #defaultType} for the Container is used, which by default is usually `panel`.
     *
     * # Notes:
     *
     * Ext uses lazy rendering. Child Components will only be rendered
     * should it become necessary. Items are automatically laid out when they are first
     * shown (no sizing is done while hidden), or in response to a {@link #doLayout} call.
     *
     * Do not specify {@link Ext.panel.Panel#contentEl contentEl} or
     * {@link Ext.panel.Panel#html html} with `items`.
     */

    /**
     * @cfg {Object/Function} defaults
     * This option is a means of applying default settings to all added items whether added
     * through the {@link #items} config or via the {@link #add} or {@link #insert} methods.
     *
     * Defaults are applied to both config objects and instantiated components conditionally
     * so as not to override existing properties in the item (see {@link Ext#applyIf}).
     *
     * If the defaults option is specified as a function, then the function will be called
     * using this Container as the scope (`this` reference) and passing the added item as
     * the first parameter. Any resulting object from that call is then applied to the item
     * as default properties.
     *
     * For example, to automatically apply padding to the body of each of a set of
     * contained {@link Ext.panel.Panel} items, you could pass:
     * `defaults: {bodyStyle:'padding:15px'}`.
     *
     * Usage:
     *
     *     defaults: { // defaults are applied to items, not the container
     *         autoScroll: true
     *     },
     *     items: [
     *         // default will not be applied here, panel1 will be autoScroll: false
     *         {
     *             xtype: 'panel',
     *             id: 'panel1',
     *             autoScroll: false
     *         },
     *         // this component will have autoScroll: true
     *         new Ext.panel.Panel({
     *             id: 'panel2'
     *         })
     *     ]
     */

    /**
     * @cfg {Boolean} suspendLayout
     * If true, suspend calls to doLayout. Useful when batching multiple adds to a container
     * and not passing them as multiple arguments or an array.
     */
    suspendLayout : false,

    /**
     * @cfg {Boolean} autoDestroy
     * If true the container will automatically destroy any contained component that is removed
     * from it, else destruction must be handled manually.
     */
    autoDestroy : true,

     /**
      * @cfg {String} defaultType
      * The default {@link Ext.Component xtype} of child Components to create in this Container when
      * a child item is specified as a raw configuration object, rather than as an instantiated Component.
      */
    defaultType: 'panel',

    isContainer : true,

    /**
     * @property {Number} layoutCounter
     * The number of container layout calls made on this object.
     * @private
     */
    layoutCounter : 0,

    baseCls: Ext.baseCSSPrefix + 'container',

    /**
     * @cfg {String[]} bubbleEvents
     * An array of events that, when fired, should be bubbled to any parent container.
     * See {@link Ext.util.Observable#enableBubble}.
     */
    bubbleEvents: ['add', 'remove'],

    // @private
    initComponent : function(){
        var me = this;
        me.addEvents(
            /**
             * @event afterlayout
             * Fires when the components in this container are arranged by the associated layout manager.
             * @param {Ext.container.Container} this
             * @param {Ext.layout.container.Container} layout The ContainerLayout implementation for this container
             */
            'afterlayout',
            /**
             * @event beforeadd
             * Fires before any {@link Ext.Component} is added or inserted into the container.
             * A handler can return false to cancel the add.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} component The component being added
             * @param {Number} index The index at which the component will be added to the container's items collection
             */
            'beforeadd',
            /**
             * @event beforeremove
             * Fires before any {@link Ext.Component} is removed from the container.  A handler can return
             * false to cancel the remove.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} component The component being removed
             */
            'beforeremove',
            /**
             * @event add
             * @bubbles
             * Fires after any {@link Ext.Component} is added or inserted into the container.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} component The component that was added
             * @param {Number} index The index at which the component was added to the container's items collection
             */
            'add',
            /**
             * @event remove
             * @bubbles
             * Fires after any {@link Ext.Component} is removed from the container.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} component The component that was removed
             */
            'remove'
        );

        me.callParent();

        me.getLayout();
        me.initItems();
    },

    // @private
    initItems : function() {
        var me = this,
            items = me.items;

        /**
         * The MixedCollection containing all the child items of this container.
         * @property items
         * @type Ext.util.AbstractMixedCollection
         */
        me.items = new Ext.util.AbstractMixedCollection(false, me.getComponentId);

        if (items) {
            if (!Ext.isArray(items)) {
                items = [items];
            }

            me.add(items);
        }
    },

    finishRenderChildren: function () {
        this.callParent();

        var layout = this.getLayout();

        if (layout) {
            layout.finishRender();
        }
    },

    beforeRender: function () {
        var me = this,
            layout = me.getLayout();

        me.callParent();

        if (!layout.initialized) {
            layout.initLayout();
        }
    },

    setupRenderTpl: function (renderTpl) {
        var layout = this.getLayout();

        this.callParent(arguments);

        layout.setupRenderTpl(renderTpl);
    },

    // @private
    setLayout : function(layout) {
        var currentLayout = this.layout;

        if (currentLayout && currentLayout.isLayout && currentLayout != layout) {
            currentLayout.setOwner(null);
        }

        this.layout = layout;
        layout.setOwner(this);
    },

    /**
     * Returns the {@link Ext.layout.container.Container layout} instance currently associated with this Container.
     * If a layout has not been instantiated yet, that is done first
     * @return {Ext.layout.container.Container} The layout
     */
    getLayout : function() {
        var me = this;
        if (!me.layout || !me.layout.isLayout) {
            me.setLayout(Ext.layout.Layout.create(me.layout, 'autocontainer'));
        }

        return me.layout;
    },

    /**
     * Manually force this container's layout to be recalculated. The framework uses this internally to refresh layouts
     * form most cases.
     * @return {Ext.container.Container} this
     */
    doLayout : function() {
        var me = this,
            layout = me.getLayout();

        if (me.rendered && layout && !me.suspendLayout && !me.layoutSuspendCount) {
            /*
            // If either dimension is being auto-set, then it requires a ComponentLayout to be run.
            if (!me.isFixedWidth() || !me.isFixedHeight()) {
                // Only run the ComponentLayout if it is not already in progress
                if (me.componentLayout.layoutBusy !== true) {
                    me.doComponentLayout();
                    if (me.componentLayout.layoutCancelled === true) {
                        layout.layout();
                    }
                }
            }
            // Both dimensions set, either by configuration, or by an owning layout, run a ContainerLayout
            else {
                // Only run the ContainerLayout if it is not already in progress
                if (layout.layoutBusy !== true) {
                    layout.layout();
                }
            }
            */
           me.updateLayout();
           // TODO - since we may change size, we really need to bubble this up...
        }

        return me;
    },

    // @private
    afterLayout : function(layout) {
        ++this.layoutCounter;
        this.fireEvent('afterlayout', this, layout);
    },

    // @private
    prepareItems : function(items, applyDefaults) {

        // Create an Array which does not refer to the passed array.
        // The passed array is a reference to a user's config object and MUST NOT be mutated.
        if (Ext.isArray(items)) {
            items = items.slice();
        } else {
            items = [items];
        }

        // Make sure defaults are applied and item is initialized
        var i = 0,
            len = items.length,
            item;

        for (; i < len; i++) {
            item = items[i];
            if (applyDefaults) {
                item = this.applyDefaults(item);
            }
            items[i] = this.lookupComponent(item);
        }
        return items;
    },

    // @private
    applyDefaults : function(config) {
        var defaults = this.defaults;

        if (defaults) {
            if (Ext.isFunction(defaults)) {
                defaults = defaults.call(this, config);
            }

            if (Ext.isString(config)) {
                config = Ext.ComponentManager.get(config);
            }
            Ext.applyIf(config, defaults);
        }
        return config;
    },

    // @private
    lookupComponent : function(comp) {
        return (typeof comp == 'string') ? Ext.ComponentManager.get(comp)
                                         : Ext.ComponentManager.create(comp, this.defaultType);
    },

    // @private - used as the key lookup function for the items collection
    getComponentId : function(comp) {
        return comp.getItemId();
    },

    /**
     * Adds {@link Ext.Component Component}(s) to this Container.
     *
     * ## Description:
     *
     * - Fires the {@link #beforeadd} event before adding.
     * - The Container's {@link #defaults default config values} will be applied
     *   accordingly (see `{@link #defaults}` for details).
     * - Fires the `{@link #add}` event after the component has been added.
     *
     * ## Notes:
     *
     * If the Container is __already rendered__ when `add`
     * is called, it will render the newly added Component into its content area.
     *
     * **If** the Container was configured with a size-managing {@link #layout} manager,
     * the Container will recalculate its internal layout at this time too.
     *  
     * Note that the default layout manager simply renders child Components sequentially
     * into the content area and thereafter performs no sizing.
     *  
     * If adding multiple new child Components, pass them as an array to the `add` method,
     * so that only one layout recalculation is performed.
     *  
     *     tb = new {@link Ext.toolbar.Toolbar}({
     *         renderTo: document.body
     *     });  // toolbar is rendered
     *     // add multiple items.
     *     // ({@link #defaultType} for {@link Ext.toolbar.Toolbar Toolbar} is 'button')
     *     tb.add([{text:'Button 1'}, {text:'Button 2'}]);
     *
     * ## Warning:
     *
     * Components directly managed by the BorderLayout layout manager may not be removed
     * or added.  See the Notes for {@link Ext.layout.container.Border BorderLayout} for
     * more details.
     *
     * @param {Ext.Component[]/Ext.Component...} component
     * Either one or more Components to add or an Array of Components to add.
     * See `{@link #items}` for additional information.
     *
     * @return {Ext.Component[]/Ext.Component} The Components that were added.
     */
    add : function() {
        var me = this,
            args = Ext.Array.slice(arguments),
            index = (typeof args[0] == 'number') ? args.shift() : -1,
            layout = me.getLayout(),
            addingArray, items, i, length, item, pos, ret;

        if (args.length == 1 && Ext.isArray(args[0])) {
            items = args[0];
            addingArray = true;
        } else {
            items = args;
        }

        ret = items = me.prepareItems(items, true);
        length = items.length;

        if (me.rendered) {
            me.suspendLayouts(); // suspend layouts while adding items...
        }

        if (!addingArray && length == 1) { // an array of 1 should still return an array...
            ret = items[0];
        }

        // loop
        for (i = 0; i < length; i++) {
            item = items[i];
            //<debug>
            if (!item) {
                Ext.Error.raise("Cannot add null item to Container with itemId/id: " + me.getItemId());
            }
            //</debug>

            pos = (index < 0) ? me.items.length : (index + i);

            // Floating Components are not added into the items collection
            // But they do get an upward ownerCt link so that they can traverse
            // up to their z-index parent.
            if (item.floating) {
                item.onAdded(me, pos);
            } else if (me.fireEvent('beforeadd', me, item, pos) !== false &&
                       me.onBeforeAdd(item) !== false) {
                me.items.insert(pos, item);
                item.onAdded(me, pos);
                me.onAdd(item, pos);
                layout.onAdd(item, pos);

                me.fireEvent('add', me, item, pos);
            }
        }

        if (me.rendered) {
            me.resumeLayouts(true);
        }

        return ret;
    },

    onAdd : Ext.emptyFn,
    onRemove : Ext.emptyFn,

    /**
     * Inserts a Component into this Container at a specified index. Fires the
     * {@link #beforeadd} event before inserting, then fires the {@link #add}
     * event after the Component has been inserted.
     *
     * @param {Number} index The index at which the Component will be inserted
     * into the Container's items collection
     *
     * @param {Ext.Component} component The child Component to insert.
     *
     * Ext uses lazy rendering, and will only render the inserted Component should
     * it become necessary.
     *
     * A Component config object may be passed in order to avoid the overhead of
     * constructing a real Component object if lazy rendering might mean that the
     * inserted Component will not be rendered immediately. To take advantage of
     * this 'lazy instantiation', set the {@link Ext.Component#xtype} config
     * property to the registered type of the Component wanted.
     *
     * For a list of all available xtypes, see {@link Ext.Component}.
     *
     * @return {Ext.Component} component The Component (or config object) that was
     * inserted with the Container's default config values applied.
     */
    insert : function(index, comp) {
        return this.add(index, comp);
    },

    /**
     * Moves a Component within the Container
     * @param {Number} fromIdx The index the Component you wish to move is currently at.
     * @param {Number} toIdx The new index for the Component.
     * @return {Ext.Component} component The Component (or config object) that was moved.
     */
    move : function(fromIdx, toIdx) {
        var items = this.items,
            item;
        item = items.removeAt(fromIdx);
        if (item === false) {
            return false;
        }
        items.insert(toIdx, item);
        this.doLayout();
        return item;
    },

    // @private
    onBeforeAdd : function(item) {
        var me = this;

        if (item.ownerCt) {
            item.ownerCt.remove(item, false);
        }

        if (me.border === false || me.border === 0) {
            item.border = (item.border === true);
        }
    },

    /**
     * Removes a component from this container.  Fires the {@link #beforeremove} event
     * before removing, then fires the {@link #remove} event after the component has
     * been removed.
     *
     * @param {Ext.Component/String} component The component reference or id to remove.
     *
     * @param {Boolean} [autoDestroy] True to automatically invoke the removed Component's
     * {@link Ext.Component#destroy} function.
     *
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     *
     * @return {Ext.Component} component The Component that was removed.
     */
    remove : function(comp, autoDestroy) {
        var me = this,
            c = me.getComponent(comp);
        //<debug>
            if (Ext.isDefined(Ext.global.console) && !c) {
                Ext.global.console.warn("Attempted to remove a component that does not exist. Ext.container.Container: remove takes an argument of the component to remove. cmp.remove() is incorrect usage.");
            }
        //</debug>

        if (c && me.fireEvent('beforeremove', me, c) !== false) {
            me.doRemove(c, autoDestroy);
            me.fireEvent('remove', me, c);

            if (!me.destroying) {
                me.doLayout();
            }
        }

        return c;
    },

    // @private
    doRemove : function(component, autoDestroy) {
        var me = this,
            layout = me.layout,
            hasLayout = layout && me.rendered;

        me.items.remove(component);
        component.onRemoved();

        if (hasLayout) {
            layout.onRemove(component);
        }

        me.onRemove(component, autoDestroy);

        if (autoDestroy === true || (autoDestroy !== false && me.autoDestroy)) {
            component.destroy();
        }

        if (hasLayout && !autoDestroy) {
            layout.afterRemove(component);
        }
    },

    /**
     * Removes all components from this container.
     * @param {Boolean} [autoDestroy] True to automatically invoke the removed
     * Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Ext.Component[]} Array of the removed components
     */
    removeAll : function(autoDestroy) {
        var me = this,
            removeItems = me.items.items.slice(),
            items = [],
            i = 0,
            len = removeItems.length,
            item;

        // Suspend Layouts while we remove multiple items from the container
        me.suspendLayouts();
        for (; i < len; i++) {
            item = removeItems[i];
            me.remove(item, autoDestroy);

            if (item.ownerCt !== me) {
                items.push(item);
            }
        }

        // Resume Layouts now that all items have been removed and do a single layout (if we removed anything!)
        me.resumeLayouts(!!len);
        return items;
    },

    // Used by ComponentQuery to retrieve all of the items
    // which can potentially be considered a child of this Container.
    // This should be overriden by components which have child items
    // that are not contained in items. For example dockedItems, menu, etc
    // IMPORTANT note for maintainers:
    //  Items are returned in tree traversal order. Each item is appended to the result array
    //  followed by the results of that child's getRefItems call.
    //  Floating child items are appended after internal child items.
    getRefItems : function(deep) {
        var me = this,
            items = me.items.items,
            len = items.length,
            i = 0,
            item,
            result = [];

        for (; i < len; i++) {
            item = items[i];
            result.push(item);
            if (deep && item.getRefItems) {
                result.push.apply(result, item.getRefItems(true));
            }
        }

        // Append floating items to the list.
        // These will only be present after they are rendered.
        if (me.floatingItems && me.floatingItems.accessList) {
            result.push.apply(result, me.floatingItems.accessList);
        }

        return result;
    },

    /**
     * Cascades down the component/container heirarchy from this component (passed in
     * the first call), calling the specified function with each component. The scope
     * (this reference) of the function call will be the scope provided or the current
     * component. The arguments to the function will be the args provided or the current
     * component. If the function returns false at any point, the cascade is stopped on
     * that branch.
     * @param {Function} fn The function to call
     * @param {Object} [scope] The scope of the function (defaults to current component)
     * @param {Array} [args] The args to call the function with. The current component
     * always passed as the last argument.
     * @return {Ext.Container} this
     */
    cascade : function(fn, scope, origArgs){
        var me = this,
            cs = me.items ? me.items.items : [],
            len = cs.length,
            i = 0,
            c,
            args = origArgs ? origArgs.concat(me) : [me],
            componentIndex = args.length - 1;

        if (fn.apply(scope || me, args) !== false) {
            for(; i < len; i++){
                c = cs[i];
                if (c.cascade) {
                    c.cascade(fn, scope, origArgs);
                } else {
                    args[componentIndex] = c;
                    fn.apply(scope || cs, args);
                }
            }
        }
        return this;
    },

    /**
     * Determines whether **this Container** is an ancestor of the passed Component.
     * This will return `true` if the passed Component is anywhere within the subtree
     * beneath this Container.
     * @param {Ext.Component} possibleDescendant The Component to test for presence
     * within this Container's subtree.
     */
    isAncestor: function(possibleDescendant) {
        while (possibleDescendant) {
            if (possibleDescendant.ownerCt === this) {
                return true;
            }
            possibleDescendant = possibleDescendant.ownerCt;
        }
    },

    /**
     * Examines this container's {@link #items} **property** and gets a direct child
     * component of this container.
     *
     * @param {String/Number} comp This parameter may be any of the following:
     *
     * - a **String** : representing the {@link Ext.Component#itemId itemId}
     *   or {@link Ext.Component#id id} of the child component.
     * - a **Number** : representing the position of the child component
     *   within the {@link #items} **property**
     *
     * For additional information see {@link Ext.util.MixedCollection#get}.
     *
     * @return Ext.Component The component (if found).
     */
    getComponent : function(comp) {
        if (Ext.isObject(comp)) {
            comp = comp.getItemId();
        }

        return this.items.get(comp);
    },

    /**
     * Retrieves all descendant components which match the passed selector.
     * Executes an Ext.ComponentQuery.query using this container as its root.
     * @param {String} [selector] Selector complying to an Ext.ComponentQuery selector.
     * If no selector is specified all items will be returned.
     * @return {Ext.Component[]} Components which matched the selector
     */
    query : function(selector) {
        selector = selector || '*';
        return Ext.ComponentQuery.query(selector, this);
    },
    
    /**
     * Retrieves all descendant components which match the passed function.
     * The function should return false for components that are to be
     * excluded from the selection.
     * @param {Function} fn The matcher function. It will be called with a single argument,
     * the component being tested.
     * @param {Object} [scope] The scope in which to run the function. If not specified,
     * it will default to the active component.
     * @return {Ext.Component[]} Components matched by the passed function
     */
    queryBy: function(fn, scope) {
        var out = [],
            items = this.getRefItems(true),
            i = 0,
            len = items.length,
            item;
            
        for (; i < len; ++i) {
            item = items[i];
            if (fn.call(scope || item, item) !== false) {
                out.push(item);
            }
        }
        return out;
    },

    /**
     * Retrieves the first direct child of this container which matches the passed selector.
     * The passed in selector must comply with an Ext.ComponentQuery selector.
     * @param {String} [selector] An Ext.ComponentQuery selector. If no selector is
     * specified, the first child will be returned.
     * @return Ext.Component
     */
    child : function(selector) {
        selector = selector || '';
        return this.query('> ' + selector)[0] || null;
    },

    nextChild: function(child, selector) {
        var me = this,
            result,
            childIndex = me.items.indexOf(child);

        if (childIndex !== -1) {
            result = selector ? Ext.ComponentQuery(selector, me.items.items.slice(childIndex + 1)) : me.items.getAt(childIndex + 1);
            if (!result && me.ownerCt) {
                result = me.ownerCt.nextChild(me, selector);
            }
        }
        return result;
    },

    prevChild: function(child, selector) {
        var me = this,
            result,
            childIndex = me.items.indexOf(child);

        if (childIndex !== -1) {
            result = selector ? Ext.ComponentQuery(selector, me.items.items.slice(childIndex + 1)) : me.items.getAt(childIndex + 1);
            if (!result && me.ownerCt) {
                result = me.ownerCt.nextChild(me, selector);
            }
        }
        return result;
    },

    /**
     * Retrieves the first descendant of this container which matches the passed selector.
     * The passed in selector must comply with an Ext.ComponentQuery selector.
     * @param {String} [selector] An Ext.ComponentQuery selector. If no selector is
     * specified, the first child will be returned.
     * @return Ext.Component
     */
    down : function(selector) {
        return this.query(selector)[0] || null;
    },

    //@private
    // Enable all immediate children that was previously disabled
    // Override enable because onEnable only gets called when rendered
    enable: function() {
        this.callParent(arguments);
        Ext.Array.each(this.query('[isFormField]'), function(item) {
            if (item.resetDisable) {
                item.enable();
            }
        });
    },

    // Inherit docs
    // Disable all immediate children that was previously disabled
    // Override disable because onDisable only gets called when rendered
    disable: function() {
        this.callParent(arguments);
        Ext.Array.each(this.query('[isFormField]'), function(item) {
            if (item.resetDisable !== false && !item.disabled) {
                item.disable();
                item.resetDisable = true;
            }
        });
    },

    /**
     * Occurs before componentLayout is run. Returning false from this method
     * will prevent the containerLayout from being executed.
     */
    beforeLayout: function() {
        return true;
    },

    // @private
    beforeDestroy : function() {
        var me = this,
            items = me.items,
            c;

        if (items) {
            while ((c = items.first())) {
                me.doRemove(c, true);
            }
        }

        Ext.destroy(
            me.layout
        );
        me.callParent();
    }
});
