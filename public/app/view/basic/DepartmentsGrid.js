/**
 * Created by Mr.Satit Rianpit.
 */

Ext.require(
	'Ext.window.*'
);
//Ext.data.StoreManager.lookup('simpsonsStore')
var DepartmentStore = Ext.create('CloudHIS.store.DepartmentsStore');

DepartmentStore.load();

var addDepartment = function() {

    var winAddDepartment = Ext.create( 'Ext.window.Window', {
        title: 'เพิ่มหมวดหน่วยเบิก',
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
                    var frmAdd = Ext.getCmp('dep-add-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                DepartmentStore.load();

                                winAddDepartment.destroy();


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
                    winAddDepartment.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับหน่วยเบิก' ,
                id: 'dep-add-form-main',

                url: '/department',
                method: 'post',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อหน่วยเบิก',
                        name: 'name',
                        allowBlank: false
                    }
                ]
            })
        ]
    } );

    winAddDepartment.show();
}//addDepartment
//update department 
var updateDepartment = function(id, name) {

    var winUpdateDepartment = Ext.create( 'Ext.window.Window', {
        title: 'เพิ่มหมวดหน่วยเบิก',
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
                    var frmAdd = Ext.getCmp('dep-add-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                DepartmentStore.load();
                                
                                winUpdateDepartment.destroy();
                                
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
                    winUpdateDepartment.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับหน่วยเบิก' ,
                id: 'dep-add-form-main',

                url: '/department/' + id,
                method: 'put',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        id: 'dep-update-name',
                        allowBlank: false
                    }

                ]
            })
        ]
    } );
		Ext.getCmp('dep-update-name').setValue(name);
    winUpdateDepartment.show();
}//update department
var deleteDepartment = function(id, name) {
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
                    url: '/department/' + id,
                    method: 'delete',
                    success: function(resp) {
                        var resp = resp.responseText;
                        if(resp == 'ok'){
                            Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
                            DepartmentStore.load();
                        }else{
                            Ext.Msg.alert('ผลการลบ', resp);
                        }
                    }
                });
            }
        },
        icons: Ext.Msg.QUESTION
    })
}//deleteDepartment
Ext.define('CloudHIS.view.basic.DepartmentsGrid', {
    extend: 'CloudHIS.view.Container',

    items: [
	{
	    xtype: 'grid',
	    title: 'รายชื่อแผนก',
        id: 'dep-main-grid',
        //iconCls: 'list',
	    width: 680,
	    height: 400,
	    frame: true,
	    margin: 5,

	    store: DepartmentStore,
	    columns: [
            {
                xtype: 'rownumberer', text: 'ลำดับ'},
            {
                text: 'ชื่อแผนก' ,flex: 1, dataIndex: 'name'
            }
	    ],
	    tbar: [

            {
                text: 'เพิ่มรายการ',
                iconCls:'add',
                handler: addDepartment
            },'-',
            {
                text: 'ยกเลิกรายการ',
                iconCls:'close',
                handler: function() {
                    var grid = Ext.getCmp('dep-main-grid'),
                        sm = grid.getSelectionModel(),
                        sl = sm.selected.get(0),

                        name = sl.data.name,
                        id = sl.data.id;

                    deleteDepartment(id, name);
                }
            },'-',
            {
                text: 'แก้ไขรายการ',
                iconCls:'edit',
                handler: function(){
                    var grid = Ext.getCmp('dep-main-grid'),
                        sm = grid.getSelectionModel(),
                        sl = sm.selected.get(0),

                        name = sl.data.name,
                        id = sl.data.id;

                    updateDepartment(id, name);
                }
            }
	    ],
        listeners: {
			itemdblclick: function(grid, record){
		    //console.log(record.get('id'));
            var id = record.get('id'),
                name = record.get('name');

            updateDepartment(id, name);

	        }
        }
    }
    ]
});
