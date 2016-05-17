var xSmall, ySmall, xBig, yBig;
$.fn.vikkiMagnifier = function() {
        this.each(function() {
            var $target = $(this);
            //大图的src地址
            var address = $target.children('img').data('src');
            $target.css("position", "relative");
            var img = new Image();
            img.onload = function() {
                var shadow;
                var big;
                $target.mouseenter(function() {
                    var e = event || window.event;
                    var smallimg = $target.find("img");
                    var x0 = smallimg.offset().left;
                    var y0 = smallimg.offset().top;
                    var widthSmall = smallimg.width();
                    var heightSmall = smallimg.height();
                    $target.width(widthSmall);
                    shadow = $('<div>'); //遮罩区域
                    big = $('<div>'); //右侧大图片区域
                    smallimg.after(shadow);
                    smallimg.after(big);
                    shadow.css("position", "absolute").css("background", "url(slash.png) repeat scroll 0 0 transparent").css("cursor", "move");
                    big.width(widthSmall).height(heightSmall).css("left", widthSmall + "px").css("top", 0).css("position", "absolute").css("border", "1px solid #ccc").css("z-index", "1000").css("background-image", "url(" + address + ")");
                    var widthBig = img.width,
                        heightBig = img.height; //大图片高宽
                    $target.mousemove(function() {
                        var e = event || window.event;
                        var x1 = e.clientX,
                            y1 = e.clientY;
                        var x = x1 - x0,
                            y = y1 - y0;
                        var shadowX = widthSmall * widthSmall / widthBig,
                            shadowY = heightSmall * heightSmall / heightBig;
                        if (x < shadowX / 2) xSmall = 0;
                        else if (x > widthSmall - shadowX / 2) xSmall = widthSmall - shadowX;
                        else if (x >= shadowX / 2 && x <= widthSmall - shadowX / 2) xSmall = x - shadowX / 2;
                        if (y < shadowY / 2) ySmall = 0;
                        else if (y > heightSmall - shadowY / 2) ySmall = heightSmall - shadowY;
                        else if (y >= shadowY / 2 && y <= heightSmall - shadowY / 2) ySmall = y - shadowY / 2;
                        xBig = xSmall * widthBig / widthSmall;
                        yBig = ySmall * heightBig / heightSmall;
                        //大图片应出现的局部区域
                        big.css("background-position-x", -xBig + "px").css("background-position-y", -yBig + "px");
                        //遮罩大小位置
                        shadow.width(shadowX).height(shadowY).css("left", xSmall).css("top", ySmall);
                    })
                })
                $target.mouseleave(function() {
                    $(this).off("mousemove");
                    try {
                        shadow.remove();
                        big.remove();
                    } catch (e) {}
                })
            };
            img.src = address;
        });
    }