/**
 * Created by Mr.Satit Rianpit.
 */

Ext.require(
	'Ext.window.*'
);
//Ext.data.StoreManager.lookup('simpsonsStore')
var UnitCountStore = Ext.create('CloudHIS.store.UnitCountStore');

UnitCountStore.load();

var addUnitCount = function() {

    var winAddUnitCount = Ext.create( 'Ext.window.Window', {
        title: 'เพิ่มหน่วยนับ',
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
                    var frmAdd = Ext.getCmp('unitcount-add-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                UnitCountStore.load();

                                winAddUnitCount.destroy();


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
                    winAddUnitCount.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับหน่วยนับ' ,
                id: 'unitcount-add-form-main',

                url: '/unit_count',
                method: 'post',

                bodyPadding: 20,
                fieldDefaults: {
                    width: 400,
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'ชื่อหน่วยนับ',
                        name: 'name',
                        allowBlank: false
                    }
                ]
            })
        ]
    } );

    winAddUnitCount.show();
}//addUnitcount
//update unitcount
var updateUnitCount = function(id, name) {

    var winUpdateUnitCount = Ext.create( 'Ext.window.Window', {
        title: 'เพิ่มหมวดหน่วยนับ',
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
                    var frmAdd = Ext.getCmp('unitcount-add-form-main').getForm();

                        frmAdd.submit({

                            success: function(f, a) {

                                Ext.Msg.show({
                                    title: 'ผลการบันทึกข้อมูล',
                                    msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                                    buttons: Ext.Msg.OK,
                                    icons: Ext.Msg.INFO
                                });

                                frmAdd.reset();
                                UnitCountStore.load();

                                winUpdateUnitCount.destroy();

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
                    winUpdateUnitCount.destroy();
                }
            }
        ],
        items: [
            new Ext.create('Ext.form.Panel', {
                title: 'ข้อมูลเกี่ยวกับหน่วยเบิก' ,
                id: 'unitcount-add-form-main',

                url: '/unit_count/' + id,
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
                        id: 'unitcount-update-name',
                        allowBlank: false
                    }

                ]
            })
        ]
    } );

    Ext.getCmp('unitcount-update-name').setValue(name);
    winUpdateUnitCount.show();

}//update unitcount
var deleteUnitCount = function(id, name) {
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
                    url: '/unit_count/' + id,
                    method: 'delete',
                    success: function(resp) {
                        var resp = resp.responseText;
                        if(resp == 'ok'){
                            Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
                            UnitCountStore.load();
                        }else{
                            Ext.Msg.alert('ผลการลบ', resp);
                        }
                    }
                });
            }
        },
        icons: Ext.Msg.QUESTION
    })
}//deleteUnitCount
Ext.define('CloudHIS.view.basic.UnitCountGrid', {
    extend: 'CloudHIS.view.Container',

    items: [
	{
	    xtype: 'grid',
	    title: 'รายชื่อหน่วยนับ',
        id: 'unitcount-main-grid',
        //iconCls: 'list',
	    width: 680,
	    height: 400,
	    frame: true,
	    margin: 5,

	    store: UnitCountStore,
	    columns: [
            {
                xtype: 'rownumberer', text: 'ลำดับ'},
            {
                text: 'ชื่อหน่วยนับ' ,flex: 1, dataIndex: 'name'
            }
	    ],
	    tbar: [

            {
                text: 'เพิ่มรายการ',
                iconCls:'add',
                handler: addUnitCount
            },'-',
            {
                text: 'ยกเลิกรายการ',
                iconCls:'close',
                handler: function() {
                    var grid = Ext.getCmp('unitcount-main-grid'),
                        sm = grid.getSelectionModel(),
                        sl = sm.selected.get(0),

                        name = sl.data.name,
                        id = sl.data.id;

                    deleteUnitCount(id, name);
                }
            },'-',
            {
                text: 'แก้ไขรายการ',
                iconCls:'edit',
                handler: function(){
                    var grid = Ext.getCmp('unitcount-main-grid'),
                        sm = grid.getSelectionModel(),
                        sl = sm.selected.get(0),

                        name = sl.data.name,
                        id = sl.data.id;

                    updateUnitCount(id, name);
                }
            }
	    ],
        listeners: {
			itemdblclick: function(grid, record){
		    //console.log(record.get('id'));
            var id = record.get('id'),
                name = record.get('name');

            updateUnitCount(id, name);

	        }
        }
    }
    ]
});
