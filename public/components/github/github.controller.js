fragileApp.controller('githubController',['$scope','$stateParams','$uibModalInstance','githubService','param','Socket',function($scope,$stateParams,$uibModalInstance,githubService,param,Socket){
  //var account=githubService.getGithubAccount();
  var socket = Socket($scope);
  var githubCntrl=this;
  githubCntrl.GithubComplexObj=param;
  githubCntrl.selected=githubCntrl.GithubComplexObj.response;
  $scope.selected=githubCntrl.selected;
  $scope.selectedIssues=[];
  $scope.selectedRepo={};
  console.log(param);
  $scope.linkRepository=function(){

    var repo=JSON.parse($scope.selectedRepo);

    console.log(JSON.parse($scope.selectedRepo));
    repoDetails={
      projectId: param.projectId,
      name: repo.name,
      owner: repo.owner.login
    }
    console.log(repoDetails);
    githubService.addRepo(repoDetails).success(function(response){
console.log(response);
console.log("-------");

console.log($uibModalInstance);
$uibModalInstance.close()

    })

  }
  $scope.linkRepo=function(){
    var repo=JSON.parse($scope.selectedRepo);
    var repoDetails={
      projectId: param.projectId,
      name: repo.name,
      owner: repo.owner.login
    }
    socket.emit("github:addRepo",repoDetails)
    $uibModalInstance.close();
  }
  $scope.getGithubIssues=function(){
    //console.log($stateParams);
    console.log(param);
    console.log(param.issues);

    //githubService.get
  }
  $scope.toggleSelection=function(issue){
    var flag=false;
    $scope.selectedIssues.forEach(function(obj){
      if(obj.id===issue.id){
        flag=true;
        var idx=$scope.selectedIssues.indexOf(obj);
        $scope.selectedIssues.splice(idx,1);

      }
    })
      if(!flag){
        $scope.selectedIssues.push(issue);
      }


      console.log($scope.selectedIssues);
  }
$scope.createStory=function(){
  socket.emit("github:convertToStory",{'issues':$scope.selectedIssues,'projectId':githubCntrl.GithubComplexObj.projectId});
  $uibModalInstance.close();

}
$scope.ok = function() {
  $uibModalInstance.dismiss('cancel');
};
$scope.cancel = function() {
  $uibModalInstance.dismiss('cancel');
};
}])