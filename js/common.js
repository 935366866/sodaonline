$(function(){
    //打开时根据窗口大小选择
    checkWindowSize(".change_box");
    //变动时根据浏览器大小选择样式
    $(window).resize(checkWindowSize);

    //导航下拉菜单
    var nav_list_all = ["nav1_list1","nav2_list1","nav2_list2"];
    for(var i in nav_list_all){
        var name = nav_list_all[i];
        $("."+name).mouseover(function(){
            $(this).addClass("listshow");
        });
        $("."+name).mouseout(function(){
            $(this).removeClass("listshow");
        });
    };
});

//===========================函数========================
//1.根据浏览器大小选择样式
function checkWindowSize(){
    var id=".change_box";
    if($(window).width()>=1200){
        $(id).addClass("bigbox_1200");
        $(id).removeClass("bigbox");
    }else{
        $(id).addClass("bigbox");
        $(id).removeClass("bigbox_1200");
    };
};

// 获得选中的id
function getIdSelections(tableId,colName) {  //输入当前table的ID，需要获取的列
	var checkedId=""

	$.map($("#"+tableId).bootstrapTable('getSelections'), function (row) {
		if(checkedId == ""){
			checkedId += row[colName]
			}
		else{
			checkedId += ','+row[colName]
			}
	});
	return checkedId  //返回以逗号分隔的列明
};
//统计选中的checkbox的数量，传入bootstrap table的ID， 返回选中数字。
function checkedNum(tableId){
	check_num=0
	$("#" + tableId + " tr input[type='checkbox']").each(function(i){	
				if (i !== 0 && this.checked == true){
					check_num += 1;
				};
		});
	return check_num
}

//删除bootstrap table 中选中的项目，确认删除的时候发送删除的id
function remove_confirm(tableId,colName,number,url, param){
	if(number == 0){ 
		alert("您还未选中任何项！")
		}
	else{
		var r=confirm("您确定要删除这" + number + "项吗？");
		if (r==true)
		  {
			 checkedId =  getIdSelections(tableId,colName)   //该函数获取ID
			 //post方式发送数据
			 $.ajax({
				    url:url,  
				    type:'post',
				    data:{ids:checkedId},
				    dataType: "json",
				    success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
							$("#"+tableId).bootstrapTable('refresh');      //刷新
				    		alert(data['data']);
				    	}else{
				    		if(typeof(param)=='object'){
				    			$("#"+tableId).bootstrapTable('refresh',param);
				    		}else{
				    			$("#"+tableId).bootstrapTable('refresh');
				    		}
							
							//alert(data['data']);	
				    	}
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
		  }
		}
};
//刷新bootstra table 需要提供表格的ID
function rf_bsTable(tableId) {
	$("#"+tableId).bootstrapTable('refresh');
	};

//实时显示选中的checkbox数量
function checkedNow(tableId,showId){
	$('#'+ tableId).on('check.bs.table', function () {   
	 	num = checkedNum("maintable");
		$('#' + showId).html(num);
	 });
	$('#'+ tableId).on('uncheck.bs.table', function () {   
	 	num = checkedNum("maintable");
		$('#' + showId).html(num);
	 });
	 $('#'+ tableId).on('check-all.bs.table', function () {   
	 	num = checkedNum("maintable");
		$('#' + showId).html(num);
	 });
	 $('#'+ tableId).on('uncheck-all.bs.table', function () {   
	 	num = checkedNum("maintable");
		$('#' + showId).html(num);
	 });
	};
//向后台查看此目录是否存在 参数依次为需要检查的URL， 后台的地址， 需要更新的输入框id， 需要刷新的bootstrap table
function checkUrl(uncheckedUrl,url,inputId,tableId){
	var path = uncheckedUrl?uncheckedUrl:'/';
	path = path.replace('//','/');
	$.ajax({
				    url:url,  
				    type:'get',
				    data:{url:path},
				    dataType: "json",
				    success:function(data,textStatus) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
				    		alert(data['data']);
				    	}else{
				    		var obj=data['data']
							$('#' + inputId).val(path);
							$('#' + tableId).bootstrapTable('load',obj);
				    	}
				   	  },    
				    error : function(XMLHttpRequest) {
				       	alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
				     }
				}); 
		
	};
function uploadFile(url,uploadId,inputId,ddir){  
		dpath = '';
		if(typeof(ddir)!='undefined'|| ddir=='undefined' ||ddir==''){
			dpath = ddir;
		}
	    $('#'+uploadId).fileupload({
	        url: url,
	        dataType: 'json',
	        done: function (e, data) {   //设置文件上传完毕事件的回调函数  
				var status = data.result.status;
				if(status == "ERROR"){
					alert(data.result.data);
					}
				else{
					var url = data.result.data;
					$(inputId).val(url);    //
		//			alert("上传成功！");
					}
	        }
	    })
};	
	
//双击行，判断是否是目录，若是，则进入目录。（三个参数：模态框中table的ID， input的ID， url为后台地址。）
function dblCilck(tableId,inputId,url) {
	$('#' + tableId).bind('dbl-click-row.bs.table',function(row, $element){
		var typeChr = $element.type.charAt(0);
		if(typeChr == 'd'){
			newUrl= $("#" + inputId).val()+'/'+$element.name;
			checkUrl(newUrl,url,inputId,tableId);
		}
	});
};

//数据目录中填入数据
function dataTableGet(data,sequencingType){
		var objData=[];
		var arr = new Array();  //数组，存放所有的文件名
		var arrSample = new Array(); //数组，存放所有的sample name
		var patt =/\.fq\.gz$/i;
		
		//双端
		if(sequencingType == "pe"){
			for(var i=0;i<data.length;i++){  
			   for(var key in data[i]){
				 if(key == "name"){

				   var name = data[i][key].trim();
				   arr.push(name);
				   if(patt.test(name)){

					   var sample = name.split("_")[0];
					   if($.inArray(sample,arrSample) == -1){
					   arrSample.push(sample);
						};
					}; 
				 }
			   }  
		   } 
		   
		   //组成JSON
		  for (var i=0;i<arrSample.length; i++){
			var fq1=arrSample[i]+"_1.fq.gz";
			var fq2=arrSample[i]+"_2.fq.gz";
			var adap1=arrSample[i]+"_1.adaptor.list";
			var adap2=arrSample[i]+"_2.adaptor.list";
			if($.inArray(fq1,arr) != -1){
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']=fq1;
				if($.inArray(adap1,arr) != -1){
					tmp['adap']=adap1;
				}
				else{
					tmp['adap']='<font color="red">' + adap1 + '</font>';
				}
				objData.push(tmp)
			}
			else{
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']= '<font color="red">' + fq1 + '</font>'
				if($.inArray(adap1,arr  != -1)){
					tmp['adap']=adap1;
				}
			   else{
					tmp['adap']= '<font color="red">' + adap1 + '</font>';
				}
				objData.push(tmp)
			}
		  if($.inArray(fq2,arr)  != -1){
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']=fq2;
				if($.inArray(adap2,arr)  != -1){
					tmp['adap']=adap2;
				}
				else{
					tmp['adap']= '<font color="red">' + adap2 + '</font>';
				}
				objData.push(tmp)
			}
			else{
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']= '<font color="red">' + fq2 + '</font>'
				if($.inArray(adap2,arr) != -1){
					tmp['adap']=adap2;
				}
			   else{
					tmp['adap']= '<font color="red">' + adap2 + '</font>';
				}
				objData.push(tmp)
			}
		}
		   
		   
		}
		if(sequencingType == "se"){
			for(var i=0;i<data.length;i++){  
			   for(var key in data[i]){
				 if(key == "name"){

				   var name = data[i][key];
				   arr.push(name);
				   if(patt.test(name)){

					   var sample = name.split(".")[0];
					   if($.inArray(sample,arrSample) == -1){
					   arrSample.push(sample);
						};
					}; 
				 }
			   }  
		   }
		   
		   for (var i=0;i<arrSample.length; i++){
			var fq=arrSample[i]+".fq.gz";
			var adap=arrSample[i]+".adaptor.list";
			if($.inArray(fq,arr) != -1){
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']=fq;
				if($.inArray(adap,arr) != -1){
					tmp['adap']=adap;
				}
				else{
					tmp['adap']='<font color="red">' + adap + '</font>';
				}
				objData.push(tmp)
			}
			else{
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']= '<font color="red">' + fq + '</font>'
				if($.inArray(adap1,arr  != -1)){
					tmp['adap']=adap;
				}
			   else{
					tmp['adap']='<font color="red">' + adap + '</font>';
				}
				objData.push(tmp)
			}

		  }
		}
	return objData
};
//--------------------------------------------------------组成json---------

//判断是否是草稿文件如果是给编辑界面填写数据, 参数url为获取后台的该草稿的地址
function draftTask(url,dataUrl){
	$.ajax({
		url:url,  
		type:'get',
		dataType: "json",
		success: function (data) {
			
//			taskId = data["taskId"];   //找到参数中的taskId
//			if(taskId != ""){  //id为空的时候不是草稿，不为空的时候是草稿

//第一部分，填写任务参数
			if(data==null|| data=='' ||data.length==0){
				return ;
			}
			var samples = data['samples'];
			var taskPara = data.taskPara;
			for (var i=0; i < taskPara.length; i++){
				var name = taskPara[i].name;   //参数项的name，也是id
				var value = taskPara[i].value;  //参数项具体的值
				if($("#" + name).length == 0){	//如果未取到元素，忽略
					continue;
				}
				var tagType = $("#" + name)[0].tagName;   //此id项的类型
				
				if(tagType=="INPUT"){
					 $("#" + name).val(value);
					//向后台发送请求，将对应目录的数据填写到表格当中
					 if(name == "data_dir"){    
						var sequencingType = $("#seq_type").val(); 
						$.ajax({
								url:dataUrl,  //向后台发送数据目录
								type:'get',
								data:{url:value},
								dataType: "json",
								success:function(data,textStatus) {
									if(data['status']=='ERROR'){    //请求成功但没有执行成功
										alert(data['data']);
									}else{
										var data1 = data['data'];
									
										var objData = dataTableGet(data1,sequencingType);   //向后台传输数据，返回值组成Json
										//去除没有的样本
										var newdata = [];
										var sampleArr = [];
										if(samples){
											samples.split(',');
										}
										for(n=0;n<objData.length;n++){
											if(sampleArr.indexOf(objData[n].sample)>=0){
												newdata.push(objData[n]);
											}
										}
										$('#sampleTable').bootstrapTable('load',newdata);  //填入table中
									}
								  },    
								error : function(XMLHttpRequest) {
									alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
								 }
							}); 
						
						};
				};
				if(tagType=="SELECT"){
					$('.selectpicker').selectpicker('refresh');
					$("#" + name).selectpicker('val',value);
				};		
			};
//第二部分，流程图的颜色改变，锁定模块
			var unselectNode = data['unselectNode'].split(",");
			//console.log(unselectNode)
			for(var i=0;i<unselectNode.length;i++){
				if(unselectNode[i]==''){
					continue;
				}
				diagram.findNodeForKey(unselectNode[i]).elt(0).fill=unselectColor;	//未选中模块变成灰色
				nodeStatus[unselectNode[i]] = 0;
			};
			
			
//修改原来默认参数的数值			
			var nodePara = data.nodePara
			for(var i=0;i<allNodeName.length;i++){
				if($.inArray(allNodeName[i], unselectNode)== -1){
	
					items = defaultRefParams[allNodeName[i]];   //所有有参数的节点
					if(typeof(items)=='undefined' || items==null){
						continue;
				   }
					
					for (var j=0; j < items.length; j++){   //遍历节点中的所有参数
						for(var k=0;k<nodePara.length;k++){    //遍历所有的草稿中的参数
							
							if(nodePara[k]["name"] == items[j]["id"]){
								if(defaultRefParams[allNodeName[i]][j]["type"] == "input"){   //input输入框直接将默认值替换为草稿中的值
								
									defaultRefParams[allNodeName[i]][j]["value"] = nodePara[k]["value"];
								};
								if (defaultRefParams[allNodeName[i]][j]["type"] == "dropdown"){  //下拉框将需要草稿中的值设置为第一位
									var dropdownValue=""
									var arr = defaultRefParams[allNodeName[i]][j]["value"].split(",");  //将之前的默认的value先转化成数组
									arr.splice($.inArray(nodePara[k]["value"],arr),1);     //去掉数组中草稿中的这一项
									for(var n=0;n<arr.length;n++){	//循环数组，将草稿中的第一项放在最前面
										if(dropdownValue == ""){
											dropdownValue += nodePara[k]["value"]+","+arr[n];
										}
										else{
											dropdownValue += "," +  arr[n];
										};
									};
								//	console.log(dropdownValue)
									defaultRefParams[allNodeName[i]][j]["value"] = dropdownValue;  //将新的组成的字符串赋值给默认值
								};
							};
						};
					}; 
					
				};
			};
			
			selectedNode();  //锁定模块
//		};
		
                },
		error: function(XMLHttpRequest) {
					alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
				 }
	});
};

//直接写入一个json而不从json文件中获得他
allNodeName =  ["Density", "Saturation", "SNP_INDEL", "AS", "PPI", "GO", "KEGG","QC","Assemble","Novel","DE"];
constDefaultRefParams={

	"DE": [
        {
            "id": "qval",
            "name": "P-Adjusted Value",
            "type": "input",
			"value":"0.005",
			"illustration":"p-adjusted value为校正后的p-value值，用于反映差异的显著性，值越小差异越显著。此参数用于筛选差异基因。无生物学重复一般选择0.005，生物学重复一般选择0.05 。"
        },
        {
            "id":"foldchange",
            "name": "差异倍数",
            "type": "input",
			"value":"",
			"illustration":"此参数为foldchange，即差异倍数。值越大，表示基因表达水平差异越大。用于筛选差异基因。无生物学重复一般取2，有生物学重复一般设置为1。"
        }
],
	"PPI": [
        {
            "id": "ppi",
            "name": "PPI号",
            "type": "dropdown",
			"value":";39947,Oryza_sativa_Japonica(rice)",
			"illustration":"用于PPI(Protein-Protein Interactions)分析的ppi number。"
        }],

	"KEGG": [
        {
            "id": "abbr",
            "name": "KEGG缩写",
            "type": "dropdown",
			"value":";osa,Oryza_sativa_Japonica(rice);hsa,Homo_sapiens(human)",
			"illustration":"KEGG物种缩写。"
        }]
}

defaultRefParams = JSON.parse(JSON.stringify(constDefaultRefParams));