Ext.define('CloudHIS.model.PaidProductsModel',{
    extend: 'Ext.data.Model',
    fields:[
        {name: 'id', type: 'int'},
        {name: 'receive_date', type: 'date'},
        {name: 'company_id', type: 'int'},
        {name: 'company_name', type: 'string'},
        {name: 'receive_code', type: 'string'},
        {name: 'receive_detail_id', type: 'string'},
        {name: 'total_qty', type: 'double'},
        {name: 'total_price', type: 'double'}
    ]

});
