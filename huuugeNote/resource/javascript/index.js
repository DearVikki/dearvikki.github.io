var main = function() {
    //初始化
    AV.initialize('XIvYWmdhru039GIzMN5h1vUh', '1lpkGteyxh30sJRwGaJgEO00');
    User = AV.User;
    user = new User();
    currentUser = User.current();
    Note = AV.Object.extend("Note")
    editor = new Simditor({
        textarea: $('#editor')
    });
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
    //笔记栏与笔记本栏
    $('.centerbar').mouseenter(function() {
        if ($('.notebar').hasClass('mouseactive')) {
            $('.centerbar,.notebar').toggleClass('mouseactive')
        }
    })
    $('.centerbar').mouseleave(function() {
            if ($('.centerbar').hasClass('mouseactive')) {
                $('.centerbar,.notebar').toggleClass('mouseactive')
            }
        })
        //侧边栏
    $('.icoon').mouseenter(function() {
        var icoon = $('.icoon')
        if (icoon.is(":animated")) {
            icoon.stop();
        }
        icoon.animate({
            top: '-73px'
        }, 500)
        if ($(this).find('.detail').length == 1) {
            if ($(this).is(":animated")) {
                $(this).stop(true, true);
            }
            $(this).animate({
                top: '-120px'
            })
        } else {
            $(this).find('i').hide();
            $(this).find('img').show();
        }
    })
    $('.icoon').mouseleave(function() {
        var icoon = $('.icoon')
        if ($(this).is(":animated")) {
            $(this).stop(true, true);
        }
        $(this).animate({
            top: '-95px'
        })
        if ($(this).find('.detail').length !== 1) {
            $(this).find('img').hide();
            $(this).find('i').show();
        }
    })
    $('.sidebar-wrapper').mouseleave(function() {
            setTimeout(function() {
                $('.icoon').animate({
                    top: '0px'
                })
            }, 500)
        })
        //笔记左右移应该用css做较好的
    $('.index-wrapper').on('mouseenter', '.more', function() {
        $('.moreActive').removeClass('moreActive');
        $(this).parents('.indexInsidewrap').addClass('moreActive');
    })
    $('.index-wrapper').on('mouseenter', '.more2', function() {
            $(this).parents('.indexInsidewrap').removeClass('moreActive');
        })
        //笔记本部分
    Vue.config.debug = true;
    var vn = new Vue({
            el: '#noteContainer',
            data: {
                type: '全部笔记',
                reminder: {
                    status: 'false',
                    text: '耶保存成功啦',
                    theme: 'black'
                },
                history: {
                    lastNote: '',
                    thisTitle: '',
                    lastTitle: '',
                    thisContent: '',
                    lastContent: '',
                    lastNotebook: ''
                },
                note: {
                    id: 'new',
                    title: '未命名',
                    content: '',
                    indexContent: '',
                    time: '创建中…',
                    star: 2,
                    indexActive: '',
                    notebook: ''
                },
                notes: [],
                notebooks: []
            },
            computed: {
                computedTitle: {
                    get: function() {
                        var title = '';
                        this.notes.forEach(function(v) {
                            if (v.indexActive == 'indexActive') {
                                title = v.title;
                            }
                        })
                        return title;
                    },
                    set: function(value) {
                        vn.notes.forEach(function(v) {
                            if (v.indexActive == 'indexActive') {
                                v.title = value;
                            }
                        })
                    }
                }
            },
            methods: {
                removeHTMLTag: function(str) {
                    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
                    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
                    str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
                    str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
                    return str;
                },
                allNoteOf: function(notebook, star) {
                    console.log(localStorage.getItem('user'))
                    vn.type = '全部笔记'
                    var whereObj = {
                        user: localStorage.getItem('user')
                    };
                    if (typeof notebook !== 'undefined') {
                        vn.type = notebook.name;
                        if (notebook.name == '散装笔记') whereObj['notebook'] = '';
                        else whereObj['notebook'] = notebook.name;
                    }
                    if (typeof star !== 'undefined') {
                        vn.type = '星标笔记'
                        whereObj['star'] = 1;
                    }
                    vn.clearList();
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/Note?where=' + JSON.stringify(whereObj),
                        method: 'get',
                        contentType: 'application/json',
                        success: function(data, status, xhr) {
                            for (var i in data.results) {
                                vn.notes.push({
                                    title: data.results[i].title,
                                    content: data.results[i].content,
                                    indexContent: vn.removeHTMLTag(data.results[i].content.slice(0, 20)),
                                    time: moment(data.results[i].createdAt).format('YYYY年M月D日'),
                                    id: data.results[i].objectId,
                                    star: data.results[i].star,
                                    indexActive: '',
                                    notebook: data.results[i].notebook
                                })
                                if (i == 0) {
                                    editor.setValue(data.results[i].content)
                                    vn.notes[i].indexActive = 'indexActive';
                                    vn.history.lastTitle = data.results[i].title;
                                    vn.history.lastContent = vn.history.thisContent = data.results[i].content;
                                    vn.history.lastNote = data.results[i].objectId;
                                    vn.history.lastNotebook = data.results[i].notebook;
                                }
                            }
                        }
                    })
                },
                addNote: function() {
                    vn.history.lastTitle = '';
                    vn.history.lastContent = vn.history.thisContent = '';
                    editor.setValue('');
                    vn.history.lastNote = this.note.id;
                    vn.history.lastNotebook = this.note.notebook;
                    this.notes.push(this.note);
                    this.$nextTick(function() {
                        vn.notes.forEach(function(v) {
                            if (v.indexActive == 'indexActive') {
                                v.indexActive = '';
                                return;
                            }
                        })
                        this.note.indexActive = 'indexActive';
                    })
                },
                saveNote: function(cb) {
                    if (vn.history.lastNote !== 'new') {
                        customAjax({
                            url: 'https://api.leancloud.cn/1.1/classes/Note/' + vn.history.lastNote,
                            method: 'put',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                'title': vn.computedTitle,
                                'content': editor.getValue(),
                                'indexContent': vn.removeHTMLTag(editor.getValue().slice(0, 20)),
                                'notebook': $('.indexActive .indexNotebook').val()
                            }),
                            success: function(data, status, xhr) {
                                vn.history.lastNote.content = editor.getValue();
                                vn.notes.forEach(function(v) {
                                    if (v.indexActive == 'indexActive') {
                                        v.content = editor.getValue();
                                        v.indexContent = vn.removeHTMLTag(editor.getValue().slice(0, 20));
                                    }
                                })
                                if (typeof cb == 'function') cb()
                                vn.reminder.text = "耶保存成功啦";
                                vn.reminder.status = 'true';
                                setTimeout(function() {
                                    vn.reminder.status = 'false';
                                }, 1500)
                            }
                        })
                    } else {
                        customAjax({
                            url: 'https://api.leancloud.cn/1.1/classes/Note',
                            method: 'post',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                'user': localStorage.getItem('user'),
                                'title': vn.computedTitle,
                                'content': editor.getValue(),
                                'indexContent': vn.removeHTMLTag(editor.getValue().slice(0, 20)),
                                'star': 0
                            }),
                            success: function(data, status, xhr) {
                                vn.notes.forEach(function(v) {
                                    if (v.id == 'new') {
                                        v.id = data.objectId;
                                        v.star = 0;
                                        v.time = moment(data.createdAt).format('YYYY年M月D日');
                                        v.content = editor.getValue();
                                        v.indexContent = vn.removeHTMLTag(editor.getValue().slice(0, 20)),
                                            vn.history.lastNote = v.id;
                                    }
                                })
                                if (typeof cb == 'function') cb();
                                vn.reminder.text = "耶新建成功啦";
                                vn.reminder.status = 'true';
                                setTimeout(function() {
                                    vn.reminder.status = 'false';
                                }, 1500)
                            }
                        })
                    }
                },
                deleteNote: function(note) {
                    vn.notes.$remove(note);
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/Note/' + note.id,
                        method: 'delete',
                        contentType: 'application/json',
                        success: function(data, status, xhr) {
                            var notePlace = vn.notes.indexOf(note);
                            if (notePlace > 1) {
                                vn.switchWithOutSave(vn.notes[notePlace - 1]);
                            } else if (notePlace < vn.notes.length) {
                                vn.switchWithOutSave(vn.notes[notePlace + 1]);
                            } else {
                                vn.history.lastTitle = '';
                                vn.history.lastContent = vn.history.thisContent = '';
                            }
                            vn.reminder.text = "哼唧丢掉成功啦";
                            vn.reminder.status = 'true';
                            setTimeout(function() {
                                vn.reminder.status = 'false';
                            }, 1500)
                        }
                    });
                },
                switchWithOutSave: function(note) {
                    vn.history.lastTitle = note.title;
                    vn.history.lastContent = vn.history.thisContent = note.content;
                    vn.history.lastNote = note.id;
                    vn.history.lastNotebook = note.notebook;
                    editor.setValue(note.content);
                    vn.notes.forEach(function(v) {
                        if (v.indexActive == 'indexActive') {
                            v.indexActive = '';
                            return;
                        }
                    })
                    note.indexActive = 'indexActive';
                    console.log(vn.history.lastNote)
                },
                switchNote: function(note) {
                    console.log($('.indexActive .indexNotebook').val() + vn.history.lastNotebook)
                    if (vn.computedTitle == vn.history.lastTitle && (editor.getValue() == vn.history.lastContent && $('.indexActive .indexNotebook').val() == vn.history.lastNotebook)) {
                        console.log('无改变')
                        vn.switchWithOutSave(note);
                    } else {
                        console.log('有改变')
                        vn.saveNote(function() {
                            vn.switchWithOutSave(note);
                        })
                    }
                },
                addStar: function(noteID) {
                    vn.notes.forEach(function(v) {
                        if (v.id === noteID) {
                            note = v;
                        }
                    });
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/Note/' + noteID,
                        method: 'put',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            star: !note.star + 0
                        }),
                        success: function(data, status, xhr) {
                            note.star = !note.star + 0;
                        }
                    })
                },
                allNotebook: function() {
                    vn.type = '全部笔记本'
                    vn.clearList();
                    console.log(localStorage.getItem("user"))
                    customAjax({
                        url: 'https://api.leancloud.cn/1.1/classes/Note?where={"user":"' + localStorage.getItem("user") + '"}',
                        method: 'get',
                        contentType: 'application/json',
                        success: function(data, status, xhr) {
                            var notebook = [];
                            for (var i in data.results) {
                                var notebookName = (data.results[i].notebook == '') ? '散装笔记' : data.results[i].notebook;
                                var notebookExist = 0;
                                for (var r in notebook) {
                                    if (notebook[r].name == notebookName) {
                                        notebook[r].size += 1;
                                        notebookExist = 1;
                                        break;
                                    }
                                }
                                if (notebookExist == 0) {
                                    notebook.push({
                                        name: notebookName,
                                        size: 1
                                    })
                                }
                                if (notebook.length == 0) {
                                    notebook.push({
                                        name: notebookName,
                                        size: 1
                                    })
                                }
                            }
                            notebook = notebook.sort();
                            for (var i in notebook) {
                                vn.notebooks.push({
                                    name: notebook[i].name,
                                    size: notebook[i].size
                                })
                            }
                        }
                    })
                },
                clearList: function() {
                    var x = vn.notebooks.length,
                        y = vn.notes.length;
                    for (var i = 0; i < x; i++) {
                        vn.notebooks.$remove(vn.notebooks[0]);
                    }
                    for (var i = 0; i < y; i++) {
                        vn.notes.$remove(vn.notes[0]);
                    }
                },
                changeTheme: function(theme) {
                    if (theme == 'pink') {
                        less.modifyVars({
                            '@topic-color': '#434343'
                        });
                        vn.reminder.theme = 'black';
                    } else if (theme == 'black') {
                        less.modifyVars({
                            '@topic-color': '#92A8D1'
                        });
                        vn.reminder.theme = 'blue';
                    } else if (theme == 'blue') {
                        less.modifyVars({
                            '@topic-color': '#F7CAC9'
                        });
                        vn.reminder.theme = 'pink';
                    }
                },
                logOut: function() {
                    AV.User.logOut();
                    localStorage.removeItem('user');
                    currentUser = AV.User.current();
                    $('#noteContainer').fadeOut();
                    $('.welcome .step3').val('');
                    $('.dimmer').show();
                    setTimeout(function() {
                        $('.welcome .step3,.traveller').fadeIn().css('display', 'block');
                    }, 1000);
                }
            }
        })
        //用户登陆
    if (localStorage.getItem('user')) {
        $('.dimmer').hide();
        $('#noteContainer').show();
        //var avatar = currentUser.get('avatar');
        try {
            $('.avatar').attr('src', avatar.url());
        } catch (e) {}
        vn.allNoteOf();
    } else {
        $('.welcome .step1').fadeIn()
        setTimeout(function() {
            $('.welcome .step1').fadeOut()
        }, 1000);
        setTimeout(function() {
            $('.welcome .step2').fadeIn().css('display', 'block');
        }, 1400);
        setTimeout(function() {
            $('.welcome .step2').fadeOut().css('display', 'block');
        }, 2400);
        setTimeout(function() {
            $('.welcome .step3,.traveller').fadeIn().css('display', 'block');
        }, 2800);
    }
    //注册与登录
    $('.welcome input').focus(function() {
        $('.welcome .label').addClass('hidden');
    })
    var email;
    $('.step3 .button').click(function() {
        var val = $('.step3 input').val();
        if (!validator.isEmail(val)) {
            $('.step3 .label').removeClass("hidden");
        } else {
            $('.welcome .step3').fadeOut();
            setTimeout(function() {
                $('.welcome .step4').fadeIn()
            }, 500);
            email = val;
        }
    })
    $('.step4 .button').click(function() {
        var password = $('.step4 input').val();
        if (password.length < 6) {
            $('.step4 .label').text('密码至少要6位喔').removeClass('hidden');
        } else {
            customAjax({
                url: 'https://api.leancloud.cn/1.1/users',
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    "username": email,
                    "password": password,
                    "email": email
                }),
                success: function(data, status, xhr) {
                    if (xhr.status === 201) {
                        $('.welcome .step4').fadeOut();
                        setTimeout(function() {
                            $('.welcome .step5').text('欢迎你，' + email).fadeIn()
                        }, 500);
                        setTimeout(function() {
                            $('.dimmer').fadeOut();
                            $('#noteContainer').show();
                        }, 1500);
                        localStorage.setItem('user', email);
                        vn.allNoteOf();
                    }
                },
                error: function(xhr, status) {
                    if (JSON.parse(xhr.responseText).code == 203) {
                        customAjax({
                            url: 'https://api.leancloud.cn/1.1/login?username=' + email + '&password=' + password,
                            method: 'get',
                            error: function(xhr, status) {
                                if (JSON.parse(xhr.responseText).code == 210) {
                                    $('.step4 .label').text('密码错误 T^T').removeClass('hidden');
                                }
                            },
                            success: function(data, status, xhr) {
                                if (xhr.status === 200) {
                                    localStorage.setItem('user', email)
                                    sessionToken = data.sessionToken;
                                    vn.allNoteOf();
                                    $('.welcome .step4').fadeOut();
                                    setTimeout(function() {
                                        $('.welcome .step5').text('欢迎回来，' + email).fadeIn();
                                        //var avatar = currentUser.get('avatar');
                                        try {
                                            $('.avatar').attr('src', avatar.url());
                                        } catch (e) {}
                                    }, 500);
                                    setTimeout(function() {
                                        $('#noteContainer').show();
                                        $('.welcome .step5').fadeOut();
                                        $('.dimmer').fadeOut();
                                    }, 1500);
                                }
                            }
                        });
                    }
                }
            });
        }
    })
    $('#back').click(function() {
        $('.welcome .step4').fadeOut();
        setTimeout(function() {
            $('.welcome .step3').fadeIn()
        }, 500);
    })
    $("#forget").click(function() {
        AV.User.requestPasswordReset(email, {
            success: function() {
                alert("请前往邮箱修改密码")
            },
            error: function(error) {
                if (error.code == 205) {}
            }
        });
    })
    $('.traveller').click(function() {
        localStorage.setItem('user', 'wanqicn@qq.com');
        vn.allNoteOf();
        $('#noteContainer').fadeIn();
        $('.welcome .step3,.welcome .step4').fadeOut();
        setTimeout(function() {
            $('.welcome .step5').text('欢迎来看看~' ).fadeIn()
        }, 500);
        setTimeout(function() {
            $('.welcome .step5,.dimmer').text('欢迎来看看~' ).fadeOut();
        }, 2000);

    })
}
$(document).ready(main);