

var app = angular.module('katApp', ['ngMaterial']);
// app.constant('base', {url : "http://localhost:3000"} )
// app.constant('base', {url : "http://52.88.255.121:3000"} )
app.constant('base', {url : "http://karnataka-court-causelist.net:8081"} )

/*Ad Widget controller */
app.controller('adWidgetController', function($http, $scope, $timeout, $document){
	// $scope.widgetUrl = "https://z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=68861a41-c883-429b-b2ea-a787b25e8deb&storeId=kat059-20"
	// var div = angular.element('<div><script src="https://z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=68861a41-c883-429b-b2ea-a787b25e8deb&storeId=kat059-20"></script></div>');
	// var body = $document.find('body').eq(0)
	// $timeout(function(){
	// 	body.append(div)
	// 	$scope.$apply()
	// }, 3000)
	
})


app.controller('katController', function($http, $scope, base, $sce) {
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
			console.log("Causelist available : " + jsonResult);
			$scope.causeListAvailable = jsonResult;
			if(!$scope.causeListAvailable){
				$scope.errorMsg = 'Causelist is not uploaded yet. Please try after some time...';
				$scope.casesList = [];
				$scope.casesLoading = false;
				return;
			} else {
				$scope.casesList = [];
				$scope.errorMsg = '';
			}
			$http.get(base.url + '/causelist?date=' + $scope.dateStr + '&advocateName=' + name)
			.success(function(jsonResult) {
				console.log("Cases: " + jsonResult);
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
})
app.filter('highlight', function($sce){
	return function(text, phrase){
		if(phrase) text = text.content.replace(new RegExp('('+phrase+')','gi'),
		'<span class="highlighted">$1</span>')
		// console.log('Replaced text: ', text)
		return $sce.trustAsHtml(text)
	}
})
