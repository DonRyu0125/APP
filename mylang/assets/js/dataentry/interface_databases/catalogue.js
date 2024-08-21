function CatalogueInterface(record, params) {
  ApplicationInterface.call(this, record, params);
  var app_interface = this;

  var component_params = {
    'component_save_form' : '',
    'component_mnemonics' : [''],
    'component_container' : '',
    'new_component_url' : function(sisn) {
      return "";
    },
    'component_edit_url' : function(sisn) {
      return "";
    }
  }

  // This is done to allow for extending `ApplicationInterface`s populateForm method.
  var basePopulateForm = this.populateForm;


  /*****
  **
  **  populateForm : Performs the same function as ApplicationInterface.populateForm, but also performs collections record specific interface handling
  **
  **  notes:
  **    - This will check if the currently loaded page is "Components", and if so, will populate the components page
  **
   *****/
  this.populateForm = function() {
    basePopulateForm();
  }
}