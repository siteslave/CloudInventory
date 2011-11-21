/**
 * Created by Mr.Satit Rianpit.
 */

Ext.require(
	'Ext.window.*'
);
    /*
     * Events listening.
     */
// Add category.
var addCategories = function() {

    var winAddCategory = Ext.create( 'Ext.window.Window', {
        title: 'เพิ่มหมวดหมู่สินค้า',
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
                    var frmAdd = Ext.getCmp('cat-add-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();

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
                    winAddCategory.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับหมวดหมู่สินค้า' ,
                id: 'cat-add-form-main',

                url: '/category/doregister',
                method: 'post',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อหมวดหมู่สินค้า',
                        placeholder: 'พิมพ์ชื่อหมวดหมู่สินค้า',
                        name: 'name',
                        allowBlank: false
                    },
                    {
                        xtype: 'combo',
                        store: 'CategoriesTypesStore',
                        fieldLabel: 'ประเภทหมวดหมู่',
                        displayField: 'name',
                        valueField: 'id',
                        queryMode: 'local',
                        editable: false,
                        typeAhead: false,
                        name: 'type',
                        allowBlank: false
                    }

                ]
            })
        ]
    } );

    winAddCategory.show();
}
// update category.
var updateCategories = function(id, name, cat_type) {

    var winUpdateCategory = Ext.create( 'Ext.window.Window', {
        title: 'แก้ไขหมวดหมู่สินค้า',
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
                    var frmAdd = Ext.getCmp('cat-update-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();

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
                    winUpdateCategory.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับหมวดหมู่สินค้า' ,
                id: 'cat-update-form-main',

                url: '/category',
                method: 'put',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        readOnly: true,
                        id: 'txt-cat-update-cat-id',
                        name: 'id'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อหมวดหมู่สินค้า',
                        name: 'name',
                        id: 'txt-cat-update-cat-name',
                        allowBlank: false
                    },
                    {
                        xtype: 'combo',
                        store: 'CategoriesTypesStore',
                        id: 'cob-cat-update-cat-type',
                        fieldLabel: 'ประเภทหมวดหมู่',
                        displayField: 'name',
                        valueField: 'id',
                        queryMode: 'local',
                        editable: false,
                        typeAhead: false,
                        name: 'type',
                        allowBlank: false
                    }

                ]
            })
        ]
    } );

    var extcat_name = Ext.getCmp('txt-cat-update-cat-name'),
    extcat_id = Ext.getCmp('txt-cat-update-cat-id'),
    extcat_type = Ext.getCmp('cob-cat-update-cat-type');

    extcat_id.setValue(id);
    extcat_name.setValue(name);
    extcat_type.setValue(cat_type);

    winUpdateCategory.show();
}

Ext.define('CloudHIS.view.basic.CategoriesGrid', {
    extend: 'CloudHIS.view.Container',

    items: [
	{
	    xtype: 'grid',
	    title: 'รายการหมวดหมู่สินค้า',
        //iconCls: 'list',
	    width: 680,
	    height: 400,
	    frame: true,
	    margin: 5,

	    store: 'CategoryListStore',
	    columns: [
		{xtype: 'rownumberer', text: 'ลำดับ'},
		{
            text: 'ชื่อหมวดหมู่' ,flex: 1, dataIndex: 'name'
        },
		{
            text: 'ประเภทหมวดหมู่' ,flex: 1, dataIndex: 'categories_type_name'
            /*,
            renderer: function(value) {
                var combo = Ext.getCmp('xxxxx');
                var record = combo.findRecordByValue(value);
                return record.get(combo.displayField);
            }
            */
        },
        {
            text: 'cat_type_id', dataIndex: 'categories_type_id', hidden: true
        },
            {
            text: 'categories_id', dataIndex: 'id', hidden: true
        }
	    ],
	    tbar: [

            {
                text: 'เพิ่มรายการ',
                iconCls:'add',
                handler: addCategories
            },'-',
            {
                text: 'ยกเลิกรายการ',
                iconCls:'close'
            },'-',
            {
                text: 'แก้ไขรายการ',
                iconCls:'edit'
            },'-',
            {
                text: 'พิมพ์รายการ',
                iconCls:'print'
            }
	    ],
	    listeners: {
		itemdblclick: function(grid, record){
		    //console.log(record.get('id'));
            var id = record.get('id'),
                name = record.get('name'),
                cat_type = record.get('categories_type_id');

            updateCategories(id, name, cat_type);
		}
	    }
	}
    ]
});