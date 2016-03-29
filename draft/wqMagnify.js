//var img = $("img");
var xSmall, ySmall, xBig, yBig;
/*var area = function(x,y){
    console.log(x)
    if(x<75) xSamll = 0; 
    else if(x>225) xSmall = 225;
    else if(x>=75 && x<=225) xSmall = x - 75;
    if(y<75) ySmall = 0; 
    else if(y>225) ySmall = 225;
    else if(x>=75 && x<=225) ySmall = y - 75;
    xBig = xSmall*300/575;
    yBig = ySmall*300/575;
}*/
$.fn.wqMagnify = function() {
        this.each(function() {
            var $target = $(this);
            var address = $target.children('img').data('src');
            $target.css("position", "relative");
            var img = new Image();
            img.onload = function() {
                $target.mouseenter(function() {
                    var e = event || window.event;
                    var thisT = $(this);
                    var img = thisT.find("img");
                    var x0 = img.offset().left;
                    var y0 = img.offset().top;
                    var width = img.width();
                    var height = img.height();
                    thisT.width(width);
                    img.after("<div class='shadow'></div>");
                    thisT.after("<div class='wq-big'></div>");
                    thisT.after("<img class='fakeImg' src=" + address + ">");
                    $(".shadow").css("position", "absolute").css("background", "url(slash.png) repeat scroll 0 0 transparent").css("cursor", "move");
                    $(".wq-big").width(width).height(height).css("left", width + "px").css("top", 0);
                    $(".fakeImg").css("display", "none");
                    $(".wq-big").css("position", "absolute").css("border", "1px solid #ccc").css("z-index", "1000").css("background-image", "url(" + address + ")")
                    var widthBig = $(".fakeImg").width();
                    var heightBig = $(".fakeImg").height();
                    $(".fakeImg").remove();
                    thisT.mousemove(function() {
                        var e = event || window.event;
                        var x1 = e.clientX;
                        var y1 = e.clientY;
                        var x = x1 - x0;
                        var y = y1 - y0;
                        var shadowX = width * width / widthBig;
                        var shadowY = height * height / heightBig;
                        if (x < shadowX / 2) xSmall = 0;
                        else if (x > width - shadowX / 2) xSmall = width - shadowX;
                        else if (x >= shadowX / 2 && x <= width - shadowX / 2) xSmall = x - shadowX / 2;
                        if (y < shadowY / 2) ySmall = 0;
                        else if (y > height - shadowY / 2) ySmall = height - shadowY;
                        else if (y >= shadowY / 2 && y <= height - shadowY / 2) ySmall = y - shadowY / 2;
                        xBig = xSmall * widthBig / width;
                        yBig = ySmall * heightBig / height;
                        $(".wq-big").css("background-position-x", -xBig + "px").css("background-position-y", -yBig + "px");
                        $(".shadow").width(shadowX).height(shadowY).css("left", xSmall).css("top", ySmall);
                    })
                })
                $target.mouseleave(function() {
                    $(this).off("mousemove");
                    $(".wq-big, .shadow").remove();
                })
            };
            img.src = address;
        });
    }
    //wqMagnify("buick2.jpg")