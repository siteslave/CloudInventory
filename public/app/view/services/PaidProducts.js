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

Ext.define('CloudHIS.view.services.PaidProducts', {
    extend: 'CloudHIS.view.Container',
    
    items: [
	{
	    xtype: 'grid',
	    title: 'บันทึกการจ่ายพัสดุให้หน่วยงาน',
        //iconCls: 'list',
	    width: 660,
	    height: 400,
	    frame: false,
	    
	    store: paidStoreProducts,
	    columns: [
            {
                xtype: 'rownumberer', text: 'ลำดับ', flex: .5
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
                allowBlank: false
            }, '-',
            {
            	xtype: 'combo',
            	store: new Ext.create('CloudHIS.store.DepartmentsStore'),
            	fieldLabel: 'หน่วยเบิก',
            	valueField: 'id',
            	displayField: 'name',
            	allowBlank: false,
            	width: 350,
            	labelWidth: 70
            }
	    ],
	    bbar: [
	    	{
	    		text: 'เพิ่มรายการ',
	    		iconCls: 'add', handler: function() {
	    			winPaidAddProduct.show();
	    		}
	    	},
	    	{
	    		text: 'แก้ไข',
	    		iconCls: 'edit'
	    	},
	    	{
	    		text: 'ลบรายการ',
	    		iconCls: 'remove'
	    	},
	    	{
	    		xtype: 'textfield',
	    		id: 'paidSESS001'
	    	}
	    ]
	}
    ]
});
