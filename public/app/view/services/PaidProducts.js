var paidStoreMain = Ext.create('CloudHIS.store.PaidsStore');

paidStoreMain.load();
/*
var winPaidMain = new Ext.create('Ext.window.Window', {
	title: 'รายการจ่ายสินค้า',
	closeAction: 'destroy',
	modal: true,
	width: 760,
	height: 460
});
*/
Ext.define('CloudHIS.view.services.PaidProducts', {
    extend: 'CloudHIS.view.Container',
    
    items: [
	{
	    xtype: 'grid',
	    title: 'บันทึกการจ่ายพัสดุให้หน่วยงาน',
        //iconCls: 'list',
	    width: 660,
	    height: 400,
	    frame: false,
	    
	    store: paidStoreMain,
	    columns: [
            {
                xtype: 'rownumberer', text: 'ลำดับ', flex: .5
            },
            {
                text: 'รหัสสินค้า' ,flex: .8, dataIndex: 'receive_code'
            },
            {
                text: 'ชื่อสินค้า' ,flex: 2, dataIndex: 'receive_date',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')
            },
            {
                text: 'จำนวน' ,flex: .5, dataIndex: 'company_name'
            },
            {
                text: 'ราคา' ,flex: .7, dataIndex: 'total_qty',
                renderer: Ext.util.Format.numberRenderer('0,0'),
                align: 'right'
            },
            {
                text: 'รวมเป็นเงิน' ,flex: .7, dataIndex: 'total_price',
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
                allowBlank: false
            }, '-',
            {
            	xtype: 'combo',
            	store: paidStoreMain,
            	fieldLabel: 'หน่วยเบิก',
            	valueField: 'product_id',
            	displayField: 'company_name',
            	allowBlank: false,
            	width: 350,
            	labelWidth: 70
            }
	    ],
	    bbar: [
	    	{
	    		text: 'เพิ่มรายการ',
	    		iconCls: 'add'
	    	},
	    	{
	    		text: 'แก้ไข',
	    		iconCls: 'edit'
	    	},
	    	{
	    		text: 'ลบรายการ',
	    		iconCls: 'remove'
	    	}
	    ]
	}
    ]
});
