Ext.define('CloudHIS.controller.Services', {
    extend: 'Ext.app.Controller',
    
    stores: [
        'ServiceTreeStore',
        'Visit',
        'CategoriesTypesStore',
        'CategoryListStore'
    ],
    models: ['Visit'],
    requires: [],
    
    init: function(){
        this.control({
            'viewport servicetree': {
                /*
                'select': function(me, record, item, index, e) {
                    if (!record.isLeaf()) {
                        return false;
                    }else{
                        var className = '',

                        title = record.get('text');

                        switch(item) {
                            case 0:
                                className = 'CloudHIS.view.services.RequestGrid';
                                this.setActiveItem(className, title);

                                break;
                            case 3:
                                className = 'CloudHIS.view.basic.CategoriesGrid';
                                this.setActiveItem(className, title);

                                break;
                            case 5:
                                className = 'CloudHIS.view.house.MainHouseTab';
                                this.setActiveItem(className, title);

                                break;
                        }


                    }
                }
                */
            }
        });
    }


});