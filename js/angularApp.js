var app = angular.module('ThesisApp', ['ngMaterial', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('intro', {
			url : '/intro',
			templateUrl : 'intro.html',
			controller : 'IntroCtrl',
		})
		.state('howto', {
			url : '/howto',
			templateUrl : 'howto.html',
			controller : 'HowToCtrl',
		})
		.state('about', {
			url : '/about',
			templateUrl : 'about.html',
			controller : 'AboutCtrl',
		})
    $urlRouterProvider.otherwise('intro');
  }]);

/*--------------------------------------CONTROLLER--------------------------------------*/

app.controller('MainController',['$scope', '$state', '$mdSidenav', function($scope, $state, $mdSidenav){
	this.title = "Tinnitus Treatment";
	this.goIntro = function() {
		$state.go('intro');
		$mdSidenav('left').close();
	}
	this.goHowTo = function() {
		$state.go('howto');
		$mdSidenav('left').close();
	}
	this.goAbout = function() {
		$state.go('about');
		$mdSidenav('left').close();
	}


	this.openMenu = function(){
		$mdSidenav('left').toggle();
	}
}]);

app.controller('IntroCtrl',['$scope', '$state', function($scope, $state){
	$scope.goHowTo = function() {
		$state.go('howto');
	}
}]);

app.controller('HowToCtrl',['$scope', '$state', function($scope, $state){
	$scope.goIntro = function() {
		$state.go('intro');
	}
	$scope.goHowTo = function() {
		$state.go('howto');
	}
	$scope.goAbout = function() {
		$state.go('about');
	}
}]);

app.controller('AboutCtrl',['$scope', '$state', function($scope, $state){
}]);