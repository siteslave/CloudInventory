var paidsStore = Ext.create('CloudHIS.store.PaidsMainStore');
var paidStoreProducts = Ext.create('CloudHIS.store.AddProductsPaidsStore');

paidsStore.load();

var editPaidDetail = function() {
	
	var grid = Ext.getCmp('paidEditGridMainPaidProduct001'),
	    sm = grid.getSelectionModel(),
	    sl = sm.selected.get(0),

	    id = sl.data.id;
		    
	var winEditPaidDetailMain = new Ext.create('Ext.window.Window', {
		title: 'แก้ไขรายการวัสดุ',
		modal: true,
			    
	    items: [
		{
		    xtype: 'grid',
		    title: 'บันทึกการจ่ายพัสดุให้หน่วยงาน',
	        //iconCls: 'list',
		    width: 750,
		    height: 400,
		    frame: false,
		    id: 'paidEditGridMainPaidProduct001',
		    
		    store: paidStoreProducts,
		    columns: [
	            {
	                xtype: 'rownumberer', text: 'ลำดับ', flex: .5
	            },
	            {
	            	text: 'id', dataIndex: 'id', hidden: true
	            },
	            {
	            	text: 'product_id', dataIndex: 'product_id', hidden: true
	            },
	            {
	                text: 'รหัสสินค้า' ,flex: .8, dataIndex: 'code'
	            },
	            {
	                text: 'ชื่อสินค้า' ,flex: 2, dataIndex: 'name'
	            },
	            {
	                text: 'จำนวน' ,flex: .5, dataIndex: 'qty'
	            },
	            {
	                text: 'ราคา' ,flex: .7, dataIndex: 'price',
	                renderer: Ext.util.Format.numberRenderer('0,0'),
	                align: 'right'
	            },
	            {
	                text: 'รวมเป็นเงิน' ,flex: .7, dataIndex: 'total',
	                renderer: Ext.util.Format.numberRenderer('0,0.00'),
	                align: 'right'
	            }
		    ],
		    tbar: [
	            {
	                xtype: 'datefield',
	                fieldLabel: 'วันที่บันทึก',
	                labelWidth: 60,
	                format: 'd/m/Y',
	                width: 160,
	                allowBlank: false,
	                name: 'paid_date',
	                id: 'paidEditDatePaid001',
	                disabled: true
	            }, '-',
	            {
	            	xtype: 'combo',
	            	store: new Ext.create('CloudHIS.store.DepartmentsStore'),
	            	fieldLabel: 'หน่วยเบิก',
	            	valueField: 'id',
	            	displayField: 'name',
	            	allowBlank: false,
	            	width: 300,
	            	labelWidth: 70,
	            	name: 'department_id',
	            	id: 'paidEditDepartmentId001',
	            	disabled: true
	            }, '-'
		    ],
		    bbar: [
		    	{
		    		text: 'เพิ่มรายการ', disabled: true,
		    		iconCls: 'add', handler: function() {
		    			winPaidAddProduct.show();
		    		},
		    		id: 'pdAddProduct001'
		    	},
		    	{
		    		text: 'แก้ไข', disabled: true,
		    		iconCls: 'edit',
		    		handler: function(){
		    			updateProductPaid();
		    		},
		    		id: 'pdEditProduct001'
		    	},
		    	{
		    		text: 'ลบรายการ',
		    		iconCls: 'remove',
		    		handler: function() {
						deleteProductPaid();
					},
					id: 'pdEditRemoveProduct001',
					disabled: true
		    	},'->',
				{
					text: 'ยกเลิกการทั้งหมด', disabled: true,
					iconCls: 'refresh',
					handler: function() {
						//ClearCurrentSession();
					},
					id: 'pdEditClearAllProduct001'
				},
		    	{
		    		xtype: 'hiddenfield',
		    		id: 'paidSESS001'
		    	}
		    ],
		    listeners: {
		    	itemdblclick: function() {
		    		updateProductPaid();
		    	}
		    }
		}
	    ]
	});
	
	winEditPaidDetailMain.show();
}

Ext.define('CloudHIS.view.services.RequestGrid', {
    extend: 'CloudHIS.view.Container',
    
    items: [
	{
	    xtype: 'grid',
	    title: 'รายการขอเบิกวัสดุ (หน่วยงานบันทึกเบิก)',
        //iconCls: 'list',
	    width: 700,
	    height: 460,
	    frame: true,
	    margin: 5,
	    id: 'paidMainGrid',
	    
	    store: paidsStore,
	    columns: [
	    {
            xtype: 'rownumberer', text: 'ลำดับ', flex: .5
       	},
		{
			text: 'id' ,flex: .2, dataIndex: 'id', hidden: true
		},
		{
			text: 'วันที่บันทึก' ,flex: .5, dataIndex: 'paid_date', align: 'center',
			renderer: Ext.util.Format.dateRenderer('d/m/Y')
		},
		{
			text: 'ชื่อหน่วยงาน' ,flex: 2, dataIndex: 'department_name'
		},
		{
			text: 'จำนวน' ,flex: .4, dataIndex: 'qty', align: 'right',
			renderer: Ext.util.Format.numberRenderer('0,0')
		},
		{
			text: 'รวมเป็นเงิน' ,flex: .4, dataIndex: 'price', align: 'right',
			renderer: Ext.util.Format.numberRenderer('0,0.00')
		}

	    ],
        /*
        dockedItems: [
            {
                dock: 'top',
                items: [
                    {
                        xtype: 'datefield',
                        fieldLabel: 'วันที่บันทึก'
                    }
                ]
            }
        ],*/
	    tbar: [
            {
                xtype: 'datefield',
                fieldLabel: 'วันที่บันทึก',
                labelWidth: 60,
                format: 'd/m/Y',
                width: 160,
                id: 'pdMainDatePaid002'
            },
            {
                iconCls: 'search',
                handler: function() {
                	paidsStore.load({
                		params: {
                			paid_date: Ext.getCmp('pdMainDatePaid002').getValue()
                		}
                	});	
                }
            },'-',

            {
                text: 'จ่ายพัสดุ',
                iconCls:'paste', handler: function(){
                	var PaidProductsPanel = new Ext.create('CloudHIS.view.services.PaidProducts');
                	var winPaid = new Ext.create('Ext.window.Window', {
                		title: 'จ่ายวัสดุ',
                		modal: true,
                		resizable: false,
                		
                		layout: 'fit',
                		items: [
                			PaidProductsPanel
                		],
                		buttonAlign: 'left'
                	});
                	
                	winPaid.show();
                }
            },'-',
            {
                text: 'แก้ไข',
                iconCls:'edit2',
                handler: editPaidDetail
            }
	    ],
        bbar: [
            {
                xtype: 'combo',
                store: new Ext.create('CloudHIS.store.DepartmentsStore'),
                labelAlign: 'left',
                labelWidth: 120,
                fieldLabel: 'กรองหน่วยเบิก',
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                typeAhead: false,
                editable: false,
                width: 460,
                id: 'paidMainDepartmentId002'
            },
            {
                iconCls: 'search',
                handler: function() {
                	paidsStore.load({
                		params: {
                			department_id: Ext.getCmp('paidMainDepartmentId002').getValue()
                		}
                	});
                }
            },'-',
            {
                text: 'ดึงข้อมูลใหม่ล่าสุด',
                iconCls: 'refresh',
                handler: function() {
                	paidsStore.load();
                }
            }
        ]
	    /*,
	    listeners: {
		itemclick: function(grid, record){
		    console.log(record.get('name'));
		}
	    }*/
	}
    ]
});