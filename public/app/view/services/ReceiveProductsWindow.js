// Store for search products
var getProductStore = Ext.create('CloudHIS.store.ProductsStore');
// Store for get products in receive_details table
var getProductReceiveStore = Ext.create('CloudHIS.store.ProductsReceiveFormStore');

getProductStore.load();

Ext.define('CloudHIS.view.services.ReceiveProductsWindow', {
    extend: 'CloudHIS.view.Container',
    items: [
        {
            xtype: 'window',
            title: 'บันทึกสินค้าเข้าคลัง',
            width: 470,
            height: 450,
            modal: true,
            items: [
                 {
                    xtype: 'grid',
                    title: 'ประวัติการรับวัสดุเข้าคลัง',
                    //iconCls: 'list',
                    width: 800,
                    height: 500,
                    frame: true,
                    margin: 5,
                    id: 'receiveAddProductMainGrid',

                    store: getProductReceiveStore,
                    columns: [
                        {
                            xtype: 'rownumberer', text: 'ลำดับ', flex: .5
                        },
                        {
                            text: 'รหัสสินค้า' ,flex: .8, dataIndex: 'code'
                        },
                        {
                            text: 'ชื่อสินค้า' ,flex: .5, dataIndex: 'name'
                        },
                        {
                            text: 'จำนวน' ,flex: 2, dataIndex: 'qty',
                            renderer: Ext.util.Format.numberRenderer('0,0'),
                            align: 'right'
                        },
                        {
                            text: 'ราคา' ,flex: .8, dataIndex: 'price',
                            renderer: Ext.util.Format.numberRenderer('0,0.00'),
                            align: 'right'
                        },
                        {
                            text: 'รวมเป็นเงิน' ,flex: .8, align: 'right', dataIndex: 'total',
                            renderer: Ext.util.Format.numberRenderer('0,0.00')

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
                            text: 'เพิ่ม',
                            iconCls:'paste'
                        },'-',
                        {
                            text: 'ลบรายการ',
                            iconCls:'close'
                        },'-',
                        {
                            text: 'แก้ไข',
                            iconCls:'list'
                        }
                    ]
                }
                ]
        }
    ]

});