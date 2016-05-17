var main = function() {
    $('div').vikkiMagnifier();
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