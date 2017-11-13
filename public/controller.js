var app = angular.module('katApp', ['ngMaterial']);
// app.constant('base', {url : "http://localhost:3000"} )
// app.constant('base', {url : "http://52.88.255.121:3000"} )
app.constant('base', {url : "http://karnataka-court-causelist.net:8081"} )

app.controller('katController', function($http, $scope, base) {
	$scope.casesList = [];
	$scope.casesLoading = false;

	// $scope.momentDate = moment().add(1, 'days').format('DD/MM/YYYY');
	$scope.momentDate = moment().add(1, 'days').format('DD/MM/');
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	$scope.date = tomorrow;
	// $scope.date = tomorrow.toLocale
	$scope.getCases = function(date, name) {
		//alert('getting cases ...' + 'date: ' + date + 'name: ' + name);
		validate(date, name);
		if($scope.errorMsg) return;

		$scope.casesLoading = true;
		// date = date.toISOString().slice(0,10);
		// date = date.toISOString();
		$scope.dateStr = moment(date).format('YYYY-MM-DD');
		console.log('Date: ' + $scope.dateStr)
		$http.get(base.url + '/causelist/available?date=' + $scope.dateStr)
		.success(function(jsonResult){
			console.log("Result: " + jsonResult);
			$scope.causeListAvailable = jsonResult;
			if(!$scope.causeListAvailable){
				$scope.errorMsg = 'Causelist is not uploaded yet. Please try after some time...';
				$scope.casesList = {};
				$scope.casesLoading = false;
				return;
			} else {
				$scope.casesList = {};
				$scope.errorMsg = '';
			}
			$http.get(base.url + '/causelist?date=' + $scope.dateStr + '&advocateName=' + name)
			.success(function(jsonResult) {
				console.log("Result: " + jsonResult);
				$scope.casesList = jsonResult;
				$scope.casesLoading = false;
				if($scope.casesList.length > 0){
					$scope.loadMessage = "Number of Cases: " + $scope.casesList.length
				}
				else{
					$scope.loadMessage = "No case available for this advocate and this date"
					$scope.casesList = {};
				}
			})
			.error(function(err) {
				alert('Error ...');
				console.log(err);
				$scope.casesLoading = false;
			})
		})
		.error(function(err){
			alert('Error ...')
			console.log(err)
			$scope.casesLoading = false;
		});

	}

	function validate(date, name){
		if(!name){
			$scope.errorMsg = "Please enter advocate's name";
			return;
		}
		else
			$scope.errorMsg = '';

		if(!date){
			$scope.errorMsg = "Please enter date";
			return;
		}
		else
			$scope.errorMsg = '';
	}

	function formatDate(date){
		console.log(date.split('T')[0])
		return date.split('T')[0]
	}
});
