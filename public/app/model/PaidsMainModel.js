Ext.define('CloudHIS.model.PaidsMainModel',{
    extend: 'Ext.data.Model',
    fields:[
        {name: 'id', type: 'int'},
        {name: 'department_name', type: 'string'},
        {name: 'paid_date', type: 'date'},
        {name: 'qty', type: 'double'},
        {name: 'price', type: 'double'}
    ]

});
