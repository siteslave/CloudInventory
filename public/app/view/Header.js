Ext.define('CloudHIS.view.Header', {
    extend: 'Ext.Toolbar',
    xtype: 'header',
    
    height: 45,
    
    items: [
        {
            xtype:'toolbar',
            width:null, height:null,
            items:[
                {
                    xtype:'splitbutton',
                    text:'เมนูหลัก',
                    iconCls:'list',
                    menu:[
                        {
                            text:'รายชื่อผู้มารับบริการ'
                        }
                    ]
                },
                '-',
                {
									xtype:'splitbutton', text:'Cut', iconCls:'close', menu:[
                    {text:'Cut Menu Item'}
	                ]
								},
                {text:'Copy', iconCls:'file'},
                {text:'Paste', iconCls:'paste', menu:[
                    {text:'Paste Menu Item'}
                ]},
                '-',
                {text:'Format', iconCls:'edit2'}
            ]
        }
    ]
});
