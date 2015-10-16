'use strict';

angular.module('marinetApp')
    .controller('AppsCtrl', ['$scope','toaster','Errors',
        function ($scope, toaster, Errors) {
            
            $scope.purge = function(name)
            {
                if ( ! confirm('Todos os error para a aplicação serão apagados!') )
                    return;
                
                console.log('purging: ', name);                
                return Errors.purge(name).then(function(){
                        toaster.pop('success', '', 'Erros apagados da base');
                    }, function(err){
                        console.log(err);
                        toaster.pop('error', '', 'Não foi possível apagar dados da base');
                    });

            };

  }]);
