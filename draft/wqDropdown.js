 $.fn.wqDropdown = function() {
     this.css("position", "relative").css("index", "100");
     this.find(".wq-dropdown").css("overflow", "hidden").css("position", "absolute").css("height", "33px");
     this.find(".wq-dropdown li").css("background-color", "black").css("color", "white").css("list-style", "none").css("padding", "7px 9px").css("cursor", "pointer");
     //$(".wq-dropdown .wq-arrow").css("float","right").css("margin-right","15px");
     var originHeight = this.find(".wq-dropdown").height();
     this.find(".wq-dropdown").mouseenter(function() {
         if ($(this).is(":animated")) {
             $(this).stop();
         }
         $(this).animate({
             height: originHeight * $(this).find("li").length + "px"
         }, 500);
     })
     this.find(".wq-dropdown").mouseleave(function() {
         if ($(this).is(":animated")) {
             $(this).stop();
         }
         $(this).animate({
             height: originHeight + "px"
         }, 500);
     })
     this.on("mouseenter", ".wq-option", function() {
         $(this).css("background-color", "#d1332f");
     })
     this.on("mouseleave", ".wq-option", function() {
         $(this).css("background-color", "black");
     })
     this.on("click", ".wq-option", function() {
         var selected = $(this).parent().find(".wq-selected");
         var order = selected.data("order");
         var notSelected = selected.text().slice(0, -1);
         $(this).css("background-color", "black");
         $(this).parent().find().eq(order).after(selected);
         selected.text(selected.text().slice(0, -1));
         selected.removeClass("wq-selected").addClass("wq-option");
         $(this).append('<span class="wq-arrow">▼</span>');
         $(this).parent().prepend($(this));
         $(this).parent().find().eq(0).removeClass("wq-option").addClass("wq-selected");
     })
 }