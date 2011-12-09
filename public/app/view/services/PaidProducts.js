var paidStoreProducts = Ext.create('CloudHIS.store.AddProductsPaidsStore');
var getProductStore = Ext.create('CloudHIS.store.ProductsStore');

getProductStore.load();

paidStoreProducts.load({
	params: {
		sess: 'no'
	}
});
//win add products
var winPaidAddProduct = new Ext.create('Ext.window.Window', {
    title: 'เพิ่มรายการสินค้า',

    modal: true,
    closeAction: 'hide',
    width: 460,
    layout: 'fit',

    listeners: {
        close: function() {
            //Ext.getCmp('paidAddProductPrice001').setValue();
            Ext.getCmp('paidAddProductQty001').setValue('1');
        },
        open: function() {
        	var valSess = Ext.getCmp('paidSESS001').getValue();
         	Ext.getCmp('paidProductsSSES001').setValue(valSess);
        }
    },
    items:[
        new Ext.create('Ext.form.Panel', {

            title: 'ข้อมูลเกี่ยวกับสินค้า' ,
            id: 'paidFromAddNewProducts001',

            url: '/paids/saveproducts',
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
                            Ext.getCmp('paidAddProductPrice001').setValue(record[0].data.price);
                            Ext.getCmp('paidAddProductQty001').setValue(1);
                            
                            var valSess = Ext.getCmp('paidSESS001').getValue();
            				Ext.getCmp('paidProductsSSES001').setValue(valSess);

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
                            id: 'paidAddProductPrice001',
                            width: 200, maxValue: 99999999, minValue: 1
                        },
                       
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'จำนวน',
                            name: 'qty',
                            id: 'paidAddProductQty001',
                            allowBlank: false,
                            value: '1',
                            width: 200, maxValue: 9999999, minValue: 1
                        }
                    ]
                },
                {
                    xtype: 'hiddenfield',
                    name: 'sess',
                    id: 'paidProductsSSES001'
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

						            paidStoreProducts.load({
						                params: {
						                    sess: Ext.getCmp('paidSESS001').getValue()
						                }
						            });
						            form.reset();
						            winPaidAddProduct.close();
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
});// WinAddProduct
function updateProductPaid() {
	var grid = Ext.getCmp('paidGridMainPaidProduct001'),
		    sm = grid.getSelectionModel(),
		    sl = sm.selected.get(0),

		    id = sl.data.id,
		    product_id = sl.data.product_id,
		    qty = sl.data.qty,
		    price = sl.data.price;
	// Window update product
	var winUpdateProductPaid = Ext.create('Ext.window.Window', {
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

		        url: '/paids/' + id,
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

						            paidStoreProducts.load({
						                params: {
						                    sess: Ext.getCmp('paidSESS001').getValue()
						                }
						            });
						            winUpdateProductPaid.close();

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
}//function updateProductPaid
function deleteProductPaid() {					
	var grid = Ext.getCmp('paidGridMainPaidProduct001'),
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
	                    url: '/paids/' + id,
	                    method: 'delete',
	                    success: function(resp) {
	                        var resp = resp.responseText;
	                        if(resp == 'ok'){
	                            //Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
	                            //load data store
	                         	paidStoreProducts.load({
									params: {
									    sess: Ext.getCmp('paidSESS001').getValue()
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
// Clear all product in session
function ClearCurrentSession() {
	Ext.Msg.show({
        title: 'ยืนยันการลบ',
        msg: 'คุณต้องการลบรายการทั้งหมดใช่หรือไม่',
        buttonText: {
            yes: 'ใช่',
            no: 'ไม่ใช่'
        },
        waitMsg: 'กำลังลบข้อมูล...',
        fn: function(btn){
            if(btn == 'yes'){
                Ext.Ajax.request({
                    url: '/paids/cleartemp',
                    method: 'delete',
                    params: {
                    	sess: Ext.getCmp('paidSESS001').getValue()
                    },
                    
                    success: function(resp) {
                        var resp = resp.responseText;
                        if(resp == 'ok'){
                            //Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
                            //load data store
                         	paidStoreProducts.load({
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
//set disable button
function disbledButton() {
	Ext.getCmp('pdAddProduct001').setDisabled(true)		    		
	Ext.getCmp('pdEditProduct001').setDisabled(true)	
	Ext.getCmp('pdRemoveProduct001').setDisabled(true)	
	Ext.getCmp('pdClearAllProduct001').setDisabled(true)	
	Ext.getCmp('pdGenerateSession').setDisabled(false)
	Ext.getCmp('pdPaidProductSession').setDisabled(true)    	 		    		
}

function enabledButton() {
	Ext.getCmp('pdAddProduct001').setDisabled(false)		    		
	Ext.getCmp('pdEditProduct001').setDisabled(false)	
	Ext.getCmp('pdRemoveProduct001').setDisabled(false)	
	Ext.getCmp('pdClearAllProduct001').setDisabled(false)	  
	Ext.getCmp('pdGenerateSession').setDisabled(true) 
	Ext.getCmp('pdPaidProductSession').setDisabled(false)   		    		
}


Ext.define('CloudHIS.view.services.PaidProducts', {
    extend: 'CloudHIS.view.Container',
    
    items: [
	{
	    xtype: 'grid',
	    title: 'บันทึกการจ่ายพัสดุให้หน่วยงาน',
        //iconCls: 'list',
	    width: 750,
	    height: 400,
	    frame: false,
	    id: 'paidGridMainPaidProduct001',
	    
	    store: paidStoreProducts,
	    columns: [
            {
                xtype: 'rownumberer', text: 'ลำดับ', flex: .5
            },
            {
            	text: 'id', dataIndex: 'id', hidden: true
            },
            {
            	text: 'product_id', dataIndex: 'product_id', hidden: true
            },
            {
                text: 'รหัสสินค้า' ,flex: .8, dataIndex: 'code'
            },
            {
                text: 'ชื่อสินค้า' ,flex: 2, dataIndex: 'name'
            },
            {
                text: 'จำนวน' ,flex: .5, dataIndex: 'qty'
            },
            {
                text: 'ราคา' ,flex: .7, dataIndex: 'price',
                renderer: Ext.util.Format.numberRenderer('0,0'),
                align: 'right'
            },
            {
                text: 'รวมเป็นเงิน' ,flex: .7, dataIndex: 'total',
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
                allowBlank: false,
                name: 'paid_date',
                id: 'paidDatePaid001'
            }, '-',
            {
            	xtype: 'combo',
            	store: new Ext.create('CloudHIS.store.DepartmentsStore'),
            	fieldLabel: 'หน่วยเบิก',
            	valueField: 'id',
            	displayField: 'name',
            	allowBlank: false,
            	width: 300,
            	labelWidth: 70,
            	name: 'department_id',
            	id: 'paidDepartmentId001'
            }, '-',
            {
				text: 'เริ่มใหม่', handler: function() {
					Ext.Ajax.request({
	                    url: 'receives/sess',
	                    success: function(response) {
	                        Ext.getCmp('paidSESS001').setValue(response.responseText);
	                    }
	                });
	                
	                enabledButton();
				},
				iconCls: 'bookmark',
				id: 'pdGenerateSession'
			},
			{
				text: 'จ่ายวัสดุ',
				id: 'pdPaidProductSession', disabled: true,
				iconCls: 'retweet',
				handler: function() {
					var x = Ext.getCmp('paidDatePaid001').getValue();
					var y = Ext.getCmp('paidDepartmentId001').getValue();
					var s = Ext.getCmp('paidSESS001').getValue();
					var grid = Ext.getCmp('paidGridMainPaidProduct001'),
					    c = grid.store.totalCount;
		    
					if(!x){
						Ext.Msg.alert('ข้อมูลไม่สมบูรณ์', 'กรุณาเลือกวันที่');
					}else if(!y){
						Ext.Msg.alert('ข้อมูลไม่สมบูรณ์', 'กรุณาเลือกแผนกที่ต้องการจ่าย');
					}else if(!s){
						Ext.Msg.alert('ข้อมูลไม่สมบูรณ์', 'กรุณาคลิกปุ่มเริ่มใหม่');
					}else if(!c) {
						Ext.Msg.alert('ข้อมูลไม่สมบูรณ์', 'ไม่พบรายการสินค้าที่ต้องการจ่าย');
					}else{
						Ext.Msg.show({
							title: 'ยืนยัการจ่ายวัสดุ',
							msg: 'คุณต้องการจ่ายวัสดุให้กับหน่วยงานนี้ใช่หรือไม่',
							buttonText: {
								yes: 'ใช่',
								no: 'ไม่ใช่'
							},
							waitMsg: 'กำลังบันทึก...',
							fn: function(btn) {
								if (btn == 'yes') {
									Ext.Ajax.request({
										url: 'paids/save',
										method: 'post',
										params: {
											paid_date: Ext.getCmp('paidDatePaid001').getValue(),
											department_id: Ext.getCmp('paidDepartmentId001').getValue(),
											sess: Ext.getCmp('paidSESS001').getValue()
										},
										success: function(resp) {
					                        var resp = resp.responseText;
					                        if(resp == 'ok'){
					                            //Ext.Msg.alert('ผลการลบ','ลบรายการเรียบร้อยแล้ว.');
					                            //load data store
					                         	paidStoreProducts.load({
													params: {
													    sess: 'no'
													}
												});  
												disbledButton(); 
					                        }else{
					                            Ext.Msg.alert('เกิดข้อผิดพลาด', resp);
					                            enabledButton();
					                        }
					                    },
					                    failure: function(result, request) {
					                    	enabledButton();
					                        Ext.Msg.alert(
					                            'เกิดข้อผิดพลาด',
					                            'Server error: ' + result.status + ' - ' + result.statusText
					                        );
					                    }
									});
								}
							}
						});	
					}

				}
			}
	    ],
	    bbar: [
	    	{
	    		text: 'เพิ่มรายการ', disabled: true,
	    		iconCls: 'add', handler: function() {
	    			winPaidAddProduct.show();
	    		},
	    		id: 'pdAddProduct001'
	    	},
	    	{
	    		text: 'แก้ไข', disabled: true,
	    		iconCls: 'edit',
	    		handler: function(){
	    			updateProductPaid();
	    		},
	    		id: 'pdEditProduct001'
	    	},
	    	{
	    		text: 'ลบรายการ',
	    		iconCls: 'remove',
	    		handler: function() {
					deleteProductPaid();
				},
				id: 'pdRemoveProduct001',
				disabled: true
	    	},'->',
			{
				text: 'ยกเลิกการทั้งหมด', disabled: true,
				iconCls: 'refresh',
				handler: function() {
					ClearCurrentSession();
				},
				id: 'pdClearAllProduct001'
			},
	    	{
	    		xtype: 'hiddenfield',
	    		id: 'paidSESS001'
	    	}
	    ],
	    listeners: {
	    	itemdblclick: function() {
	    		updateProductPaid();
	    	}
	    }
	}
    ]
});
