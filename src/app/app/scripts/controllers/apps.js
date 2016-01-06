'use strict';

angular.module('marinetApp')
    .controller('AppsCtrl', ['$scope','toaster','Errors','Apps',
        function ($scope, toaster, Errors, Apps) {
            
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

            $scope.mute = function(name, value){
                
                let errorMessage = '';
                let successMessage = '';
                

                 if(value) {
                    if (!confirm('Você não receberá mais notificações de erro. Desejar confirmar essa ação?'))
                        return;

                    successMessage = 'Notificações desativadas com sucesso';
                    errorMessage = 'Não foi possível desativar notificações de erro';
                } else {

                    successMessage = 'Notificações ativadas com sucesso';
                    errorMessage = 'Não foi possível ativar notificações de erro';
                }

                return Apps.mute(name, value).then(function(){
                        toaster.pop('success', '', successMessage);
                    }, function(err){
                        console.log(err);
                        toaster.pop('error', '', errorMessage);
                    });
            }
        }
    ]
);
