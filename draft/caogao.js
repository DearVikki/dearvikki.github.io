var main = function() {
    /*var leftSlide = function(){
      var imgWrapper = $('.img-wrapper'); 
      console.log($('.img-wrapper').css('right'))   
        if(imgWrapper.css('right')=='0px'){
          console.log($('img').eq(0))
          imgWrapper.append($('img').eq(0))
        }
 
      imgWrapper.animate({right:'+=420px'},1000);
    }
    $('.fa-angle-left').click(function(){
      if(!$(this).is(':animated')) {
        leftSlide();
      }
    })
    $('.example').mouseenter(function(){
      clearInterval(slideInterval);
    })
    $('.example').mouseleave(function(){
      slide();
    })
    var slide = function(){
      slideInterval = setInterval(function(){
      leftSlide();
    },3000)}
      slide();
      */
    $('input').focus(function() {
        $('label').addClass('focusLa')
    })
    $('input').blur(function() {
        if ($('input').val() == '') {
            $('.focusLa').removeClass('focusLa')
        }
    })
   $('#b-btn').click(function(){
    $('.flip1').addClass('active')
   })
   $('#f-btn').click(function(){
    $('.flip1').removeClass('active')
   })
   $('#b').focus(function(){
    $('.wrap').addClass('flip')
   });
    $('#b').blur(function(){
    $('.wrap').removeClass('flip')
   });

}
$(document).ready(main);