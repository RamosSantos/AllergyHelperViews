// var ref = new Firebase('https://allergyhelper3.firebaseio.com/');
// $("#test").on('click',function(){
//     ref.child('allergies').on('value',  function (snapshot){
//         var obj = snapshot.key();
//         alert(obj);
//         alert("callback in");
//     });
// });

var substancies = new Firebase("https://allergyhelper3.firebaseio.com/substancies");


$("#test").on('click',function(){
	substancies.orderByChild("name").equalTo("Água").on('child_added',function(snap){
	  	alert(snap.val().name);
	});  
});

