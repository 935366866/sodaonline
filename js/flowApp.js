flowInfo=[
        {	"tool_name": "真核有参转录组分析流程",
            "id": "refRNA",
            "type": "flow",
			"version": "1.0",
			"category":"zlz",
			"tool_abstract":"真核有参mRNA测序是对有参考基因组的真核生物细胞组织总mRNA进行的高通量测序。通过将测序获取得的转录组序列与该物种参考基因组进行序列比对、可变剪接、基因表达、变异检测等生物信息学分析，" +
					"可以得知该细胞组织最基本的转录表达信息。当参考基因组注释信息不全时，可以通过对转录组序列进行组装及比对分析以预测新的转录本，从而达到发现新基因和补充基因组注释信息的目的。对于有差异表达的多样本转录组分析，" +
					"我们通过对所有样本的转录本进行差异表达统计分析以获得差异表达基因集合，再结合多数据库的注释分析最终实现差异基因与样本处理手段在生物学意义上的关联。"
        },
		{	"tool_name": "sRNA分析流程",
            "id": "sRNA_002",
            "type": "flow",
			"version": "1.0",
			"category":"zlz",
			"tool_abstract":"Small RNA（miRNA、siRNA、piRNA）主要用于研究某物种特定组织在特定状态下的所有所有已知的Small RNA，也可以发现新的或者特有的Small RNA并预测其靶基因。为研究Small RNA功能及基因调控提供了工具。"
        },
		{	"tool_name": "无参转录组分析流程",
            "id": "REF_005",
            "type": "flow",
			"version": "1.0",
			"category":"zlz",
			"tool_abstract":"真核无参mRNA测序是对没有参考基因组的真核生物组织总mRNA进行的高通量序。首先，对测序数据进行组装拼接以获得参考序列。然后，基于谇参考序列开展基因表达水平、差异表达等分析，" +
				"并通过多数据库(Nr、Nt、Pfam、KOG/COG、Swiss-prot、GO & KEGG)进行基因功能注释和富集，以获得转录本全面的基因功能信息。因此对于没有参考基因组的物种来说，一样可以通过转录组测序" +
				"来进行基因结构、基因功能、转录调控方式、代谢途径、遗传变异等研究。"
		}
]		
//页面加载完成
$(function(){
	//加载后台app部分的json
	$.ajax({
		url: module+"/FlowApp/getToolsInfo",  
		type:'post',
		dataType: "json",
		success:function(data) {
			if(data['status']=='ERROR'){    //请求成功但没有执行成功
				alert(data['data']);
			}else{
				allData = $.merge(flowInfo , data['data'])  //与前台的json进行合并
				//向其面板中添加div
				for(var i=0;i<allData.length;i++){
					addDIV(i);
				};
			}
		 },    
		 error : function(XMLHttpRequest) {
		   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
		 }
	});
//	allData = flowInfo;
//	for(var i=0;i<allData.length;i++){
//		addDIV(i);
//	}
});
//------------------------------------------函数-------------------------------------------------
//添加流程和app的div
function addDIV(i){
	var type = allData[i]["type"];
	var name = allData[i]["tool_name"];
	var version = allData[i]["version"];
	var symbol = "'"+allData[i]["id"]+"'";
	var Type = "'"+type+"'";
	
	$("#addFlow").append('<div class="col-sm-3"><div class="'+type+'_div"><p class="nameVersion col-sm-10" name="flowName">'+name+'</p><p class="nameVersion col-sm-10" name="version">version '+version+'</p><div class="nameVersion col-sm-10" style="padding:0px; padding-top:0px;"><a class="col-sm-6" onclick="showDetail('+symbol+')" href="#" style="padding: 0px; margin-top: 0px;">简介说明</a><button class="col-sm-6 col-sm-push-1 nameVersion btn btn-success" onclick="submitParams('+symbol+','+Type+')">选择</button><input name="symbol" style="display:none;" value="" /><input name="type" style="display:none;" value="" /></div></div></div>');
	};
//函数用来显示简介说明的模态框
function showDetail(symbol){
	for(var i=0;i<allData.length;i++){
		if(allData[i]["id"] == symbol){
			var name = allData[i]["tool_name"];
			var version = allData[i]["version"];
			var summary = allData[i]["tool_abstract"];
			$('#detail').modal('show');
			
			summary = summary.replace(/\n/gm,"") 
			$("#infoDetial").html(summary); 
			$("#infoVersion").html("version &nbsp;" + version);
			$("#title").html(name); 
		};
	};
	
};


//点击选择向后台提交参数
function submitParams(symbol,type){
	project_id = $("#project_id").val();
	$.ajax({
		url: module+"/FlowApp/createTask",  //向后台提交数据的地址
		type:'post',
		dataType: "json",
		data:{id:symbol,type:type,project_id:project_id},
		success:function(data) {
			if(data['status']=='ERROR'){    //请求成功但没有执行成功
				alert(data['data']);
			}else{
				//跳转
				window.location.href= module+data['data'];
			}
		 },    
		 error : function(XMLHttpRequest) {
		   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
		 }
	});

};
//回车进行搜索
$(function(){
	$('#flowSearch').bind('keypress',function(event){
		if(event.keyCode == "13")    
		{
			var key = $("#flowSearch").val();
			if(key != ""){
				//遍历json
				var count = 0;
				$("#addFlow").html("");  //清空现有的流程和小工具
				for(var i=0;i<allData.length;i++){
					var str = allData[i]["tool_name"];
					if(str.indexOf(key)!=-1){  //判断在字符串中
				　		addDIV(i);
						count += 1; 
				 　　}
				};
				if(count == 0){
					$("#addFlow").html("没有搜索到该项！")
				};
			}
			else{   //输入框什么都没有的时候，展示所有的小工具
				$("#addFlow").html("");
				for(var i=0;i<allData.length;i++){	
					addDIV(i)
				};
			};
		}
	});
});

//二级联动导航
$(document).ready(function(){
	$("#firstAll").val("allFlowApp");  //加载完成后一级菜单置为all
	$("#secendFlow").hide(); 
	$("#secendApp").hide();
	//更改一级下拉框
   	$("#firstAll").change(function(){
		var firstKey = $("#firstAll").val();  //当前选择的一级标题
		$("#addFlow").html("");  //清空现有的流程和小工具
		if(firstKey == "allFlowApp"){    //选择all的时候
			for(var i=0;i<allData.length;i++){	//显示所有
				addDIV(i);
			};
			$("#secendAll").show();     //显示二级的all
			$("#secendApp").hide();     //隐藏二级app和flow的下拉框
			$("#secendFlow").hide();
		}
		
		else{  //选择流程或app
			for(var i=0;i<allData.length;i++){
				var type = allData[i]["type"];   //查找与当前一级标题所匹配的
				if(firstKey == type){  
			　		addDIV(i);
			 　　};
			};
			if(firstKey == "flow"){    //选择流程，显示流程的二级下拉框，去掉其他下拉框
				$("#secendFlow").show();
				$("#secendAll").hide();
				$("#secendApp").hide();
				$("#secendFlow").val("allFlow"); 
			};
			if(firstKey == "app"){     //选择app，显示app的二级下拉框，去掉其他下拉框
				$("#secendApp").show();
				$("#secendAll").hide();
				$("#secendFlow").hide();
				$("#secendApp").val("allApp"); 
			}
		};
	});
	//更改二级流程下拉框
   	$("#secendFlow").change(function(){
		var secendKey = $("#secendFlow").val();  //流程中当前选择的项
		$("#addFlow").html("");  //清空现有的流程和小工具
		if(secendKey == "allFlow"){    //选择所有的流程项目
			for(var i=0;i<allData.length;i++){
				var type = allData[i]["type"];   //查找与当前一级标题所匹配的
				if(type == "flow"){  
			　		addDIV(i);
			 　　};
			};
				
		}
		else{
			chooseSecend("secendFlow");
		};
	});
	
	//二级下拉框改变
	$("#secendApp").change(function(){
		var secendKey = $("#secendApp").val();  //流程中当前选择的项
		$("#addFlow").html("");  //清空现有的流程和小工具
		if(secendKey == "allApp"){    //选择所有的流程项目
			for(var i=0;i<allData.length;i++){
				var type = allData[i]["type"];   //查找与当前一级标题所匹配的
				if(type == "app"){  
			　		addDIV(i);
			 　　};
			};
				
		}
		else{
			chooseSecend("secendApp");
		};
	});
	function chooseSecend(secend){
		var secendKey = $("#"+secend).val();  //当前选择的流程二级标题
		$("#addFlow").html("");  //清空现有的流程和小工具
		for(var i=0;i<allData.length;i++){
			var category = allData[i]["category"];   
			if(secendKey == category){  
		　		addDIV(i);
		 　　};
		 };
	};

});

