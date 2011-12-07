Ext.require(
	    'Ext.window.MessageBox'
	    );
Ext.define('CloudHIS.view.services.RequestGrid', {
    extend: 'CloudHIS.view.Container',
    
    items: [
	{
	    xtype: 'grid',
	    title: 'รายการขอเบิกวัสดุ (หน่วยงานบันทึกเบิก)',
        //iconCls: 'list',
	    width: 800,
	    height: 500,
	    frame: true,
	    margin: 5,
	    id: 'requestGrid',
	    
	    store: 'Visit',
	    columns: [
		{header: 'ลำดับ' ,flex: .2, dataIndex: 'name'},
		{text: 'วันที่บันทึก' ,flex: .5, dataIndex: 'surname'},
		{text: 'ชื่อหน่วยงาน' ,flex: 1, dataIndex: 'surname'},
		{text: 'ผู้บันทึกรายการเบิก' ,flex: 1, dataIndex: 'surname'},
		{text: 'จำนวน' ,flex: .3, dataIndex: 'surname'},
		{text: 'อนุมัติ' ,flex: .3, dataIndex: 'surname'}
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
                width: 160
            },
            {
                iconCls: 'search'
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
                		buttonAlign: 'left',
                		buttons: [
                			{
                				text: 'สร้างรายการใหม่', handler: function() {
                					//var paidSession = Ext.getCmp('paidSESS001');
                					Ext.Ajax.request({
					                    url: 'receives/sess',
					                    success: function(response) {
					                        Ext.getCmp('paidSESS001').setValue(response.responseText);
					                    }
					                });
                				}
                			},'->',
                			{
                				text: 'ยกเลิกการทั้งหมด'
                			},
                			{
                				text: 'จ่ายวัสดุ'
                			}
                			
                		]
                	});
                	
                	winPaid.show();
                }
            },'-',
            {
                text: 'ยกเลิก',
                iconCls:'close'
            },'-',
            {
                text: 'ดูรายการวัสดุ',
                iconCls:'list'
            },'-',
            {
                text: 'ประวัติการเบิก',
                iconCls:'search'
            },'-',
            {
                text: 'รีเฟรช',
                iconCls: 'refresh'
            }
	    ],
        bbar: [
            {
                xtype: 'combo',
                store: 'Visit',
                labelAlign: 'left',
                labelWidth: 60,
                fieldLabel: 'หน่วยเบิก',
                displayField: 'name',
                valueField: 'surname',
                queryMode: 'local',
                typeAhead: false,
                editable: false
            },
            {
                iconCls: 'search'
            },'-',
            {
                xtype: 'combo',
                store: 'Visit',
                labelAlign: 'left',
                labelWidth: 60,
                fieldLabel: 'สถานะ',
                displayField: 'name',
                valueField: 'surname',
                queryMode: 'local',
                typeAhead: false,
                editable: false
            },
            {
                iconCls: 'search'
            },'-',
            '-',
            {
                text: 'รายการทั้งหมด (รอจ่าย)',
                iconCls: 'list'
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