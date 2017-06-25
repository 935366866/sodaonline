//页面加载完成后
$(function(){
    var options = {
        url  : 'php/connector.minimal.php',  // connector URL (REQUIRED)
        lang : 'zh_CN',            // language (OPTIONAL)
        height:500  
    }

    $('#elfinder').elfinder(options); 

});
