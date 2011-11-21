Ext.define('CloudHIS.store.ToolTreeStore', {
    extend: 'Ext.data.TreeStore',
    
    root: {
        expanded: true,
        children: [
            {
                text: 'ข้อมูลผู้ใช้งาน', expanded: true,
                children: [
                    {
                        text: 'ข้อมูลส่วนตัว', leaf: true
                    },
                    {
                        text: 'เปลี่ยนรหัสผ่าน', leaf: true
                    }
                ]
            },
            {
                text: 'ค้นหาข้อมูลผู้ป่วย', leaf: true
            }
        ]
    }
});