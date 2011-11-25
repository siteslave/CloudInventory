/**
 * Created by Mr.Satit Rianpit.
 */

Ext.require(
	'Ext.window.*'
);
//Ext.data.StoreManager.lookup('simpsonsStore')
var ProductsStore = Ext.create('CloudHIS.store.ProductsStore');
var CategoryStore = Ext.create('CloudHIS.store.CategoryStore');
var UnitCountStore = Ext.create('CloudHIS.store.UnitCountStore');

// Load data store
ProductsStore.load();
CategoryStore.load();
UnitCountStore.load();

var addProduct = function() {

    var winAddProduct = Ext.create( 'Ext.window.Window', {
        title: 'เพิ่มสินค้าใหม่',
        width: 460,
        //height: 300,
        modal: true,
        closeAction: 'destroy',
        resizable: false,
        layout: 'fit',
        buttons: [
            {
                text: 'บันทึก',
                iconCls: 'add',
                handler: function() {
                    var frmAdd = Ext.getCmp('product-add-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                ProductsStore.load();

                                winAddProduct.close();

                            },

                            failure: function(f, a) {
                                var msg = '';
                                // switch failure type.
                                switch ( a.failureType ) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        msg = 'ข้อมูลไม่ถูกต้อง หรือ ไม่สมบูรณ์ \r กรุณาตรวจสอบใหม่';
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        msg = 'การเชื่อมต่อกับเซิร์ฟเวอร์มีปัญหา \r กรุณาตรวจสอบการเชื่อมต่ออินเตอร์เน็ต';
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                        msg = a.result.msg;
                                }
                                // display message.
                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'ไม่สามารถบันทึกข้อมูลได้ \n' + msg,
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.ERROR
                                });
                            }
                        });

                }
            },
            {
                text: 'ยกเลิก',
                iconCls: 'refresh'
            },
            {
                text: 'ปิดหน้าต่าง',
                iconCls: 'close',
                handler: function() {
                    winAddProduct.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับสินค้า' ,
                id: 'product-add-form-main',

                url: '/products',
                method: 'post',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'รหัสสินค้า',
                                name: 'fullname',
                                allowBlank: false,
                                width: 100, name: 'code'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'ชื่อสินค้า',
                                name: 'name',
                                allowBlank: false,
                                width: 310
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'price',
                                fieldLabel: 'ราคา', width: 100,
                                allowBlank: false
                            },
                            {
                                xtype: 'numberfield',
                                name: 'qty',
                                fieldLabel: 'จำนวน',
                                value: '0',
                                readOnly: true, width: 100
                            },
                            {
                                xtype: 'combo',
                                store: UnitCountStore,
                                fieldLabel: 'หน่วยเรียก',
                                displayField: 'name',
                                valueField: 'id',
                                queryMode: 'local',
                                editable: false,
                                typeAhead: false,
                                allowBlank: false ,
                                name: 'unit_count_id', width: 210
                            }
                        ]
                    },
                    {
                        xtype: 'combo',
                        store: CategoryStore,
                        fieldLabel: 'หมวดหมู่สินค้า',
                        displayField: 'name',
                        valueField: 'id',
                        queryMode: 'local',
                        editable: false,
                        typeAhead: false,
                        allowBlank: false ,
                        name: 'category_id',
                        width: 410
                    }
                ]
            })
        ]
    } );

    winAddProduct.show();
}//addProduct
//update Product
var updateProduct = function() {
    var grid = Ext.getCmp('product-main-grid'),
                sm = grid.getSelectionModel(),
                sl = sm.selected.get(0),

                id = sl.data.id,
                name = sl.data.name,
                code = sl.data.code,
                qty = sl.data.qty,
                price = sl.data.price,
                unit_count_id = sl.data.unit_count_id,
                category_id = sl.data.category_id;

    var winUpdateProduct = Ext.create( 'Ext.window.Window', {
        title: 'แก้ไขข้อมูลสินค้า',
        width: 460,
        //height: 300,
        modal: true,
        closeAction: 'destroy',
        resizable: false,
        layout: 'fit',
        buttons: [
            {
                text: 'บันทึก',
                iconCls: 'add',
                handler: function() {
                    var frmAdd = Ext.getCmp('product-update-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                ProductsStore.load();

                                winUpdateProduct.destroy();

                            },

                            failure: function(f, a) {
                                var msg = '';
                                // switch failure type.
                                switch ( a.failureType ) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        msg = 'ข้อมูลไม่ถูกต้อง หรือ ไม่สมบูรณ์ \r กรุณาตรวจสอบใหม่';
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        msg = 'การเชื่อมต่อกับเซิร์ฟเวอร์มีปัญหา \r กรุณาตรวจสอบการเชื่อมต่ออินเตอร์เน็ต';
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                        msg = a.result.msg;
                                }
                                // display message.
                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'ไม่สามารถบันทึกข้อมูลได้ \n' + msg,
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.ERROR
                                });
                            }
                        });

                }
            },
            {
                text: 'ปิดหน้าต่าง',
                iconCls: 'close',
                handler: function() {
                    winUpdateProduct.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับสินค้า' ,
                id: 'product-update-form-main',

                url: '/products/' + id,
                method: 'put',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'รหัสสินค้า',
                                name: 'fullname',
                                allowBlank: false,
                                width: 100,
                                value: code,
                                readOnly: true,
                                name: 'code'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'ชื่อสินค้า',
                                name: 'name',
                                allowBlank: false,
                                width: 310,
                                value: name
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'price',
                                fieldLabel: 'ราคา', width: 100,
                                allowBlank: false,
                                value: price
                            },
                            {
                                xtype: 'numberfield',
                                name: 'qty',
                                fieldLabel: 'จำนวน',
                                value: qty,
                                readOnly: true, width: 100
                            },
                            {
                                xtype: 'combo',
                                store: UnitCountStore,
                                fieldLabel: 'หน่วยเรียก',
                                displayField: 'name',
                                valueField: 'id',
                                queryMode: 'local',
                                editable: false,
                                typeAhead: false,
                                allowBlank: false ,
                                name: 'unit_count_id', width: 210,
                                value: unit_count_id
                            }
                        ]
                    },
                    {
                        xtype: 'combo',
                        store: CategoryStore,
                        fieldLabel: 'หมวดหมู่สินค้า',
                        displayField: 'name',
                        valueField: 'id',
                        queryMode: 'local',
                        editable: false,
                        typeAhead: false,
                        allowBlank: false ,
                        name: 'category_id',
                        width: 410, value: category_id
                    }
                ]
            })
        ]
    } );
    /*
    var idx = DepartmentStore.find('value',department_id);
    DepartmentStore.getAt(idx).data.label
    */
    /*
    var combo = Ext.getCmp('users-update-department');
    // Get attached store
    var store = combo.store;

    // This is the trick
    store.on("load", function(store, records, state, operation, opts) {
        this.setValue(department_id);
    });
    */

    winUpdateProduct.show();

}//update Product
var deleteProduct = function() {

    var grid = Ext.getCmp('product-main-grid'),
    sm = grid.getSelectionModel(),
    sl = sm.selected.get(0),

    name = sl.data.name,
    id = sl.data.id;

    Ext.Msg.show({
        title: 'ยืนยันการลบรายการ',
        msg: 'คุณต้องการลบรายการที่เลือกหรือไม่? [' + name + ']',
        buttonText: {
            yes: 'ใช่',
            no: 'ไม่ใช่'
        },
        waitMsg: 'กำลังลบข้อมูล...',
        fn: function(btn){
            if(btn == 'yes'){
                Ext.Ajax.request({
                    url: '/products/' + id,
                    method: 'delete',
                    success: function(resp) {
                        var resp = resp.responseText;
                        if(resp == 'ok'){
                            Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
                            UnitCountStore.load();
                        }else{
                            Ext.Msg.alert('ผลการลบ', resp);
                        }
                    },
                    failure: function(result, request) {
                        Ext.Msg.alert(
                            'เกิดข้อผิดพลาด',
                            'Server error: ' + result.status + ' - ' + result.statusText
                        );
                    }
                });
            }
        },
        icons: Ext.Msg.QUESTION
    })
}//deleteProduct

// Show stockcard
var showStockCard = function() {
    Ext.Msg.alert('Show stock card', 'Show stock card window.');
}// showStockCard

Ext.define('CloudHIS.view.Products', {
    extend: 'CloudHIS.view.Container',

    items: [
	{
	    xtype: 'grid',
	    title: 'รายการสินค้าทั้งหมด',
        id: 'product-main-grid',
        //iconCls: 'list',
	    width: 680,
	    height: 400,
	    frame: true,
	    margin: 5,

	    store: ProductsStore,
	    columns: [
            {
                xtype: 'rownumberer', text: 'ลำดับ', flex: .3
            },
            {
                text: 'รหัสสินค้า' ,flex: 1, dataIndex: 'code'
            },
            {
                text: 'ชื่อสินค้า' ,flex: 2, dataIndex: 'name'
            },
            {
                text: 'หน่วย' ,flex: .8, dataIndex: 'unit_count_name'
            },
            {
                text: 'หมวดหมู่' ,flex: 1, dataIndex: 'category_name'
            },
            {
                text: 'ราคา', flex: .5, dataIndex: 'price'
            },
            {
                text: 'คงเหลือ', flex: .5, dataIndex: 'qty'
            }
	    ],
	    tbar: [

            {
                text: 'เพิ่มรายการ',
                iconCls:'add',
                handler: addProduct
            },'-',
            {
                text: 'ยกเลิกรายการ',
                iconCls:'close',
                handler: deleteProduct
            },'-',
            {
                text: 'แก้ไขรายการ',
                iconCls:'edit',
                handler: updateProduct
            },'-',
            {
                text: 'Refresh',
                iconCls: 'refresh',
                handler: function() {
                    ProductsStore.load();
                }
            }
	    ],
        listeners: {
			itemdblclick: updateProduct,
            itemcontextmenu: function(grid, record, item, index, e, obj) {
                e.stopEvent();
                grid.getSelectionModel().selected.get(index);
                if(!this.ctxProductMainGrid) {
                    this.ctxProductMainGrid = new Ext.menu.Menu({
                       items: [
                           {
                               text: 'แก้ไขรายการ',
                               handler: updateProduct
                           },
                           {
                               text: 'ลบรายการสินค้า',
                               handler: deleteProduct
                           },
                           {
                               text: 'ดูข้อมูล Stock Card',
                               handler: showStockCard
                           }
                       ]
                    });
                }

                var xy = e.getXY();
                this.ctxProductMainGrid.showAt(xy);
            }
        }
    }
    ]
});
