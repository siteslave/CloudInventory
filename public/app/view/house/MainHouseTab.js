var toolbarItems = [
    {iconCls:'list', title: 'xxxxxx'},
    '-',
    {iconCls:'close'},
    {iconCls:'paste'},
    '-',
    {iconCls:'edit2'}
];

Ext.define('CloudHIS.view.house.MainHouseTab', {
    extend: 'CloudHIS.view.Container',
    
    items: [
        {
            xtype: 'tabpanel',
            frame: true,
            title: 'ข้อมูลหมู่บ้านและประชากรในเขตรับผิดชอบ',
            layout: 'fit',
            
            defaults: {
                bodyPadding: 0,
                autoScroll: true,
                styleHtmlContent: true
            },
            items: [
                {
                    title: 'ข้อมูลหมู่บ้านในเขต',
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'grid',
                                    title: 'หมู่บ้านในเขตรับผิดชอบ',
                                    width: 392,
                                    height: 390,
                                    store: 'Visit',
                                    frame: false,
                                    columns: [
                                        {header: 'รหัสหมู่บ้าน', dataIndex: 'name', width: 80},
                                        {header: 'หมู่ที่', dataIndex: 'name', width: 40},
                                        {header: 'ชื่อหมู่บ้าน', dataIndex: 'surname', width: 240}
                                    ]
                                },
                                {
                                    xtype: 'grid',
                                    title: 'บ้านในหมู่บ้านรับผิดชอบ',
                                    width: 390,
                                    height: 390,
                                    store: 'Visit',
                                    frame: false,
                                    columns: [
                                        {header: 'รหัสบ้าน', dataIndex: 'name', width: 100},
                                        {header: 'บ้านเลขที่', dataIndex: 'surname', width: 200},
                                        {header: 'จำนวนคน', dataIndex: 'surname', width: 50}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: 'ข้อมูลประชากรในเขต',
                    dockedItems: [
                        {
                            dock:'bottom', xtype:'toolbar', items: toolbarItems
                        }
                    ],
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'grid',
                            title: 'รายชื่อประชากรในเขตรับผิดชอบ',
                            dockedItems: [
                                {
                                    dock:'top', xtype:'toolbar',
                                    items: [
                                        {
                                            xtype: 'combo',
                                            store: 'Visit',
                                            fieldLabel: 'เลือกหมู่บ้าน',
                                            displayField: 'name',
                                            valueField: 'surname',
                                            queryMode: 'local',
                                            typeAhead: false
                                        },'-',
                                        {
                                            xtype: 'combo',
                                            store: 'Visit',
                                            fieldLabel: 'เลือกบ้าน',
                                            displayField: 'name',
                                            valueField: 'surname',
                                            queryMode: 'local',
                                            typeAhead: false
                                        }
                                    ]
                                }
                            ],
                            store: 'Visit',
                            frame: false,
                            columnLines: false,
                            columns: [
                                {header: 'เลขบัตรประชาชน', width: 110},
                                {header: 'คำนำ', width: 40},
                                {header: 'ชื่อ', dataIndex: 'name', width: 100},
                                {header: 'สกุล', dataIndex: 'surname', width: 100},
                                {header: 'เพศ', width: 40},
                                {header: 'วันเกิด', width: 50},
                                {header: 'อายุ', width: 40},
                                {header: 'ตำแหน่งในครอบครัว', dataIndex: 'surname', width: 140}
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});