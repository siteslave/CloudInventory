/**
 * @class Ext.grid.View
 * @extends Ext.view.Table
 *
 * The grid View class provides extra {@link Ext.grid.Panel} specific functionality to the
 * {@link Ext.view.Table}. In general, this class is not instanced directly, instead a viewConfig
 * option is passed to the grid:
 *
 *     Ext.create('Ext.grid.Panel', {
 *         // other options
 *         viewConfig: {
 *             stripeRows: false
 *         }
 *     });
 *
 * ## Drag Drop
 *
 * Drag and drop functionality can be achieved in the grid by attaching a {@link Ext.grid.plugin.DragDrop} plugin
 * when creating the view.
 *
 *     Ext.create('Ext.grid.Panel', {
 *         // other options
 *         viewConfig: {
 *             plugins: {
 *                 ddGroup: 'people-group',
 *                 ptype: 'gridviewdragdrop',
 *                 enableDrop: false
 *             }
 *         }
 *     });
 */
Ext.define('Ext.grid.View', {
    extend: 'Ext.view.Table',
    alias: 'widget.gridview',

    /**
     * @cfg {Boolean} stripeRows <tt>true</tt> to stripe the rows. Default is <tt>true</tt>.
     * <p>This causes the CSS class <tt><b>x-grid-row-alt</b></tt> to be added to alternate rows of
     * the grid. A default CSS rule is provided which sets a background color, but you can override this
     * with a rule which either overrides the <b>background-color</b> style using the '!important'
     * modifier, or which uses a CSS selector of higher specificity.</p>
     */
    stripeRows: true,

    autoScroll: true,
    
    /**
     * Scroll the GridView to the top by scrolling the scroller.
     * @private
     */
    scrollToTop : function(){
        if (this.rendered) {
            var section = this.ownerCt,
                verticalScroller = section.verticalScroller;

            if (verticalScroller) {
                verticalScroller.scrollToTop();
            }
        }
    }
});
