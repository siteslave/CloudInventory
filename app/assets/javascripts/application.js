Ext.Loader.setConfig({ enabled: true });
Ext.application({
    name: 'CloudHIS',
    appFolder: 'app',
    controllers: [
        'Main',
        'Departments',
        'Services',
        'UnitCount'
    ],
    launch: function() {
        Ext.create('CloudHIS.view.Viewport');
    }
});