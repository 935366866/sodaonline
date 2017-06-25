
$(function () {
//实时统计选中checkbox的个数
	checkedNow('maintable','now_ck_num');
//点击刷新时选中项目个数清零
	$("button[name='refresh']").click(function(){
		$("#now_ck_num").text(0);
	});
//给项目页设置定时器
	setInterval("rf_bsTable('maintable')", 300000);
	
//删除选中的行
	$("#remove").click(function(){
		var num = checkedNum("maintable")					//选中个数
		remove_confirm("maintable","id",num, module+'/Task/updateStatTask/delflag/del');	//删除
	});
//恢复
	$("#recover").click(function(){
		num = checkedNum("maintable")					//选中个数
		recover_confirm("maintable","id",num,module+'/Task/updateStatTask/delflag/recovery');	//恢复
	});
});

//-------------------------------------函数-------------------------------------
//下拉箭头展开
function detailFormatter(index, row) {
	var html = [];
	$.each(row, function (key, value) {
		
		if( key=="task_name" ){
			html.push('<p><b>任务名称:</b> ' + value + '</p>');
			};
		if($.inArray(key,["create_time"]) != -1){
			html.push('<p><b>创建时间:</b> ' + value + '</p>');
			};
			
		if(key == "task_remark"){
			html.push('<p><b>任务说明:</b> ' +'</p><p class="indent">' + value + '</p>');
			};	
	});
	$.fn.editable.defaults.mode = 'inline';
	return html.join('');
}
//删除bootstrap table 中选中的项目，确认删除的时候发送删除的id. 
function recover_confirm(tableId,colName,number,url){
	if(number == 0){ 
		alert("您还未选中任何项！")
		}
	else{
		var r=confirm("您确定要恢复这" + number + "项吗？");
		if (r==true)
		  {
			 checkedId =  getIdSelections(tableId,colName)   //该函数获取ID
			 $.ajax({
				    url:url,  
				    type:'post',
				    data:{ids:checkedId},
				    dataType: "json",
				    success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
							$("#"+tableId).bootstrapTable('refresh');      //刷新
							$("#now_ck_num").text(0);
				    		alert(data['data']);
				    	}else{
							$("#"+tableId).bootstrapTable('refresh');
							alert("成功！");	
							$("#now_ck_num").text(0);							
				    	}
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
		  }
		}
};