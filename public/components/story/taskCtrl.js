//refered from https://jsfiddle.net/toddmotto/xqauz9aa/?utm_source=website&utm_medium=embed&utm_campaign=xqauz9aa
//var app=angular.module('Todo', ['ngMaterial','ngMessages',"xeditable"])
  fragileApp.controller('mainCtrl', function ($scope) {

  })

        .component('mycard', {
        bindings: {
          checkListId:'<',
          task: '<',
          addMember:'&',
          removeTask:'&',
          editTask:'&'

        },
        controller: mycardCtrl,
        templateUrl:'components/story/task.html'

    });

//end of angular

 app.run(function(editableOptions,editableThemes) {  editableOptions.theme = 'bs3';

      editableThemes['bs3'].submitTpl='<button class="btn btn-danger"  type="submit" ng-click="updateTodoItem(listItem,todo)">Save</button><button class="btn btn-danger btn-circle" ng-click="addMemberToChecklist(listItem)">...</button>';
    // bootstrap3 theme. Can be also 'bs2', 'default'
    });

function mycardCtrl ($scope) {
    $scope.date = moment();
    var aFunction = function(){
     var newDate = moment(this.task.dueDate);
     $scope.date = newDate;
}
  var ctrl=this;
  console.log("hello",this.task.dueDate);
   $scope.myDate = new Date(this.task.dueDate);
  $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() - 2,
      $scope.myDate.getDate());
  $scope.maxDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() + 2,
      $scope.myDate.getDate());

    this.addMemberComp=function(obj)
    {
      // console.log("hoooollalla");
      // // console.log("its worfnekiu",obj);
        ctrl.addMember(obj)
    }
    this.removeTaskComp=function(obj){
      ctrl.removeTask(obj);
    }
    this.editTaskComp=function(checkListId,taskObject)
    {
      console.log("after update",checkListId,taskObject);
      ctrl.updateTodoItem(taskObject,{"_id":checkListId});

    }
  }
//end of task
