// MODULE
var surveyApp = angular.module('surveyApp', ['ngRoute', 'ngResource']);

// ROUTES
surveyApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        .when('/survey', {
            templateUrl: 'pages/survey.html',
            controller: 'surveyController'
        })
});

surveyApp.service('QuestionService', ['$resource', '$q', function ($resource, $q) {
    var self = this;

    self.getApi = function () {

        return $q(function (resolve, reject) {

            var resObj = $resource("https://spreadsheets.google.com/feeds/list/1HanYqYICpmXD-CzoDrWiNn9u4VHC-J0jySLjkSWC9Sc/1/public/values");
            var resp = resObj.get({
                alt: "json"
            });
            resp.$promise.then(function (data) {
                console.log('Got data');
                self.data = data;
                console.log(data);
                resolve('success')
            }, function (err) {
                console.log(err);
                console.log('error');
                reject('error')
            });
        })

    }
    self.getQuestionData = function () {
        return self.data;
    }
}]);


//CONTROLLERS
surveyApp.controller('homeController', ['$scope', '$location', function ($scope, $location) {
    $scope.startSurvey = function () {
        $location.path("/survey");
    }
}]);

surveyApp.controller('surveyController', ['$scope', 'QuestionService', function ($scope, QuestionService) {
    $scope.questions = [];
    $scope.parsedEntries = [];
    $scope.radiobutton = false;
    $scope.checkbutton = false;
    $scope.textClass = false;
    QuestionService.getApi()
        .then(function (result) {
            $scope.questions = QuestionService.getQuestionData().feed.entry;
            for (key in $scope.questions) {
                var content = $scope.questions[key];
                var newQuestion = {};
                var options = [];
                newQuestion.category = content['gsx$catagory']['$t'];
                newQuestion.id = content['gsx$id']['$t'];
                newQuestion.question = content['gsx$questions']['$t'];
                newQuestion.option1 = content['gsx$option1']['$t'];
                options.push(newQuestion.option1);
                newQuestion.option2 = content['gsx$option2']['$t'];
                options.push(newQuestion.option2);
                newQuestion.option3 = content['gsx$option3']['$t'];
                options.push(newQuestion.option3);
                newQuestion.option4 = content['gsx$option4']['$t'];
                options.push(newQuestion.option4);
                newQuestion.option5 = content['gsx$option5']['$t'];
                options.push(newQuestion.option5);
                newQuestion.option6 = content['gsx$option6']['$t'];
                options.push(newQuestion.option6);
                options = options.filter(String)
                if (options.length !== 0) {
                    newQuestion.newOption = options;
                }

                newQuestion.class = content['gsx$class']['$t'];
                $scope.updateSelection = function (position, entities) {
                    angular.forEach(entities, function (question, index) {
                        if (position != index)
                            question.checked = false;
                    });
                }
                $scope.parsedEntries.push(newQuestion);
            }

        });

}]);
