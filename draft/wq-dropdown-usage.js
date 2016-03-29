var main = function() {
    AV.initialize('XIvYWmdhru039GIzMN5h1vUh', '1lpkGteyxh30sJRwGaJgEO00');
    var Test = AV.Object.extend('Test');
    
    var test = new Test();
    test.save({
        content: "哈哈哈哈11111",
        pubUser: "嘿嘿",
        phone: 13750011204
    }, {
        success: function(test) {
            console.log(test.get('phone'));
        }
    });

    var query = new AV.Query(Test);
    //query.equalTo("pubUser", "嘿嘿");
    query.find({
        success: function(tests) {
        	tests.forEach(function(test){
        		console.log(test.get('content'))
        	});
            
            alert(content);
        },
        error: function(error) {
        	alert("something wrong")
        }
    });
    $(".wq-dropdownContainer").wqDropdown();
}
$(document).ready(main);