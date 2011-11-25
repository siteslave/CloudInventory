/**
 * Created by Mr.Satit Rianpit.
 */

Ext.require(
	'Ext.window.*'
);

var CompanyStore = Ext.create('CloudHIS.store.CompanyStore');

//load store.
CompanyStore.load();
    
// Add Company.
var addCompany = function() {

    var winAddCompany = Ext.create( 'Ext.window.Window', {
        title: 'เพิ่มบริษัท/ร้านค้า',
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
                    var frmAdd = Ext.getCmp('company-add-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                CompanyStore.load();

                                winAddCompany.destroy();
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
                    winAddCompany.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับบริษัท/ร้านค้า' ,
                id: 'company-add-form-main',

                url: '/companies',
                method: 'post',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อบริษัท',
                        name: 'name',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อผู้ติดต่อ',
                        name: 'contact_name',
                        allowBlank: true
                    },
                    {
                        xtype: 'textareafield',
                        fieldLabel: 'ที่อยู่',
                        name: 'address',
                        allowBlank: false
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'telephone',
                                fieldLabel: 'หมายเลขโทรศัพท์',
                                width: 200
                            },
                            {
                                xtype: 'textfield',
                                name: 'fax',
                                fieldLabel: 'หมายเลขแฟกซ์',
                                width: 200
                            }
                        ]
                    }

                ]
            })
        ]
    } );

		//open window
    winAddCompany.show();
}
// update Company.
var updateCompany = function() {

    var grid = Ext.getCmp('company_grid_main'),
        sm = grid.getSelectionModel(),
        sl = sm.selected.get(0),

        name = sl.data.name,
        contact_name = sl.data.contact_name,
        address = sl.data.address,
        telephone = sl.data.telephone,
        fax = sl.data.fax,
        id = sl.data.id;

    var winUpdateCompany = Ext.create( 'Ext.window.Window', {
        title: 'แก้ไขข้อมูลบริษัท/ร้านค้า',
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
                /*
                var Category = Ext.ModelMgr.getModel('CloudHIS.model.CategoryModel');
                */
                

                    var frmUpdate = Ext.getCmp('company-update-form-main').getForm();

                        frmUpdate.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmUpdate.reset();
                                winUpdateCompany.destroy();
                                CompanyStore.load();

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
                    winUpdateCompany.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับบริษัท/ร้านค้า' ,
                id: 'company-update-form-main',

                url: '/companies/' + id,
                method: 'put',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อบริษัท',
                        name: 'name',
                        allowBlank: false,
                        value: name
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อผู้ติดต่อ',
                        name: 'contact_name',
                        allowBlank: true,
                        value: contact_name
                    },
                    {
                        xtype: 'textareafield',
                        fieldLabel: 'ที่อยู่',
                        name: 'address',
                        allowBlank: false,
                        value: address
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'telephone',
                                fieldLabel: 'หมายเลขโทรศัพท์',
                                width: 200, value: telephone
                            },
                            {
                                xtype: 'textfield',
                                name: 'fax',
                                fieldLabel: 'หมายเลขแฟกซ์',
                                width: 200, value: fax
                            }
                        ]
                    }

                ]
            })
        ]
    } );

    winUpdateCompany.show();
}
// Delete company
var deleteCompany = function() {
    var grid = Ext.getCmp('company_grid_main'),
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
                    url: '/companies/' + id,
                    method: 'delete',
                    success: function(resp) {
                        var resp = resp.responseText;
                        if(resp == 'ok'){
                            Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
                            CompanyStore.load();
                        }else{
                            Ext.Msg.alert('ผลการลบ', resp);
                        }
                    }
                });
            }
        },
        icons: Ext.Msg.QUESTION
    })
}//deleteCompany
Ext.define('CloudHIS.view.basic.Company', {
    extend: 'CloudHIS.view.Container',

    items: [
	{
	    xtype: 'grid',
	    title: 'รายการบริษัท/ร้านค้า',
	    id: 'company_grid_main',

        //iconCls: 'list',
	    width: 680,
	    height: 400,
	    frame: true,
	    margin: 5,

	    store: CompanyStore,
	    columns: [
		{xtype: 'rownumberer', text: 'ลำดับ'},
		{
            text: 'ชื่อบริษัท/ร้านค้า' ,flex: 1, dataIndex: 'name'
        },
		{
            text: 'ชื่อผู้ติดต่อ' ,flex: 1, dataIndex: 'contact_name'
        },
        {
            text: 'ที่อยู่', dataIndex: 'address'
        },
        {
            text: 'โทรศัพท์', dataIndex: 'telephone'
        },
        {
            text: 'แฟกซ์', dataIndex: 'fax'
        }
	    ],
	    tbar: [

            {
                text: 'เพิ่มรายการ',
                iconCls:'add',
                handler: addCompany
            },'-',
            {
                text: 'ยกเลิกรายการ',
                iconCls:'close',
                handler: deleteCompany
            },'-',
            {
                text: 'แก้ไขรายการ',
                iconCls:'edit',
                handler: updateCompany
            },'-',
            {
                text: 'พิมพ์รายการ',
                iconCls:'print'
            }
	    ],
	    listeners: {
		itemdblclick: updateCompany
	    }
	}
    ]
});
