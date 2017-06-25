//页面加载完成之后
$(document).ready(function(e) {
    var delete_url = "";
    var stop_url = "";
	var rerun_url = "";
//填充数据
    getAppData("json/appTaskDetail.json"); 
//与后台交互时冻结
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
//------按钮们--------
//刷新
	$("#refresh").click(function(){
		window.location.reload();
    });
//终止
	$("#stop").click(function(){
		var r=confirm("您确定要终止该任务吗？");
		if(r==true){
			 var id = $("#taskId").val();
			 $.ajax({
				    url:stop_url,  
				    type:'post',
				    data:{id:id},
				    dataType: "json",
				    success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
				    		alert(data['data']);
				    	}else{
							alert("任务终止成功！");	
				    	};
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
		  };
    });    
//删除
	$("#delete").click(function(){
		var r=confirm("您确定要删除该任务吗？");
		if(r==true){

			 var id = $("#taskId").val();
			 $.ajax({
				    url:delete_url,  
				    type:'post',
				    data:{id:id},
				    dataType: "json",
				    success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
				    		alert(data['data']);
				    	}else{
							alert("删除成功！");	
				    	};
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
		  };
    });

	//rerun
	$("#taskRerun").click(function(){
		var r=confirm("您确定要rerun该任务吗？");
		if (r==true)
			{
				var id = $("#taskId").val();
				$.ajax({
					url:rerun_url,    //甄伟波，rerun的地址  
					type:'post',
					data:{id:id},
					dataType: "json",
					success:function(data) {
						if(data['status']=='ERROR'){    //请求成功但没有执行成功
							alert(data['data']);
						}else{
							alert("rerun成功！");	
						}
						},    
						error : function(XMLHttpRequest) {
						alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
						}
				});  
			};
	});

	});
//-------------------------------------------函数-------------------------
//任务的状态
function appState(State) {
		
    if ( State == 'done'){
			return  '<button class="btn btn-primary btn-xs" style="width:100px;">完成</button>';
		}else if ( State == 'failed'){
			return '<button class="btn btn-warning btn-xs" style="width:100px;">中止</button>';
		}else {
			return '<button class="btn btn-success btn-xs" style="width:100px;">运行中</button>';
	};
};
function getAppData(url){
	 $.ajax({
			url:url,  
			type:'post',
			dataType: "json",
			success:function(data) {
				if(data['status']=='ERROR'){    //请求成功但没有执行成功
					alert(data['data']);
				}else{
					for(var key in data){
						if(key == "appStatus"){  //填充任务状态table
							$('#appStatusTable').bootstrapTable('load',data[key]);
							}
						else if(key == "allAppParams"){
							var params = data[key];
							for(var param in params){
								$("#appParams form").append('<div class="form-group"><label class="col-md-3 control-label">'+param+'</label><div class="col-md-7"><input type="text" readonly id="'+param+'" class="form-control" ></div></div>');   
								$("#"+param).val(params[param]);
								};
							}else if(key=='status'){
								taskStatus = data.status;
								if(data[key] == 'finished'){
									$('#appTaskStatus').removeClass("btn-success")
									$('#appTaskStatus').addClass("btn-primary").text('已完成');
								}else if (data[key] == 'failed'){
									$('#appTaskStatus').addClass("btn-warning").text('已终止');
								}
							}
						else{
							$("#"+key).val(data[key]);
							}
					};
				};
			 },    
			 error : function(XMLHttpRequest) {
			   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
			 }
		}); 
	};
	function openSftp(user,ip,port, eid){
		window.open('sftp://'+user+'@'+ip+':'+port+$("#"+eid).text());
	}
	
	function stopTask(taskid){
		if (typeof(taskStatus)=='undefined' || taskStatus == 'finished' || taskStatus =='failed' ){
			return false;
		}
		
		if(!confirm("您确定要终止任务吗？")){
			return false;
		}
		
		$.ajax({
			url:"__MODULE__/Task/stopTasks",
			type:'post',
			data:{id:taskid},
			dataType: "json",
			success:function(data){
				if(data['status']=='SUCCESS'){    
		    		$("#taskStatus").removeClass('btn-primary').addClass("btn-warning").text("任务已终止");
		    	}
				alert(data['data']);
				window.location.reload();
			},
			error : function(XMLHttpRequest) {
		       	alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
		    }
		});
	}