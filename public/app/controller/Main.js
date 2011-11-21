Ext.define('CloudHIS.controller.Main', {
    extend: 'Ext.app.Controller',
    stores: [
        'ToolTreeStore'
    ],
    
    views: [
        'Viewport',
        'Header'
    ],
    
    refs: [
        {
            ref: 'mainPanel',
            selector: '#mainPanel'
        }
    ],
    
    
    init: function(){
        this.control({
        
        });    
    }
    /*,
    setActiveItem: function(className, title) {
        var panel = Ext.getCmp('mainPanel'),
		component = Ext.create(className);
        
        panel.setTitle(title);
        
        panel.removeAll();
        panel.add(component);
    } */
});