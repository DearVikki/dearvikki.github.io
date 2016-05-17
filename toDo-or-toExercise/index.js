var main = function() {
    var customAjax = function(settings) {
        if (settings.headers === undefined) {
            settings.headers = {};
        }
        settings.headers['X-LC-Id'] = 'XIvYWmdhru039GIzMN5h1vUh';
        settings.headers['X-LC-Key'] = '1lpkGteyxh30sJRwGaJgEO00';
        /*if (sessionToken != undefined) {
            settings.headers['X-LC-Session'] = sessionToken;
        }*/
        haha = $.ajax(settings);
    };
    Vue.config.debug = true;
    var vl = new Vue({
            el: '#content',
            data: {
                state: {
                    editDiv: false,
                    punishment: false,
                    shadow: false,
                    prizeAlert: false,
                    prizeAlertText: ''
                },
                todo: '',
                removeListColor: 4,
                credits: {
                    amount: '',
                    prize: '',
                    spend: ''
                },
                list: {
                    id: '',
                    name: '',
                    color: '',
                    compelete: false,
                    active: ''
                },
                lists: [],
                doneLists: []
            },
            computed: {
                computedLi: {
                    get: function() {
                        var name = '';
                        this.lists.forEach(function(v) {
                            if (v.active == 'active') {
                                name = v.name
                            }
                        })
                        return name;
                    },
                    set: function(value) {
                        vl.lists.forEach(function(v) {
                            if (v.active == 'active') {
                                v.name = value;
                            }
                        })
                    }
                }
            },
            methods: {
                initialize: function() {
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/List?where={"user":"wanqicn@qq.com"}',
                        method: 'get',
                        contentType: 'application/json',
                        success: function(data, status, xhr) {
                            for (var i in data.results) {
                                if (data.results[i].compelete == false) {
                                    vl.lists.push({
                                        id: data.results[i].objectId,
                                        name: data.results[i].name,
                                        color: data.results[i].color,
                                        active: '',
                                        compelete: false,
                                        time: ''
                                    })
                                } else {
                                    vl.doneLists.push({
                                        id: data.results[i].objectId,
                                        name: data.results[i].name,
                                        time: data.results[i].time
                                    })
                                }
                            }
                        }
                    })
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/Credit?where={"user":"wanqicn@qq.com"}',
                        method: 'get',
                        contentType: 'application/json',
                        success: function(data, status, xhr) {
                            vl.credits.amount = data.results[0].credit
                        }
                    })
                },
                addList: function(color) {
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/List',
                        method: 'post',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            'user': 'wanqicn@qq.com',
                            'name': vl.list.name,
                            'color': color,
                            'compelete': false
                        }),
                        success: function(data, status, xhr) {
                            vl.list.color = color;
                            vl.list.id = data.objectId; //这里得data就只会返回一个结果
                            vl.lists.push(vl.list);
                            vl.list = '';
                        }
                    })
                },
                compeleteList: function(list) {
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/List/' + list.id,
                        method: 'put',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            'compelete': true
                        }),
                        success: function(data, status, xhr) {
                            vl.lists.map(function(v) {
                                if (v.name == list.name) {
                                    vl.doneLists.push(JSON.parse(JSON.stringify(v)));
                                    vl.doneLists[vl.doneLists.length - 1].time = new Date().getDate();
                                    vl.credits.amount += parseInt(list.color);
                                    v.compelete = true;
                                    setTimeout(function() {
                                        v.name = 'Well done!';
                                    }, 400)
                                    setTimeout(function() {
                                        vl.lists.$remove(v);
                                    }, 700)
                                }
                            })
                            customAjax({
                                url: 'https://api.leancloud.cn/1.1/classes/Credit/56e16abf1532bc0050d0f7b4',
                                method: 'put',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    'credit': vl.credits.amount
                                }),
                                success: function(data, status, xhr) {}
                            })
                        }
                    })
                },
                editList: function(list) {
                    var j;
                    for (var i = 0; i < vl.lists.length; i++) {
                        if (vl.lists[i].name == list.name) {
                            j = i;
                        }
                    }
                    vl.lists.forEach(function(v) {
                        if (v.active == 'active') {
                            v.active = '';
                            return;
                        }
                    })
                    list.active = 'active';
                    vl.state.editDiv = true;
                    $("#editDiv").css("top", parseInt(34 * j));
                },
                editDone: function() {
                    var list;
                    vl.lists.forEach(function(v) {
                        if (v.active == 'active') {
                            list = v;
                            return;
                        }
                    })
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/List/' + list.id,
                        method: 'put',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            'name': vl.computedLi
                        }),
                        success: function(data, status, xhr) {
                            vl.state.editDiv = false;
                        }
                    })
                },
                removeList: function(list) {
                    vl.lists.forEach(function(v) {
                        if (v.active == 'active') {
                            v.active = '';
                            return;
                        }
                    })
                    list.active = 'active';
                    vl.state.shadow = true;
                    vl.state.punishment = true;
                    vl.removeListColor = list.color;
                },
                closeRemove: function() {
                    vl.state.shadow = false;
                    vl.state.punishment = false;
                },
                doExercise: function() {
                    var list;
                    vl.lists.forEach(function(v) {
                        if (v.active == 'active') {
                            list = v;
                            return;
                        }
                    })
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/List/' + list.id,
                        method: 'delete',
                        contentType: 'application/json',
                        success: function(data, status, xhr) {
                            vl.state.shadow = false;
                            vl.state.punishment = false;
                            vl.lists.$remove(list);
                        }
                    });
                },
                confirmPrize: function() {
                    if (isNaN(parseInt(vl.credits.spend))) {
                        vl.state.prizeAlert = true;
                        vl.state.prizeAlertText = 'The amount of credits must be a number.'
                    } else if (parseInt(vl.credits.spend) > parseInt(vl.credits.amount)) {
                        vl.state.prizeAlert = true;
                        vl.state.prizeAlertText = 'Ooops, you need more credits.';
                    } else {
                        vl.credits.amount -= vl.credits.spend;
                        
                        customAjax({
                            url: 'https://api.leancloud.cn/1.1/classes/Credit/56e16abf1532bc0050d0f7b4',
                            method: 'put',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                'credit': vl.credits.amount
                            }),
                            success: function(data, status, xhr) {}
                        })
                         customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/Prize',
                        method: 'post',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            'user': 'wanqicn@qq.com',
                            'prize': vl.credits.prize,
                            'credit':parseInt(vl.credits.spend)
                            
                        }),
                        success:function(data,status,xhr){
                            vl.credits.prize = '';
                        vl.credits.spend = '';
                        }
                    })
                    }
                },
                closePrizeAlert: function() {
                    vl.state.prizeAlert = false;
                },
                removeForever: function(list) {
                	customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/List/' + list.id,
                        method: 'delete',
                        contentType: 'application/json',
                        success: function(data, status, xhr) {
                            vl.doneLists.$remove(list);
                        }
                    });
                    
                }
            }
        })
        /*

         	记录完成时间
         	m=new Date().getMinutes();
         	mTime.push(m);
         	$("#doneList").append("<li class='list-group-item doneListItem' style='width:395px'>"+a.text()+"<span class='addTime' style='padding-left:10px;font-weight:normal'>"+"</span>"+
         	"<span class='removeForever glyphicon glyphicon-trash' style='float:right;display:none' title='Delete forever'>"+"</span>"+"</li>");

         	$(this).css("background-color", color);
         	setTimeout(function(){a.text("Well Done!")},500);
         	setTimeout(function(){a.slideUp()},1000);
         	完成任务加分
         	switch(color){
         		case "rgb(0, 0, 255)":
         			creditAmount=creditAmount+1;
         			break;
         		case "rgb(0, 0, 0)":
         			creditAmount=creditAmount+2;
         			break;
         		case "rgb(255, 255, 0)":
         			creditAmount=creditAmount+3;
         			break;
         		case "rgb(255, 165, 0)":
         			creditAmount=creditAmount+4;
         			break;
         		case "rgb(255, 0, 0)":
         			creditAmount=creditAmount+5;
         			break;
         	}
         	$("#creditAmount").text(creditAmount);
         	listAmount=listAmount-1;
         	if(listAmount==0) {
         		$(".badge").text("");
        	} else {
        		$(".badge").text(listAmount);
        	}
        });*/
        /*控制面板*/
    $(".navList").click(function() {
            var i = $(this).index(); // 取index
            $(".tab-pane").removeClass("active in");
            $(".tab-pane").eq(i).addClass("active in"); // 同时打开对应.tab-pane的active和in
        })
       
        //显示完成时间
        /*setInterval(function() {
            historyTime = mTime.map(function(x) {
                m = new Date().getMinutes();
                return m - x
            })
            for (var i = 0; i < $(".doneListItem").length; i++) {
                var bianliang = historyTime[i];
                if (bianliang > 0) {
                    $(".doneListItem").eq(i).children(".addTime").text(bianliang + "分钟前");
                }
            }
        }, 30000);*/
        /*var inputCheckList = $('input[name="checkList"]');
        inputCheckList.focus();
        inputCheckList.keydown(function(e) {
            if (e.which === 13) {
                $('#preAdd').click();
                e.preventDefault();
            }
        });*/
    $(function() {
        $(".todoList").sortable();
        $(".todoList").disableSelection();
    });
    vl.initialize();
}
$(document).ready(main);