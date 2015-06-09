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
		}
        callback = tmpdata.callback;
    });

    //模糊格式
    function _str_parse(str){
        var res = [];
        var str_array = str.split("\n\n");
        var x_array = str_array[0].split(",");
        if (str_array.length < 2) return false;
        //parse x
        var x = ['x'];
        $.each(x_array, function(){
            if ($.trim(this).length > 0){
                x.push($.trim(this));
            }
        });
        res.push(x);
        //parse data
        for (var i = 1; i < str_array.length; i++){
            var data = [], s = $.trim(str_array[i]), data_array = s.split("\n");
            if (data_array.length == 2){
                data.push($.trim(data_array[0].split(':')[0]));
                $.each(data_array[1].split(','), function(){
                    if ($.trim(this).length > 0){
                        data.push($.trim(this));
                    }
                });
            }else{
                return false;
            }
            res.push(data);
        }
        return res;
    }


	$scope.initData = function(){
        if (!$scope.data.string && !$scope.data.url){
            alert('请填写或导入数据');
            return;
        }
        if ($scope.data.string){
            try{
                $scope.data.json = eval('('+$scope.data.string+')');
            }catch(e){
                var json = _str_parse($scope.data.string);
                if (json){
                    $scope.data.json = json;
                }else{
                    alert('你填写的数据不符合json格式');
                    return;
                }
            }
            _initData();
        }else if ($scope.data.url){
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
