 var main = function() {
 	var number = [];
 	var process = [];
 	var equalTouch;

 	$(".a").click( function() {
 		$("p").append(parseInt($(this).text()));
 	});

 	$(".b").click( function() {
 		console.log($(this).text());
 		var str=$("p").text();
 		var last=str.charAt(str.length-1);
 		if (isNaN(parseInt(last)) && last!="." && last.length !== 0) {
 			 console.log(last);
 			str=str.substring(0,str.length-1);
 			$("p").text(str);
 			process.pop();
 		}
 		$("p").append($(this).text());
 		process.push($(this).text());
 	});

 	$("#heart").click( function() {
 		var str=$("p").text();
 		var last=str.charAt(str.length);
 		if (last != ".") {
 			$("p").append(".");
 		}
 	});

 	var loop = function() {
 		var pText = $("p").text();
 		var start = 0;
 		for (var i=0; i<pText.length; i++) {
 			if(isNaN(parseInt(pText[i])) && pText[i]!=".") {
 				number.push(parseFloat(pText.substring(start,i)));
 				start = i+1;
 			}
 		}
 	};

 	var calculate = function(processValue) {
 		console.log(number);
 		switch(processValue) {
 			case "+":
 			var total=number.shift()+number.shift();
 			number.unshift(total);
 			break;
 			case "-":
 			var total=number.shift()-number.shift();
 			number.unshift(total);
 			break;
 			case "*":
 			var total=number.shift()*number.shift();
 			number.unshift(total);
 			break;
 			case"/":
 			var total=number.shift()/number.shift();
 			number.unshift(total);
 			break;
 		}
 	};

 	$("#equal").click( function() {
 		$("p").append("=");
 		equalTouch =1;
 		process.push($(this).text());
 		loop();
 		while(process.length != 0) {
 			calculate(process.shift());
 		}
 		$("p").append(number.pop().toFixed(2));
 	});

 	$("#clear").click( function() {
 		$("p").text("");
 		equalTouch =0;
 	});

 	$("#backspace").click( function() {
 		if (equalTouch==1) {
 			$("#clear").click();
 		}
 		var str=$("p").text();
 		var last=str.charAt(str.length-1);
 		if (typeof last == "number" || last=="."){}
		else {
			process.pop();
		} 
		str=str.substring(0,str.length-1);
		$("p").text(str);
 	});


 	var themeList = ['calculator-dark.css', 'calculator-cartoon.css','calculator-pink.css'];
 	var i=0;
 	$('#themeButton').click(function() {
 		i++;
 		console.log(i);
 		 var currentTheme = themeList[i];
 		 $("#theme").attr("href",currentTheme);
 		 if(i==2) {
 		 	i=-1;
 		}
 		$('<style></style>').appendTo($('body')).remove();
 	});
 }

 $(document).ready(main);