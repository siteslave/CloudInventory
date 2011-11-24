/**
 * Created by Mr.Satit Rianpit.
 */

Ext.require(
	'Ext.window.*'
);
//Ext.data.StoreManager.lookup('simpsonsStore')
var UsersStore = Ext.create('CloudHIS.store.UsersStore');
var DepartmentStore = Ext.create('CloudHIS.store.DepartmentsStore');



UsersStore.load();

var addUsers = function() {

    var winaddUsers = Ext.create( 'Ext.window.Window', {
        title: 'เพิ่มผู้ใช้งาน',
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
                    var frmAdd = Ext.getCmp('users-add-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                UsersStore.load();

                                winaddUsers.destroy();


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
                    winaddUsers.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับผู้ใช้งาน' ,
                id: 'users-add-form-main',

                url: '/users',
                method: 'post',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อ - สกุล',
                        name: 'fullname',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อผู้ใช้งาน (ภาษาอังกฤษ)',
                        name: 'user_name',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'รหัสผ่าน',
                        name: 'user_pass',
                        allowBlank: false,
                        minLength: 4
                    },
                    {
                        xtype: 'combo',
                        store: 'DepartmentsStore',
                        fieldLabel: 'หน่วยงานสังกัด',
                        displayField: 'name',
                        valueField: 'id',
                        queryMode: 'local',
                        editable: false,
                        typeAhead: false,
                        allowBlank: false ,
                        name: 'department_id'
                    }
                ]
            })
        ]
    } );

    winaddUsers.show();
}//addUsers
//update unitcount
var updateUsers = function(id, fullname, user_name, active, department_id) {

    var winUpdateUsers = Ext.create( 'Ext.window.Window', {
        title: 'แก้ไขผู้ใช้งาน',
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
                    var frmAdd = Ext.getCmp('users-update-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                UsersStore.load();

                                winUpdateUsers.destroy();

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
                    winUpdateUsers.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับผู้ใช้งาน' ,
                id: 'users-update-form-main',

                url: '/users/' + id,
                method: 'put',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อ - สกุล',
                        name: 'fullname',
                        id: 'users-update-fullname',
                        allowBlank: false,
                        value: fullname
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อผู้ใช้งาน (ภาษาอังกฤษ)',
                        name: 'user_name',
                        id: 'users-update-username',
                        allowBlank: false,
                        value: user_name
                    },
                    {
                        xtype: 'combo',
                        store: 'DepartmentsStore',
                        fieldLabel: 'หน่วยงานสังกัด',
                        displayField: 'name',
                        valueField: 'id',
                        queryMode: 'local',
                        editable: false,
                        typeAhead: false,
                        allowBlank: false,
                        id: 'users-update-department',
                        value: department_id
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

    winUpdateUsers.show();

}//update unitcount
var deleteUsers = function(id, name) {
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
                    url: '/users/' + id,
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
}//deleteUnitCount
Ext.define('CloudHIS.view.basic.UsersGrid', {
    extend: 'CloudHIS.view.Container',

    items: [
	{
	    xtype: 'grid',
	    title: 'รายชื่อผู้ใช้งาน',
        id: 'users-main-grid',
        //iconCls: 'list',
	    width: 680,
	    height: 400,
	    frame: true,
	    margin: 5,

	    store: UsersStore,
	    columns: [
            {
                xtype: 'rownumberer', text: 'ลำดับ'
            },
            {
                text: 'ชื่อ - สกุล' ,flex: 1, dataIndex: 'fullname'
            },
            {
                text: 'ชื่อผู้ใช้งาน' ,flex: .7, dataIndex: 'user_name'
            },
            {
                text: 'หน่วยงานสังกัด' ,flex: 1, dataIndex: 'department_name'
            },
            {
                text: 'สถานะ' ,flex: .8, dataIndex: 'active',
                renderer: function(value) {
                    return value == 1 ? 'เปิดใช้งาน' : 'ระงับการใช้งาน'
                }
            },
            {
                text: 'ใช้งานล่าสุด', flex: 1, dataIndex: 'last_login',
                renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
            }
	    ],
	    tbar: [

            {
                text: 'เพิ่มรายการ',
                iconCls:'add',
                handler: addUsers
            },'-',
            {
                text: 'ยกเลิกรายการ',
                iconCls:'close',
                handler: function() {
                    var grid = Ext.getCmp('users-main-grid'),
                        sm = grid.getSelectionModel(),
                        sl = sm.selected.get(0),

                        fullname = sl.data.fullname,
                        id = sl.data.id;

                    deleteUnitCount(id, fullname);
                }
            },'-',
            {
                text: 'แก้ไขรายการ',
                iconCls:'edit',
                handler: function(){
                    var grid = Ext.getCmp('unitcount-main-grid'),
                        sm = grid.getSelectionModel(),
                        sl = sm.selected.get(0),

                        user_name = sl.data.user_name,
                        fullname = sl.data.fullname,
                        active = sl.data.active,
                        department_id = sl.data.department_id,
                        id = sl.data.id;

                    updateUsers(id, fullname, user_name, active, department_id);
                }
            },'-',
            {
                text: 'Refresh',
                iconCls: 'refresh',
                handler: function() {
                    UsersStore.load();
                }
            }
	    ],
        listeners: {
			itemdblclick: function(grid, record){
		    //console.log(record.get('id'));
            var id = record.get('id'),
                fullname = record.get('fullname'),
                user_name = record.get('user_name'),
                active = record.get('active'),
                department_id = record.get('department_id');

            updateUsers(id, fullname, user_name, active, department_id);

	        }
        }
    }
    ]
});
