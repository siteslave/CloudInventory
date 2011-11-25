Ext.require(
	    'Ext.window.*'
	    );
var ReceivesStore = Ext.create('CloudHIS.store.ReceivesStore');
ReceivesStore.load();

Ext.define('CloudHIS.view.services.ReceiveProducts', {
    extend: 'CloudHIS.view.Container',
    
    items: [
	{
	    xtype: 'grid',
	    title: 'ประวัติการรับวัสดุเข้าคลัง',
        //iconCls: 'list',
	    width: 800,
	    height: 500,
	    frame: true,
	    margin: 5,
	    id: 'receiveProductMainGrid',
	    
	    store: ReceivesStore,
	    columns: [
            {
                xtype: 'rownumberer', text: 'ลำดับ', flex: .5
            },
            {
                text: 'เลขที่เอกสาร' ,flex: .8, dataIndex: 'receive_code'
            },
            {
                text: 'วันที่บันทึก' ,flex: .5, dataIndex: 'receive_date',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')
            },
            {
                text: 'ชื่อบริษัท/ร้านค้า' ,flex: 2, dataIndex: 'company_name'
            },
            {
                text: 'จำนวนสินค้า' ,flex: .8, dataIndex: 'total_qty',
                renderer: Ext.util.Format.numberRenderer('0,0'),
                align: 'right'
            },
            {
                text: 'จำนวนเงิน' ,flex: .8, dataIndex: 'total_price',
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
                width: 160
            },
            {
                iconCls: 'search'
            },'-',

            {
                text: 'บันทึกรับวัสดุ',
                iconCls:'paste'
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
                text: 'รีเฟรช',
                iconCls: 'refresh'
            }
	    ]
	}
    ]
});