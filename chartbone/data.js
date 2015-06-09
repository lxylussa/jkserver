var data = angular.module('Data', [])
.controller('dataCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
	var callback = null;

	$scope.data = {
        string: "",
        json: null
    };

	$rootScope.$on('Data-OpenModal', function(e, tmpdata){
		$("#data-modal").modal('show');
		if (tmpdata.data){
			$scope.data = angular.copy(tmpdata.data);
			callback = tmpdata.callback;
		}
	});

	$scope.initData = function(){
        if (!$scope.data.string && !$scope.data.url){
            alert('请填写或导入数据');
            return;
        }
        if ($scope.data.string){
            try{
                $scope.data.json = eval('('+$scope.data.string+')');
            }catch(e){
                alert('你填写的数据不符合json格式');
                return;
            }
            _initData();
        }
        if ($scope.data.url){
            try{
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: $scope.data.url,
                    error: function(){
                        alert('你填写的数据地址不合法，请检查数据');
                    },
                    success: function(data){
                        if (data){
                            $scope.data.json = data;
                            _initData();
                        }else{
                            alert('你填写的数据地址不合法，请检查数据');
                        }
                    }
                });
            }catch(e){
                alert('你填写的数据地址不合法，请检查数据');
            }
        }
    }

    function _initData(){
    	if (callback) {
    		callback(angular.copy($scope.data));
    	}
        $scope.data.string = null;
        $scope.data.url = null;
        $("#data-modal").modal('hide');
    }
}])
.service('data', ['$rootScope', function ($rootScope) {
	return {

	}
}]);
