var main = function() {
	var storage = [];
	var storage2 = [];
	var process = [];
	var lastTime = [];
	var lastProcess;
	var s=0;
	var equalTouch =0;
	var equalLength;
	var heart=0;
	var i=0.1
	
	$(".number > .a").click( function() {
		if (equalTouch==1) {
			$("#clear").click();
			equalTouch=0;
		} else{}
		$("p").append($(this).text());
		console.log(heart);
		
		if (heart==1) {
			s=s+parseInt($(this).text())*i;
			i=i*0.1;
			console.log(s);
		} else if(heart==0) {
			console.log(s);
			s=s*10+ parseInt($(this).text());}
			
		console.log(s);
		lastTime.push(parseInt($(this).text())); 
	});

	$("#heart").click( function() {
		heart = 1;
		$("p").append(".");
	});
	
	var calculate = function(haha)
	{
		switch(haha) {
			case '+':
				var totalAnswer=storage.shift()+storage.shift();
				storage.push(totalAnswer);
				s=0;
				return totalAnswer;
				break;
			case '-':
				console.log(storage);
				var totalAnswer=storage.shift()-storage.shift();
				storage.push(totalAnswer);
				s=0;
				return totalAnswer;
				break;
			case '*':
				var totalAnswer=storage.shift()*storage.shift();
				storage.push(totalAnswer);
				s=0;
				return totalAnswer;
				break;
			case '/':
				var totalAnswer=storage.shift()/storage.shift();
				storage.push(totalAnswer);
				s=0;
				return totalAnswer;
				break;
			}
	};
	
	$(".notnumber > .b").click( function() { 
		
		if(equalTouch==1) {  //按完等于号直接开始新运算
			var str=$("p").text();
			str=str.substring(str.length-equalLength,str.length);
			$("#clear").click();
			$("p").text(str);
			s=parseInt(str);
			equalTouch=0;
		}
		storage.push(s);             
		storage2.push(s);            
		s=0;
		$("p").append($(this).text());
		lastProcess=process[process.length-1];
		calculate(lastProcess); 
		process.push($(this).text()); //尾部再加上这一个符号 - -
		lastTime.push($(this).text()); 
		heart=0;
		i=0.1;
	});

	$("#backspace").click( function() {

		var lastTimeValue = lastTime.pop(); 
		var str=$("p").text();
			str=str.substring(0,str.length-1);
			$("p").text(str);
			console.log(lastTimeValue);

		if (typeof lastTimeValue=="number") {  //数字出错
			s=(s-lastTimeValue)/10;
		} else if (typeof lastTimeValue=="string") {
			process.pop();   //process[]
			lastProcess=process[process.length-1];
			var thisNumber = storage.shift(); //1
			console.log("thisNumber是"+thisNumber);
			var lastNumber = storage2.pop();  //2
			console.log("lastNumber是"+lastNumber);
				if(storage.length==storage2.length) {  //第一次运算符号就出错
			 		s=thisNumber;
			 	} else {    //第一次后运算符号出错
			 		var last2Number;
			 		if(lastProcess=="+") {
					 last2Number = thisNumber-lastNumber; 
					 console.log("last2Number是"+last2Number);
					}
					else if(lastProcess=="-") {
					last2Number = thisNumber+lastNumber;
					console.log("last2Number是"+last2Number);
					}
					else if(lastProcess=="*") {
					last2Number = thisNumber/lastNumber;
					console.log("last2Number是"+last2Number);
					}
					else if(lastProcess=="/") {
					last2Number = thisNumber*lastNumber;
					console.log("last2Number是"+last2Number);
					}
					storage.push(last2Number); 
					s=lastNumber;
					console.log("lastNumber是"+s);
					console.log("还没有加上最后一个数字的storage是"+storage); 
					
					} 
	    } else {
			$("#clear").click();
	}
	});

	$("#clear").click( function() {
		$("p").text("");
		s = 0;
		storage = [];
		storage2 = [];
		process = [];
		lastTime = [];
		heart=0;
	});
	
	$("#equal").click( function() {
		equalTouch=1;
		storage.push(s);
		var why=calculate(process.pop());
		$("p").append("="+why.toFixed(2));
		equalLength=why.toFixed(2).length;
		lastTime = [];
		heart=0;
	});

	$(document).keydown(function(key) {
		console.log(key.which);
		if(key.which > 48 && key.which < 59) {
      		$('.a[data-num=' + (key.which - 48) +']').click();
       	}
     });
       

};

$(document).ready(main);