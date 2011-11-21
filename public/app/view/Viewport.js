Ext.define('CloudHIS.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
               'CloudHIS.view.tree.ServiceTree',
               'CloudHIS.view.tree.ToolsTree',
               'CloudHIS.view.tree.ReportsTree'
               ],
    
    layout: 'border',
    
    items: [
        {
            xtype: 'header',
            region: 'north'
        },
        {
            region: 'center',
            
            layout: {
                type : 'hbox',
                align: 'stretch'
            },
            
            items: [
                {
                    title: 'โปรแกรมบริหารงานพัสดุ',
                    xtype: 'panel',
                    layout: 'accordion',
                    width: 250,
                    items: [
                        {xtype: 'servicetree'},
                        {xtype: 'reportstree'},
                        {xtype: 'toolstree'}
                    ]
                },
                
                {
                    cls: 'x-example-panel',
                    flex: 1,
                    title: '&nbsp;',
                    id   : 'mainPanel',
                    layout: 'fit',
                    bodyPadding: 0
                }
            ]
        }
    ]
});