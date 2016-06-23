 angular.module("fragileApp")
 .run(function(editableOptions,editableThemes) {  editableOptions.theme = 'bs3';

       editableThemes['bs3'].submitTpl='<button class="btn btn-danger"  type="submit" ng-click="updateTodoItem(listItem,todo)">Save</button><button class="btn btn-danger btn-circle" ng-click="addMemberToChecklist(listItem)">...</button>';
     // bootstrap3 theme. Can be also 'bs2', 'default'
     })

.component("myCards",{
  templateUrl: "components/cards/cardsUI.view.html",
controller:"cardsUIController",
bindings:{
list:"<"
}
});
