Ext.define('CloudHIS.store.ServiceTreeStore', {
    extend: 'Ext.data.TreeStore',
    
    root: {
        expanded: true,
        children: [
            {
                text: 'เบิก-จ่าย วัสดุ/ครุภัณฑ์', leaf: true,
                id: 'svTreePaidGet'
            },
            {
                text: 'ประวัติการอนุมัติจ่าย', leaf: true
            },
            {
                text: 'ทะเบียนคุม', leaf: true
            },
            {
                text: 'จัดซื้อ-จัดจ้าง', expanded: true,
                children: [
                    {
                        text: 'รายการจัดซื้อ-จัดจ้าง', leaf: true
                    },
                    {
                        text: 'ใบเสนอราคา', leaf: true
                    },
                    {
                        text: 'ข้อตกลงซื้อขาย/สัญญาจ้าง', leaf: true
                    },
                    {
                        text: 'ใบตรวจรับพัสด/ใบตรวจรับงา', leaf: true
                    }
                ]
            },
            {
                text: 'ทะเบียนบัญชีทรัพย์สินและค่าเสื่อม', explanded: false,
                children: [
                    {
                        text: 'ทะเบียนอาคารและสิ่งปลูกสร้าง', leaf: true
                    },
                    {
                        text: 'ทะเบียนครุภัณฑ์', leaf: true
                    },
                    {
                        text: 'ค่าเสื่อม', leaf: true
                    },
                    {
                        text: 'รายงาน', explanded: false,
                        children: [
                            {
                                text: 'รายงานมูลค่าทรัพย์สินสุทธิ', leaf: true
                            }
                        ]
                    }

                ]
            },
            {
                text: 'ข้อมูลพื้นฐาน', expanded: false,
                children: [
                    {
                        text: 'หมวดหมู่สินค้า', leaf: true,
                        id: 'svTreeProductCategory'
                    },
                    {
                        text: 'รายการสินค้า', leaf: true
                    },
                    {
                        text: 'หน่วยนับ', leaf: true
                    },
                    {
                        text: 'หน่วยเบิก', leaf: true
                    },
                    {
                        text: 'เจ้าหน้าที่', leaf: true
                    },
                    {
                        text: 'งบประมาณ', leaf: true
                    }
                ]
            }
        ]
    }
});