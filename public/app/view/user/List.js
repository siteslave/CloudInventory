Ext.define('CloudHIS.view.user.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.userlist',
    
    title: 'All Users',
    
    initComponent: function() {
        this.store = {
            fields: ['name', 'email'],
            data: [
                {name: 'สถิตย์ เรียนพิศ', email: 'ed@ss.com'},
                {name: 'ปรเมศธ์ เอกอุ่น', email: 'aa@gg.com'}
            ]
        };
        
        this.columns = [
            {header: 'ชื่อ - สกุล', dataIndex: 'name', flex: 1},
            {header: 'อีเมล์', dataIndex: 'email', flex: 1}
        ];
        
        this.callParent(arguments);
    }
});