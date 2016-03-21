var data = new Firebase('https://allergyhelper3.firebaseio.com');
var name = $("#name").val('');
var component  = $("#component").val(''); 
var users = data.child("components");
var value="";
$("#submit").on('click',function(){
    name = $("#name").val();
    component  = $("#component").val(); 
    isNull = name == undefined || name == "" && component == undefined || component == ""
    if(isNull){
    	return;
    }else{
    	
    }
});

$(function(){
   
})


}
    