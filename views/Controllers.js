var app = angular.module('app', []);
app.controller('CategoriasController',function($scope, $http) {
    $scope.categorias = ['um','chance','batata'];
}