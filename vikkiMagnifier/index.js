var main = function() {
    $('body').hide();
    //预加载
    function preloadImg(list, imgs) {
        var def = $.Deferred(),
            len = list.length;
        $(list).each(function(i, e) {
            var img = new Image();
            img.src = e;
            if (img.complete) {
                imgs[i] = img;
                len--;
                if (len == 0) {
                    def.resolve();
                }
            } else {
                img.onload = (function(j) {
                    return function() {
                        imgs[j] = img
                        len--;
                        if (len == 0) {
                            def.resolve();
                        }
                    };
                })(i);
                img.onerror = function() {
                    len--;
                    console.log('fail to load image');
                };
            }
        });
        return def.promise();
    }
    var list = []
    imgs = [];
    list.push('big.jpg','small.jpg');
    $.when(preloadImg(list, imgs)).done(function() {
        $('body').show();
        $('div').vikkiMagnifier();
    })
    
    //上传图片
    var smallSrc, smallImage, bigSrc, bigImage;
    $('#smallFile').on('change', function() {
        var file = this.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("文件必须为图片！");
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            smallSrc = this.result;
            smallImage = new Image();
            smallImage.src = smallSrc;
        }
    })
    $('#bigFile').on('change', function() {
        var file = this.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("文件必须为图片！");
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            bigSrc = this.result;
            bigImage = new Image();
            bigImage.src = bigSrc;
        }
    })
    $('button').click(function() {
        if (smallImage.width <= bigImage.width && smallImage.width <= bigImage.width) {
            $('#result').width(smallImage.width).height(smallImage.height).append('<img data-src="' + bigSrc + '" src="' + smallSrc + '" alt=""/>')
            $('#result').vikkiMagnifier();
        } else{
        	alert('小图长宽最好要比大图小哟~~')
        }
    })
}
$(document).ready(main);