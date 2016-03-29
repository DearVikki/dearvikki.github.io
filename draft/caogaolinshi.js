var main = function() {
    var vm = new Vue({
        el: "#todo",
        data: {
            list: "",
            lists: [],
            doneLists: []
        },
        methods: {
            add: function() {
                this.lists.push(this.list);
                this.list = "";
            },
            delete: function(list) {
            	this.doneLists.push(list);
            	this.lists.$remove(list);
            },
            deleteForever: function(doneList) {
            	this.doneLists.$remove(doneList);
            }
        }
    })
    var vpw = new Vue({
    	el: "#pw",
    	data: {
    		pw: ""
    	}/*,
    	computed: {
    		mes: function(){
    			if(pw.length<5 && pw.length != 0){
    				console.log('wow')
    				return "insecure"
    			} else if(pw.length<8){
    				return "secure"
    			} else if(pw.length>=8){
    				return "extremely secure"
    			}
    		} 
    	}*/
    })
    /*$('input.pw').keydown(function(){
    	if($('.ui.progress').hasClass('warning')){
    		$(".label.pw").text("secure");
    		console.log('wow')
    	} else if($('.ui.progress').hasClass('success')){
    		$(".label.pw").text("extremely secure");
    	}
    	console.log('hey')
    })*/
}
$(document).ready(main);