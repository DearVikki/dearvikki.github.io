var main = function() {
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
    $('img').each(function() {
        list.push($(this).attr('src'));
    });
    list.push('images/hat.png', 'images/rabbit1.png', 'images/rabbit1-popping.png', 'images/rabbit1-walking.png', 'images/rabbit2.png', 'images/rabbit2-popping.png', 'images/rabbit2-walking.png', 'images/rabbit34.png', 'images/rabbit3-popping.png', 'images/rabbit3-walking.png', 'images/rabbit4-popping.png', 'images/rabbit4-walking.png', 'images/car-body.png', 'images/car-wheel1.png', 'images/car-wheel2.png', 'images/wdw56-mask.png', 'images/wdw6-bar-draft.png');
    $.when(preloadImg(list, imgs)).done(function() {
        //预加载结束
        //warmup animation section
        setTimeout(function() {
            $('.rbt').addClass('active')
        }, 500)
        $('.rbtBox').on('webkitAnimationEnd', '.rbt', function() {
            $('.rbt').removeClass('rbt').addClass('rbt1');
        })
        $('.rbtBox').on('webkitAnimationEnd', '.rbt1', function() {
            $('.rbt1').addClass('rbt2').removeClass('rbt1');
            $('.rbt1Box .pop').addClass('active');
        })
        $('.rbtBox').on('webkitAnimationEnd', '.rbt2', function() {
            $('.rbt2').addClass('rbt34').removeClass('rbt2');
            $('.rbt2Box .pop').addClass('active');
        })
        $('.rbtBox').on('webkitAnimationEnd', '.rbt34', function() {
            $('.rbt34').removeClass('rbt34 active').addClass('rbt hat');
            $('.rbt3Box .pop,.rbt4Box .pop').addClass('active');
            setTimeout(function() {
                greetingShow();
            }, 800)
        })
    });
    //words appear
    var greetingShow = function() {
            $('.rbt2Box .word').addClass('active');
            setTimeout(function() {
                $(this).addClass('wordScale')
                $('.rbt4Box .word').addClass('active');
            }, 1000)
            setTimeout(function() {
                $('.rbt3Box .word').addClass('active');
            }, 2000)
            setTimeout(function() {
                $('.rbt1Box .word').addClass('active');
            }, 3000)
            setTimeout(function() {
                $('.doorBox').show();
                var i = 0;
                $('.homeBox span').each(function() {
                    var $this = $(this)
                    i++;
                    ! function($this, i) {
                        setTimeout(function() {
                            $this.css('opacity', 1)
                        }, 100 * i)
                    }($this, i)
                })
            }, 4000)
        }
        //door appears
    $('.doorBox').click(function() {
            $(this).addClass('active');
            setTimeout(function() {
                $('.doorBox .door').addClass('active');
                setTimeout(function() {
                    greetingHide();
                    //$('.homeBox').fadeOut(2000);
                    var i = 0;
                    $('.homeBox span').each(function() {
                        var $this = $(this)
                        i++;
                        ! function($this, i) {
                            setTimeout(function() {
                                $this.css('opacity', 0)
                            }, 100 * i)
                        }($this, i)
                    })
                    setTimeout(function() {
                        rbtBack();
                        setTimeout(function() {
                            $('.doorBox .door').removeClass('active');
                            $('.homeBox').hide();
                            if ($('.mainBox').data('active') != 1) wdwSection();
                        }, 10500)
                    }, 2000)
                }, 1000)
            }, 500)
        })
        //words disappear
    var greetingHide = function() {
            $('.rbt1Box .word').removeClass('active');
            setTimeout(function() {
                $('.rbt3Box .word').removeClass('active');
            }, 700)
            setTimeout(function() {
                $('.rbt4Box .word').removeClass('active');
            }, 1500)
            setTimeout(function() {
                $('.rbt2Box .word').removeClass('active');
            }, 2000)
        }
        //rabbits disappear
    var rbtBack = function() {
        var rbtbackPattern = function(obj) {
            obj.find('.pop').removeClass('active').addClass('popBack');
            setTimeout(function() {
                obj.addClass('boxPopBack');
            }, 500)
        }
        setTimeout(function() {
            rbtbackPattern($('.rbt1Box'))
        }, 0)
        setTimeout(function() {
            rbtbackPattern($('.rbt3Box'))
        }, 500)
        setTimeout(function() {
            rbtbackPattern($('.rbt4Box'))
        }, 1000)
        setTimeout(function() {
            rbtbackPattern($('.rbt2Box'))
        }, 1500)
        setTimeout(function() {
            $('.rbt').addClass('changeCar')
            setTimeout(function() {
                $('.rbt').addClass('carActive');
            }, 1000)
        }, 4500)
        $('.rbt1Box,.rbt2Box,.rbt3Box,.rbt4Box').on('webkitTransitionEnd', function() {
            var $this = $(this)
            $this.find('.pop').addClass('vanish');
            ! function($this) {
                setTimeout(function() {
                    $this.hide();
                }, 2000)
            }($this)
        }).children().on("webkitTransitionEnd", function() {
            return false;
        });
    }
    var wdwSection = function() {
            $('.skip').hide();
            $('.mainBox').show();
            $('.wdw').each(function() {
                var $this = $(this),
                    time = $this.data('wdwshow');
                ! function(time, $this) {
                    setTimeout(function() {
                        $this.show()
                        setTimeout(function() {
                            $this.removeClass('nowidth').removeClass('noheight');
                            setTimeout(function() {
                                $this.find('.hide').removeClass('hide');
                            }, 1000)
                        }, 100)
                    }, time)
                }(time, $this)
            })
            setTimeout(function() {
                $('.ad').show();
                setTimeout(function() {
                    $('.ad').removeClass('bigsize');
                }, 500)
            }, 9500)
        }
        //skip warmup animation
    $('.skip').click(function() {
            $('.rbtBox,.homeBox').fadeOut();
            $('.mainBox').data('active', 1);
            wdwSection();
        })
        //window section
    $('.wdw3').mouseenter(function() {
        var wdw3Rbt = $('.wdw3-rbt');
        if (!(wdw3Rbt.hasClass('pop') || wdw3Rbt.hasClass('fly0') || wdw3Rbt.hasClass('fly1') || wdw3Rbt.hasClass('fly2'))) {
            wdw3Rbt.addClass('pop');
            for (var i = 1; i < 6; i++) {
                (function(i) {
                    setTimeout(function() {
                        $('.wdw3-skill' + i).addClass('active');
                        if (i == 5) wdw3Rbt.removeClass('pop').addClass('fly0')
                    }, i * 800)
                })(i)
            }
            setTimeout(function() {
                wdw3Rbt.addClass('fly1');
                setTimeout(function() {
                    wdw3Rbt.removeClass('fly0').removeClass('fly1').addClass('fly2');
                    setTimeout(function() {
                        wdw3Rbt.removeClass('fly2');
                        $('.wdw3-skill').removeClass('active')
                    }, 100)
                }, 300)
            }, 5000)
        }
    })
    $('.wdw56-windowBar1').on({
        mouseenter: function() {
            $('.wdw56-woman').addClass('active');
        },
        mouseleave: function() {
            $('.wdw56-woman').removeClass('active');
            $('.wdw56-heart').hide().removeClass('left');
        }
    })
    $('.wdw56-windowBar2').on({
        mouseenter: function() {
            $('.wdw56-man').addClass('active');
        },
        mouseleave: function() {
            $('.wdw56-man').removeClass('active');
            $('.wdw56-heart').hide().removeClass('right');
        }
    })
    $('.wdw56-origin').on('webkitTransitionEnd', function() {
        console.log($('.wdw56-woman').css('left'))
        if ($('.wdw56-woman').css('left') == '50px') {
            $('.wdw56-heart').addClass('left').show();
        } else if ($('.wdw56-man').css('left') == '115px') {
            $('.wdw56-heart').addClass('right').show();
        }
    })
    $('.wdw7-fan-part1').on({
            mouseenter: function() {
                $('.wdw7-hot,.wdw7-eat').fadeOut();
                $('.wdw7-great,.wdw7-wind').fadeIn();
            },
            mouseleave: function() {
                $('.wdw7-hot,.wdw7-eat').fadeIn();
                $('.wdw7-great,.wdw7-wind').fadeOut();
            }
        })
        //点击窗户
    $('.origin').click(function() {
            $('.wdw').removeClass('shuffle1').removeClass('shuffle2').removeClass('shuffle3').removeClass('detailShow');
            var thisWdw = $(this).parents('.wdw'),
                dataWdw = thisWdw.data('wdw');
            thisWdw.addClass('detailShow');
            $('.wdw').addClass('shuffle' + dataWdw);
            if (dataWdw == 3) {
                $('.wdw3-arrow-left').show();
            }
        })
        //关闭窗户
    $('.detail-close').click(function() {
            var dataWdw = $(this).parents('.wdw').data('wdw');
            $('.wdw').removeClass('shuffle' + dataWdw);
            setTimeout(function() {
                    $('.wdw' + dataWdw).removeClass('detailShow')
                }, 300) //这里为了解决窗户缩小时背景图片都看得见的问题 处理的不是很好                                            
            if (dataWdw == 3) {
                $('.wdw3-detail-pages').css('left', 0);
            }
        })
        //wdw2
    $('.wdw2-start').click(function() {
        if (!$(this).hasClass('transitioning')) {
            $(this).addClass('transitioning')
            for (var i = 1; i < 4; i++) {
                $('.wdw2-m' + i).data('slideTime', Math.floor(5 * Math.random()));
                $('.wdw2-m' + i).data('lastBlocks', Math.floor(5 * Math.random()));
            }
            $('ul.active0').css('top', '-420px')
            $('ul.active').css('top', '-120px');
        }
    })
    $('.wdw2-m').on('webkitTransitionEnd', function() {
            if ($(event.target).hasClass('active0')) {
                var $this = $(event.target).parents('.wdw2-m'),
                    slideTime = $this.data('slideTime'),
                    lastBlocks = $this.data('lastBlocks')
                var top = parseInt($this.find('ul.active').css('top').slice(0, -2)) + 300;
                if (slideTime >= 0 || (slideTime < 0 && lastBlocks > 2)) {
                    $this.find('ul.active0').remove();
                    $this.append($this.find('ul.active').clone().css('top', top + 'px'))
                    $this.find('ul.active:first-child').removeClass('active').addClass('active0');
                }
                if (slideTime > 0) {
                    setTimeout(function() {
                        $this.find('ul.active0').css('top', '-420px')
                        $this.find('ul.active').css('top', '-120px');
                    }, 10)
                } else if (slideTime == 0) {
                    setTimeout(function() {
                        $this.find('ul.active0').css('top', -120 - lastBlocks * 60 + 'px')
                        $this.find('ul.active').css('top', 180 - lastBlocks * 60 + 'px');
                    }, 10)
                } else if (slideTime < 0) {
                    setTimeout(function() {
                        $('.wdw2-start').removeClass('transitioning');
                    }, 1500)
                }
                $this.data('slideTime', slideTime - 1);
            }
        })
        //wdw3-pages
    $('.wdw3-arrow-left').click(function() {
        var left = $('.wdw3-detail-pages').css('left').slice(0, -2);
        left -= 330;
        $('.wdw3-detail-pages').css('left', left + 'px');
        if (left == -660) $(this).hide();
        $('.wdw3-arrow-right').show();
    })
    $('.wdw3-arrow-right').click(function() {
            var left = $('.wdw3-detail-pages').css('left').slice(0, -2);
            left = parseInt(left) + 330;
            $('.wdw3-detail-pages').css('left', left + 'px');
            if (left == 0) $(this).hide();
            $('.wdw3-arrow-left').show();
        })
        //cloud section
    $('.cloud').click(function() {
        var x = event.pageX;
        if (parseInt($(this).css('left').slice(0, -2)) < $('.cloudBox').width()) $(this).css('left', x + 3 + 'px');
    })
    $('.cloud').on('animationiteration', function() {
        $(this).css('left', '-20px');
    })
}
$(document).ready(main);