
var ReceivesStore = Ext.create('CloudHIS.store.ReceivesStore');

// Store for search products
var getProductStore = Ext.create('CloudHIS.store.ProductsStore');
// Store for get products in receive_details table
var getProductReceiveStore = Ext.create('CloudHIS.store.AddProductsReceivesStore');
var companyStore = Ext.create('CloudHIS.store.CompanyStore');

getProductStore.load();
companyStore.load();
ReceivesStore.load();



// Window Add product

var winAddProduct = new Ext.create('Ext.window.Window', {
    title: 'เพิ่มรายการสินค้า',

    modal: true,
    closeAction: 'hide',
    width: 460,
    layout: 'fit',

    listeners: {
        close: function() {
            Ext.getCmp('recvAddProductPrice001').setValue();
            Ext.getCmp('recvAddProductQty001').setValue();
        }
    },
    items:[
        new Ext.create('Ext.form.Panel', {

            title: 'ข้อมูลเกี่ยวกับสินค้า' ,
            id: 'recvFromAddNewProducts001',

            url: '/receive_details',
            method: 'post',

            bodyPadding: 20,
            fieldDefaults: {
                width: 400,
                labelAlign: 'top'
            },
            items:[
                {
                    xtype: 'combo',
                    store: getProductStore,
                    fieldLabel: 'รายการสินค้า',
                    displayField: 'name',
                    valueField: 'id',
                    queryMode: 'local',
                    editable: true,
                    typeAhead: true,
                    allowBlank: false ,
                    name: 'product_id',
                    listeners: {
                        select: function(combo, record, obj) {
                            //console.log(record[0].data.name);
                            Ext.getCmp('recvAddProductPrice001').setValue(record[0].data.price);
                            Ext.getCmp('recvAddProductQty001').setValue(1);
                            
                            var valSess = Ext.getCmp('recvIdSession001').getValue();
            				Ext.getCmp('recvProductsSSES001').setValue(valSess);

                        }
                    }
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'ราคา',
                            name: 'price',
                            allowBlank: false,
                            id: 'recvAddProductPrice001',
                            width: 200, maxValue: 99999999, minValue: 1
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'จำนวน',
                            name: 'qty',
                            id: 'recvAddProductQty001',
                            allowBlank: false,
                            width: 200, maxValue: 9999999, minValue: 1
                        }
                    ]
                },
                {
                    xtype: 'hiddenfield',
                    name: 'sess',
                    id: 'recvProductsSSES001'
                }
            ],
                buttons: [
					{
						text: 'เพิ่ม', iconCls: 'add',
						handler: function() {
						    //add product
						    var form = this.up('form').getForm();
						    form.submit({
						        success: function(f, a) {

						            getProductReceiveStore.load({
						                params: {
						                    sess: Ext.getCmp('recvIdSession001').getValue()
						                }
						            });

									/*
						            Ext.Msg.show({
						                title: 'ผลการบันทึกข้อมูล',
						                msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
						                buttons: Ext.Msg.OK,
						                icons: Ext.Msg.INFO
						            });
						            */
						            form.reset();
						            //this.up('window').destroy();
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
					}
				]
        })
    ]
});
// Window register
//Update product for receive products
function updateProductRecevie() {
	var grid = Ext.getCmp('recvGridMainReceiveProduct001'),
		    sm = grid.getSelectionModel(),
		    sl = sm.selected.get(0),

		    id = sl.data.id,
		    product_id = sl.data.product_id,
		    qty = sl.data.qty,
		    price = sl.data.price;
	// Window update product
	var winUpdateProductReceives = Ext.create('Ext.window.Window', {
		title: 'แก้ไขรายการสินค้า',

		modal: true,
		closeAction: 'hide',
		width: 460,
		layout: 'fit',

		items:[
		    {
				xtype: 'form',
		        title: 'ข้อมูลเกี่ยวกับสินค้า' ,
		        //id: 'recvFromUpdateProducts001',

		        url: '/receive_details/' + id,
		        method: 'put',

		        bodyPadding: 20,
		        fieldDefaults: {
		            width: 400,
		            labelAlign: 'top'
		        },
		        items:[
		            {
		                xtype: 'combo',
		                store: getProductStore,
		                fieldLabel: 'รายการสินค้า',
		                displayField: 'name',
		                valueField: 'id',
		                queryMode: 'local',
		                editable: true,
		                typeAhead: true,
		                allowBlank: false ,
		                name: 'product_id',
		                value: product_id,
		                readOnly: true
		            },
		            {
		                xtype: 'container',
		                layout: 'hbox',
		                items: [
		                    {
		                        xtype: 'numberfield',
		                        fieldLabel: 'ราคา',
		                        name: 'price',
		                        allowBlank: false,
		                        width: 200, maxValue: 99999999, minValue: 1,
		                        value: price
		                    },
		                    {
		                        xtype: 'numberfield',
		                        fieldLabel: 'จำนวน',
		                        name: 'qty',
		                        allowBlank: false,
		                        width: 200, maxValue: 9999999, minValue: 1,
		                        value: qty
		                    }
		                ]
		            }
		        ],
		        buttons: [
					{
						text: 'ปรับปรุง', iconCls: 'add',
						handler: function() {
						    //add product
						    //var form = Ext.getCmp('recvFromUpdateProducts001').getForm();
						    var form = this.up('form').getForm();
						    form.submit({
						        success: function(f, a) {

						            getProductReceiveStore.load({
						                params: {
						                    sess: Ext.getCmp('recvIdSession001').getValue()
						                }
						            });

									/*
						            Ext.Msg.show({
						                title: 'ผลการบันทึกข้อมูล',
						                msg: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
						                buttons: Ext.Msg.OK,
						                icons: Ext.Msg.INFO
						            });
						            */
						            winUpdateProductReceives.close();

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
					}
				]//button
		    }//end from
		],
		listeners: {
			close: function() {
				
			}
		}
	}).show();	
}//function updateProductRecevie
// Window register
var winAddProductReceive = new Ext.create('Ext.window.Window', {
    title: 'บันทึกสินค้าเข้าคลัง',
    modal: true,
    closeAction: 'hide',
    buttons: [
        {
            text: 'สร้างเอกสารใหม่',
            xtype: 'button',
            iconCls: 'refresh',
            id: 'recvButtonCreateNewDocuments',
            handler: function() {
                //create new document
                Ext.Ajax.request({
                    url: 'receives/sess',
                    success: function(response) {
                        Ext.getCmp('recvIdSession001').setValue(response.responseText);
                    }
                });
                Ext.getCmp('recvIdDateReceives001').setDisabled(false)
                Ext.getCmp('recvIdCompanyReceives001').setDisabled(false)
                Ext.getCmp('recvIdCodeReceives001').setDisabled(false)
                Ext.getCmp('recvButtonSaveReceivesProduct001').setDisabled(false)
                Ext.getCmp('recvButtonCancelReceivesProduct001').setDisabled(false)
                this.setDisabled(true);
            }
        },
        {
            xtype: 'textfield',
            id: 'recvIdSession001'
        }
        ,'->',
        {
            xtype: 'button',
            text: 'บันทึกรายการ', iconCls: 'add',
            id: 'recvButtonSaveReceivesProduct001',
            disabled: true, handler: function() {
                var recvIdSession = Ext.getCmp('recvIdSession001').getValue();
                if ( !recvIdSession ) {
                    Ext.Msg.alert('พบข้อผิดพลาด',
                    'กรุณากรุณาคลิกปุ่ม สร้างเอกสารใหม่');
                }else {
                    var receive_date = Ext.getCmp('recvIdDateReceives001').getValue(),
                    	company_id = Ext.getCmp('recvIdCompanyReceives001').getValue(),
                    	receive_code = Ext.getCmp('recvIdCodeReceives001').getValue(),
                    	sess = Ext.getCmp('recvIdSession001').getValue();
						if(!company_id){
							alert('กรุณาเลือกชื่อร้านค้า');
							Ext.getCmp('recvIdCompanyReceives001').focus();
							return false;
						}
                    	//Send data to server
                    	Ext.Ajax.request({
                    		url: 'receive_details/save',
                    		method: 'post',
                    		params: {
                    			sess: sess,
                    			company_id: company_id,
                    			receive_code: receive_code,
                    			receive_date: receive_date
                    		},
                    		success: function(response){
                    			if( response.responseText == 'ok' ) {
                    				Ext.Msg.alert('ผลการบันทึก', 'บันทึกข้อมูลเรียบร้อยแล้ว');	
                    				//clear data
                    				Ext.getCmp('recvIdSession001').setValue();
                    				Ext.getCmp('recvIdCompanyReceives001').clearValue();
                    				Ext.getCmp('recvIdCodeReceives001').setValue();
                    				
                    				Ext.getCmp('recvIdDateReceives001').setDisabled(true)
									Ext.getCmp('recvIdCompanyReceives001').setDisabled(true)
									Ext.getCmp('recvIdCodeReceives001').setDisabled(true)
									Ext.getCmp('recvButtonSaveReceivesProduct001').setDisabled(true)
									Ext.getCmp('recvButtonCancelReceivesProduct001').setDisabled(true)
									Ext.getCmp('recvButtonCreateNewDocuments').setDisabled(false)
                    				
                    				getProductReceiveStore.load({
											params: {
											    sess: 'no'
											}
									});
                    			}else{
                    				Ext.Msg.alert('ผลการบันทึก', 'เกิดข้อผิดพลาด : ' + response.responseText);
                    			}
                    				
                    		},
                    		failure: function(result, request) {
                    			Ext.Msg.alert('เกิดข้อผิดพลาด', 
                    			'Server error: ' + result.status + ' - ' + result.statusText
                    			);	
                    		}
                    	});
                }
            }
        },
        {
            text: 'ยกเลิก', iconCls: 'refresh',
            id: 'recvButtonCancelReceivesProduct001',
            disabled: true, handler: function() {
            	var sess = Ext.getCmp('recvIdSession001').getValue();
            	Ext.Msg.show({
            		title: 'ยกเลิกรายการทั้งหมด',
            		msg: 'คุณต้องการยกเลิกรายการทั้งหมดนี้ใช่หรือไม่?',
            		buttonText: {
                        yes: 'ใช่',
                        no: 'ไม่ใช่'
                    },
                    waitMsg: 'กำลังลบข้อมูล...',
                    fn: function(btn){
                        if(btn == 'yes'){
                            Ext.Ajax.request({
                                url: '/receive_details/cleartemp',
                                method: 'post',
                                params: {
                                	sess: sess
                                },
                                success: function(resp) {
                                    var resp = resp.responseText;
                                    if(resp == 'ok'){
                                        //Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
                                        //load data store
                                        //clear data
		                				Ext.getCmp('recvIdSession001').setValue();
		                				Ext.getCmp('recvIdCompanyReceives001').clearValue();
		                				Ext.getCmp('recvIdCodeReceives001').setValue();
		                				
		                				Ext.getCmp('recvIdDateReceives001').setDisabled(true)
										Ext.getCmp('recvIdCompanyReceives001').setDisabled(true)
										Ext.getCmp('recvIdCodeReceives001').setDisabled(true)
										Ext.getCmp('recvButtonSaveReceivesProduct001').setDisabled(true)
										Ext.getCmp('recvButtonCancelReceivesProduct001').setDisabled(true)
										Ext.getCmp('recvButtonCreateNewDocuments').setDisabled(false)
									
                                     	getProductReceiveStore.load({
											params: {
											    sess: 'no'
											}
										});   
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
            	});
            }
        },
        {
            text: 'ปิดหน้าต่าง', iconCls: 'close',
            handler: function() {
                winAddProductReceive.close();
            }
        }
    ],
    items: [
         {
            xtype: 'grid',
            title: 'รายการสินค้าที่รับเข้าคลัง',
            //iconCls: 'list',
            width: 780,
            height: 400,
            frame: false,
            id: 'recvGridMainReceiveProduct001',

            store: getProductReceiveStore,
            columns: [
                {
                    xtype: 'rownumberer', text: 'ลำดับ', flex: .5
                },
                {
                    text: 'id' ,flex: 1, dataIndex: 'id', hidden: true
                },
                {
                    text: 'product_id' ,flex: 1, dataIndex: 'product_id', hidden: true
                },
                {
                    text: 'รหัสสินค้า' ,flex: 1, dataIndex: 'code'
                },
                {
                    text: 'ชื่อสินค้า' ,flex: 2, dataIndex: 'name'
                },
                {
                    text: 'จำนวน' ,flex: .5, dataIndex: 'qty',
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
                    width: 160, allowBlank: false,
                    id: 'recvIdDateReceives001',
                    disabled: true
                },'-',
                {
                    xtype: 'combo',
                    store: companyStore,
                    labelAlign: 'left',
                    labelWidth: 80,
                    fieldLabel: 'บริษัท/ร้านค้า',
                    displayField: 'name',
                    valueField: 'id',
                    queryMode: 'local',
                    typeAhead: false,
                    editable: false,
                    width: 350,
                    disabled: true,
                    id: 'recvIdCompanyReceives001'
                }, '->',
                {
                    xtype: 'textfield',
                    fieldLabel: 'เลขที่เอกสาร',
                    readOnly: false,
                    allowBlank: true,
                    labelWidth: 70,
                    disabled: true,
                    id: 'recvIdCodeReceives001'
                }
            ],
             bbar: [
                {
                    text: 'เพิ่มรายการ',
                    iconCls:'paste',
                    handler: function(){
                        winAddProduct.show();
                    }
                },'-',
                {
                    text: 'ลบรายการ',
                    iconCls:'close',
                    handler: function() {
						
                        var grid = Ext.getCmp('recvGridMainReceiveProduct001'),
                            sm = grid.getSelectionModel();               
						if(sm.getCount() <= 0) {
							Ext.Msg.alert('ไม่พบรายการ', 'กรุณาเลือกรายการที่ต้องการลบ');
						}else {
						
						    var sl = sm.selected.get(0),
							id = sl.data.id;
							
							Ext.Msg.show({
		                        title: 'ยืนยันการลบ',
		                        msg: 'คุณต้องการลบรายการนี้ใช่หรือไม่',
		                        buttonText: {
		                            yes: 'ใช่',
		                            no: 'ไม่ใช่'
		                        },
		                        waitMsg: 'กำลังลบข้อมูล...',
		                        fn: function(btn){
		                            if(btn == 'yes'){
		                                Ext.Ajax.request({
		                                    url: '/receive_details/' + id,
		                                    method: 'delete',
		                                    success: function(resp) {
		                                        var resp = resp.responseText;
		                                        if(resp == 'ok'){
		                                            //Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
		                                            //load data store
		                                         	getProductReceiveStore.load({
														params: {
														    sess: Ext.getCmp('recvIdSession001').getValue()
														}
													});   
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
		                    });
						}
                    }
                },'-',
                {
                    text: 'แก้ไข',
                    iconCls:'list',
                    handler: function() {
                    var grid = Ext.getCmp('recvGridMainReceiveProduct001'),
                        sm = grid.getSelectionModel();
                                       
						if(sm.getCount() <= 0) {
							Ext.Msg.alert('ไม่พบรายการ', 'กรุณาเลือกรายการที่ต้องการแก้ไข');
						}else {
                    		updateProductRecevie();
                    	}
                    }
                }
             ],
             listeners: {
             	itemdblclick: function(grid, record) {
             		updateProductRecevie();	
             	}
             }
        }
    ],
    listeners: {
        close: function() {
            Ext.getCmp('recvIdSession001').setValue('');
            Ext.getCmp('recvIdCodeReceives001').setValue('');
            Ext.getCmp('recvIdCompanyReceives001').clearValue();
        },
        show: function() {
        	//load empty data
        	getProductReceiveStore.load({
			    params: {
			        sess: 'no'
			    }
			});
			Ext.getCmp('recvIdDateReceives001').setDisabled(true)
			Ext.getCmp('recvIdCompanyReceives001').setDisabled(true)
			Ext.getCmp('recvIdCodeReceives001').setDisabled(true)
			Ext.getCmp('recvButtonSaveReceivesProduct001').setDisabled(true)
			Ext.getCmp('recvButtonCancelReceivesProduct001').setDisabled(true)
			this.setDisabled(false);
        }
    }
});


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
                iconCls:'paste',
                handler: function() {
                    winAddProductReceive.show();
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
                text: 'รีเฟรช',
                iconCls: 'refresh'
            }
	    ]
	}
    ]
});
