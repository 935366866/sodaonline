
var appDefaultParams //定义全局变量方便修改默认值
var paramUrl = 'json/1.json'; //module+'/Data/remoteDirView';  //选择路径的模态框，向后台请求的地址

//页面完全加载完，执行
$(function(){
	$('#taskPanel label').addClass('label_width');   //含有任务名称等基本信息的表格中label

	//获得数据填入页面的参数当中
	$.getJSON("json/newApp.json",function(data){   //module+"/FlowApp/getToolParams/tool_id/"+tool_id
		var items = data;    
		var uploadUrl = "'json/uploadUrl.json'";//"'"+module+"/Upload/uploadFile'";  //上传时请求地址
		appDefaultParams = JSON.parse(JSON.stringify(data));	
	//在参数设置中添加input或dropdown参数
		
		for (var i=0; i < items.length; i++){   //遍历其中的许多参数
			
			var type = items[i]["param_type"];
			var mark = "";
			if(items[i]["flag"] == -1){
				continue;
			}
			else{
				
				if(items[i]["flag"] == 1){
					mark = "required"
					};
				if(type== "text" || type == "number"){   //添加一个input框
				
					var name = items[i]["param_name"]
					var id = items[i]["id"]
					var value = items[i]["default_value"]
					var info = items[i]["param_desc"]
					//添加input的代码
					$("#appParams form").append('<div class="form-group"><label class="col-md-2 control-label">' + name + '</label><div class="col-md-8"><input type="text"  class="form-control" ' + mark　+ ' id="'+ id +'" name="'+ name +'" title="' + info + '"></div><a class="col-md-2 control-label"  style=" text-align:left;cursor:pointer; " onclick="paraDefult('+id+')">默认值</a></div>');
				
					//向input中添加默认值
					$("#" + id).val(value);
				};
				
				if(type == "select"){   //添加一个下拉框
					var name = items[i]["param_name"]
					var id = items[i]["id"]
					var value = items[i]["sel_val"].split(";")
					var info = items[i]["param_desc"]
					var opts = ""
					for (var j=0;j < value.length; j++){
						opts += '<option>' + value[j] + '</option>';
						};
				
					//添加dropdown的代码
					$("#appParams form").append('<div class="form-group"><label class="col-md-2 control-label">' + name + '</label><div class="col-md-8" ><select class="form-control"  ' + mark　+ '  id="'+ id +'" name="'+ name +'"  title="' + info + '">' + opts + '</select></div></div>');
				};	
				
				if(type == "upload"){   //本地上传
					var name = items[i]["param_name"]
					var id = items[i]["id"]
					var info = items[i]["param_desc"]
					var uploadId = "'upload" + items[i]["id"] + "'"
					var sqm = "'"   //单引号
					
					$("#appParams form").append('<div class="form-group"><label class="col-md-2 control-label">' + name + '</label><div class="col-md-8"><input type="text" readonly class="form-control" ' + mark + ' id="'+ id +'" name="'+ name +'" title="' + info + '"></div><span class="btn btn-success fileinput-button btn-sm col-md-2" style="width: 60px;"><i class="glyphicon glyphicon-upload"></i><span>上传</span><input type="file" id="upload'+ id +'" name="upload'+ id +
							'" onClick="uploadFile(' + uploadUrl + ','+ uploadId +','+sqm+'#'+ id +sqm+')" ></span></div>');
				
				};
				
				if(type == "dir_dir"){   //添加一个从集群上选择目录的input
					var name = items[i]["param_name"]
					var id = items[i]["id"]
					var value = items[i]["default_value"]
					var info = items[i]["param_desc"]
					var sqm = "'"   //单引号
					
					$("#appParams form").append('<div class="form-group"><label class="col-md-2 control-label">' + name + '</label><div class="col-md-8"><input type="text"  class="form-control" ' + mark + ' id="'+ id +'" name="'+ name +'" title="' + info + '" ></div><div class="col-sm-1"><a onclick="openUrl('+sqm+'#'+id+sqm+','+sqm+'dir'+sqm+')"><span class="glyphicon glyphicon-folder-open" style="font-size:20px; top: 5px; cursor:pointer; "></span></a></div></div>');
					//向input中添加默认值
					$("#" + id).val(value);
				};

				if(type == "dir_file"){   //添加一个从集群上选择文件的input
					var name = items[i]["param_name"]
					var id = items[i]["id"]
					var value = items[i]["default_value"]
					var info = items[i]["param_desc"]
					var sqm = "'"   //单引号
					
					$("#appParams form").append('<div class="form-group"><label class="col-md-2 control-label">' + name + '</label><div class="col-md-8"><input type="text"  class="form-control" ' + mark + ' id="'+ id +'" name="'+ name +'" title="' + info + '" ></div><div class="col-sm-1"><a onclick="openUrl('+sqm+'#'+id+sqm+','+sqm+'file'+sqm+')"><span class="glyphicon glyphicon-folder-open" style="font-size:20px; top: 5px; cursor:pointer; "></span></a></div></div>');
					//向input中添加默认值
					$("#" + id).val(value);
				};
				
			};
					
		};
});

				

//提交参数
$("#taskRun").click(function(){
	var nullNum = checkInput()
	if(nullNum==0){
		
		var data =  allParams();
		//console.log(data)
		$.ajax({
				url: module+'/Task/runAppTask',  
				type:'post',
				data:{data:data},
				dataType: "json",
				success:function(data) {
					if(data['status']=='ERROR'){    //请求成功但没有执行成功
						alert(data['data']);
					}else{
						alert("成功提交任务！");
						window.location.href= module+data['data'];
					}
				 },    
				 error : function(XMLHttpRequest) {
				   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				 }
			});
	};
});

//与后台交互时冻结窗口
$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

});


//---------------------------------------------------函数---------------------------
//点击恢复默认值
function paraDefult(id){
	var id = id.id
	var items = appDefaultParams;
	for (var i=0; i < items.length; i++){ 
		if(items[i]["id"] == id){
			$("#"+id).val(items[i]["default_value"]);
			};
		};
};

//参数组装
function allParams(){

	var params = $("#appParamsForm").serializeArray();
//````````````````````````````````````````````````		
	var json2 = new Array();
	for(var i=0;i<params.length;i++){
		var selected_samples = "";
        var eachParam = {}
		var id;
		var prefix;
		var param_type;
		for(var j=0;j < appDefaultParams.length;j++){
			if(params[i].name == appDefaultParams[j]['param_name']){
			id = appDefaultParams[j]['id'];
			prefix = appDefaultParams[j]['param_prefix'];
			param_type = appDefaultParams[j]['param_type'];
			};
		};
		//集群选择时带有各种样本的数据格式（以逗号分隔）： soda/main,s1_2.adaptor.list,s1_2.fq.gz,s1_1.fq.gz
		var have_samples = $("#"+id).nextAll();
		eachParam['name'] = params[i].name;
		if(have_samples.length == 0){
			eachParam['value'] = params[i].value;
		}else{
			for(var k=0;k<have_samples.length;k++){
				selected_samples += "," + have_samples[k].textContent;
			}
			eachParam['value'] = params[i].value + selected_samples;
		}
		
		eachParam['id'] = id;
		eachParam['prefix'] = prefix;
		eachParam['param_type'] = param_type;
        json2.push(eachParam);
		}
//`````````````````````````````````````````

	var app = $("#creatApp").serializeArray();
	var json1 = {};
	for(var i=0;i<app.length;i++){
			var name = app[i].name;
			var value = app[i].value;
			json1[name] = value;
	}
	json1["allAppParams"]=json2

	Params = JSON.stringify(json1);
	return Params
};


//检查参数填写情况
function checkInput(){
	
	var checkInput=$("taskPanel input[required]");
	var checkSelect=$("taskPanel select[required]");

	var count=0; //计数
	for(var i=0;i<checkInput.length;i++){
	  if(checkInput[i].value==""){
		$(checkInput[i]).attr("style","border-color:red;")
		count += 1;
	  }
	  else{
		$(checkInput[i]).attr("style","border-color:#ccc;") 
		  };
	};
	
	for(var i=0;i<checkSelect.length;i++){
	  if(checkSelect[i].value==""){
		$(checkSelect[i]).attr("style","border-color:red;")
		count += 1;
	  }
	  else{
		$(checkSelect[i]).attr("style","border-color:#ccc;")  
		  };
	}; 

	if(count != 0){
		alert("还有未填写的参数！");
		};
		
	return count
	};

//-----------------------------------模态框-----------------------------------
//回车查目录是否存在
$(function(){
	//判断选择目录还是文件

	dblCilck('urlTable','inputUrl',paramUrl);  //双击行，判断是否是目录，若是，则进入目录。（三个参数：模态框中table的ID， input的ID， url为后台地址。）

	$('#inputUrl').bind('keypress',function(event){
		if(event.keyCode == "13")    
		{
			newUrl = $("#inputUrl").val();
			checkUrl(newUrl,paramUrl,"inputUrl","urlTable"); //参数依次为需要检查的URL， 后台的地址， 需要更新的输入框id， 需要刷新的bootstrap table
		}
	});
//点击右边箭头，检查	
	$("#search").click(function(){  
    	  newUrl = $("#inputUrl").val();
		  checkUrl(newUrl,paramUrl,"inputUrl","urlTable");
    });  
//后退按钮
	$("#back").click(function(){  
    	   Url= $("#inputUrl").val();
		   
		   lastLen =Url.split('/').pop().length
		   newUrl = Url.substring(0,Url.length - lastLen-1);
		   checkUrl(newUrl,paramUrl,"inputUrl","urlTable");
    }); 
//模态框绑定事件
	$('#selectUrl').on('show.bs.modal', function () {    //加载当前目录的表格
		var url = $("#inputUrl").val()? $("#inputUrl").val():'/';
 		checkUrl(url,paramUrl,"inputUrl","urlTable");
	});

});
//打开任务目录
function openUrl(id,type){
	var inputValue = $(id).val();  //当前input的值

	$("#inputUrl").val(inputValue);
	$('#selectUrl').modal('show');

    $("#selected").attr("onClick","geturl('"+id+"','"+type+"')")   //给选择按钮添加事件

};

//选择目录时添加文件或者目录的图标
function addIcon(State, row) {
	var typeChr = row.type.charAt(0);
		
	if(typeChr == 'd'){
		return '<span class="glyphicon glyphicon-folder-open"></span>';
		}
	else{
		return '<span class="glyphicon glyphicon-file"></span> ';
		}
};

//点击选择关闭模态框，将当前模态框input中的路径取出放入表单中,type 的类型 暂时有两种，dir和 file
function geturl(formInputId,type){
	var selected_num = checkedNum("urlTable");
	//console.log(selected_num)
	if(type == "dir"){
		//只能选择文件夹，单选
		var newUrl = ""

		if(selected_num == 1){
			//此时选中了一项，判断是否是目录
			var singleName = ""   //选择一个文件夹或者文件的名字，单选
			$.map($('#urlTable').bootstrapTable('getSelections'), function (row) {
				var d_f_type = "";
				d_f_type = row.type.charAt(0);
				if(d_f_type == "d"){
					singleName = row.name;
					newUrl = $("#inputUrl").val() + "/"+ singleName;    //点击选择时取input中当前的路径，在加上此时选择的
					newUrl = newUrl.replace('//','/');
					$("#selected").removeAttr("onClick");
					$("#selectUrl").modal('hide');
					$(formInputId).val(newUrl);	
				}else{
					alert("对不起，您选择的必须是目录文件！");
				
				};
						
			});
			
		
		}else if(selected_num == 0){
			//没有选中任何项，将此时的url传到前面

			newUrl = $("#inputUrl").val();    //点击选择时取input中当前的路径，在加上此时选择的
			newUrl = newUrl.replace('//','/');
			$("#selected").removeAttr("onClick");
			$("#selectUrl").modal('hide');
			$(formInputId).val(newUrl);
		  
		}
		else{
			//选择了多项，直接报错
			alert("对不起，只能选择一个目录文件！");
		};
		
	}
	else if(type == "file"){
		//只能选择文件，多选
		var newUrl = ""
		var files = [];
		var have_dir = 0
		$.map($('#urlTable').bootstrapTable('getSelections'), function (row) {
			var d_f_type = "";
			d_f_type = row.type.charAt(0);
			if(d_f_type == "d"){
				have_dir = 1;
			}else{
				files.push(row.name);
			}
			
		});
		if(have_dir == 1){
			alert("对不起，不能选择文件夹，只能选择文件！");
		}else{
			if(files.length == 0){
				alert("请选择文件！")
			}else{
				//获得当前的目录，取消绑定，关闭模态框，在外面填写
				newUrl = $("#inputUrl").val();
				newUrl = newUrl.replace('//','/');
				$("#selected").removeAttr("onClick");
				$("#selectUrl").modal('hide');
				$(formInputId).val(newUrl);
				//清空样本
				$(formInputId).nextAll().remove();
				for(var i=0; i< files.length; i++){
					$(formInputId).after('<span class="label label-default span_sample">'+files[i]+'<a href="javascript:void(0);" onclick="remover_this_sample(this)" class="glyphicon glyphicon-remove"></a></span>');
				};
			};
		};

	}
	else{
		return false;
	}

};

//当点击样本右边的叉的时候，删除此样本的选择
function remover_this_sample(a){
	a.parentNode.remove();
}