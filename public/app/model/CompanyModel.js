Ext.define('CloudHIS.model.CompanyModel',{
    extend: 'Ext.data.Model',
    fields:[
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'address', type: 'string'},
        {name: 'contact_name', type: 'string'},
        {name: 'telephone', type: 'string'},
        {name: 'fax', type: 'string'}
    ]

});
