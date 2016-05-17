var main = function() {
    var a = [];
    var newFood;
    var lastDirection;
    var point = 0;
    var touch = 0;
    var color;
    var t = 60;
    var moveViaDirection = function(direction, newSnake) {
        endGame = function() {
            clearInterval(run);
            clearInterval(countDown);
            $('#pause').hide();
            if (point < 10) {
                $("#fail2 p").append("Baby Snake!")
            } else if (point < 20) {
                $("#fail2 p").append("Junior Snake!!")
            } else if (point < 30) {
                $("#fail2 p").append("Big Snake!!")
            } else if (point < 40) {
                $("#fail2 p").append("Senior Snake!!")
            } else if (point < 50) {
                $("#fail2 p").append("Hungry Snake!!")
            } else if (point < 60) {
                $("#fail2 p").append("Starving Snake!!")
            } else if (point < 70) {
                $("#fail2 p").append("Crazy Snake!!")
            } else if (point < 80) {
                $("#fail2 p").append("Maniac snake!!")
            } else {
                $("#fail2 p").append("Super Snake!")
            }
            $("#fail1,#fail2").show();
            $(".snake").remove();
            $(newFood).remove();
        }
        var selfCrash = function(x, y) {
            if (a.length > 1) {
                for (i = 0; i < a.length; i++) {
                    if (parseInt(a[0].css("top").slice(0, -2)) == parseInt(a[i].css("top").slice(0, -2)) + x && parseInt(a[0].css("left").slice(0, -2)) == parseInt(a[i].css("left").slice(0, -2)) + y) {
                        touch = 1
                    };
                }
            }
        }
        var newSnakeSpot = function(x, y) {
            newSnake.css("top", parseInt(a[0].css("top").slice(0, -2)) + x);
            newSnake.css("left", parseInt(a[0].css("left").slice(0, -2)) + y);
        }
        var modeReminder = function() {
            $("#mode").css("display", "block");
            setTimeout(function() {
                $("#mode").css("display", "none")
            }, 1200);
        }
        if (a.length !== 0) {
            //吃果实
            if (a[0].css("top") == newFood.css("top") && a[0].css("left") == newFood.css("left")) {
                switch (color) {
                    case "blue":
                        clearInterval(run);
                        run = setInterval(function() {
                            move()
                        }, 500);
                        $(".snake").css("background-color", "blue");
                        $("#mode p").text("Frozen World");
                        $("#mode").css("background-color", "blue");
                        modeReminder();
                        point = point + 2;
                        break;
                    case "red":
                        clearInterval(run);
                        run = setInterval(function() {
                            move()
                        }, 75);
                        $(".snake").css("background-color", "red");
                        $("#mode p").text("Speeding World");
                        $("#mode").css("background-color", "red");
                        modeReminder();
                        point = point + 2;
                        break;
                    case "orange":
                        clearInterval(run);
                        run = setInterval(function() {
                            move()
                        }, 250);
                        $(".snake").css("background-color", "orange");
                        $("#mode p").text("Bonus Mode");
                        $("#mode").css("background-color", "orange");
                        modeReminder();
                        point = point + 6;
                        break;
                    case "pink":
                        clearInterval(run);
                        run = setInterval(function() {
                            move()
                        }, 250);
                        $(".snake").css("background-color", "pink");
                        $("#mode p").text("Super-bonus Mode");
                        $("#mode").css("background-color", "pink");
                        modeReminder();
                        point = point + 10;
                        break;
                    case "black":
                        clearInterval(run);
                        run = setInterval(function() {
                            move()
                        }, 30);
                        $(".snake").css("background-color", "black");
                        $("#mode p").text("Death Mode");
                        $("#mode").css("background-color", "black");
                        modeReminder();
                        point = point + 1;
                        break;
                }
                newFood.remove();
                addFood(); //addFood()一定要在addSnake前面？
                addSnake(direction);
                //$(".snake").css("background-color",color);
                $("#score").text(point + ".");
                //蛇说话
                var snakeWord = document.createElement("div");
                $("#container").append(snakeWord);
                snakeWord = $(snakeWord);
                snakeWord.addClass("snakeWord");
                if (lastDirection == "down" || lastDirection == "up") {
                    snakeWord.css("top", parseInt(a[0].css("top").slice(0, -2)));
                    snakeWord.css("left", parseInt(a[0].css("left").slice(0, -2)) - 70);
                    snakeWord.css("transform", "rotate(-90deg)")
                }
                if (lastDirection == "left" || lastDirection == "right") {
                    snakeWord.css("top", parseInt(a[0].css("top").slice(0, -2)) - 50);
                    snakeWord.css("left", parseInt(a[0].css("left").slice(0, -2)));
                }
                var x = Math.random();
                if (x < 0.3) {
                    snakeWord.append("<p>❤~Yay!</p>")
                };
                //if(x==0.3) {snakeWord.text("Nice")}；(为什么不行)
                if (x > 0.3 && x < 0.6) {
                    snakeWord.append("<p>❤❤❤</p>")
                };
                if (x > 0.6) {
                    snakeWord.append("<p>Yummy!</p>")
                };
                setTimeout(function() {
                    $(".snakeWord").remove()
                }, 500);
            }
        }
        //移动
        switch (direction) {
            case "down":
                selfCrash(-20, 0);
                if (a[0].css("top").slice(0, -2) >= 580 || touch == 1) endGame();
                $(".snake p").remove();
                newSnakeSpot(20, 0);
                newSnake.append("<p>.</p>"); //蛇眼睛
                lastDirection = "down";
                break;
            case "up":
                selfCrash(20, 0);
                if (a[0].css("top").slice(0, -2) <= 0 || touch == 1) endGame();
                $(".snake p").remove();
                newSnakeSpot(-20, 0);
                newSnake.append("<p>.</p>");
                lastDirection = "up";
                break;
            case "left":
                selfCrash(0, 20);
                if (a[0].css("left").slice(0, -2) <= 0 || touch == 1) endGame();
                $(".snake p").remove();
                newSnakeSpot(0, -20);
                newSnake.append("<p>.</p>");
                lastDirection = "left";
                break;
            case "right":
                selfCrash(0, -20);
                if (a[0].css("left").slice(0, -2) >= 978 || touch == 1) endGame();
                $(".snake p").remove(); //一开始不会报错吗？
                newSnakeSpot(0, 20);
                newSnake.append("<p>.</p>");
                lastDirection = "right";
                break;
            default:
                newSnake.css('top', 0);
                newSnake.css('left', 0);
                lastDirection = "up";
                break;
        }
    };

    function addSnake(direction) {
        var newSnake = document.createElement("div"); //不可以直接在div里写class
        $("#container").append(newSnake);
        newSnake = $(newSnake);
        newSnake.addClass('snake');
        moveViaDirection(direction, newSnake);
        a.unshift(newSnake); // a[0]是新的在右侧 a[last]是旧的在左侧
    }

    function addFood() {
        newFood = document.createElement("div");
        $("#container").append(newFood);
        newFood = $(newFood);
        newFood.addClass("food");
        newFood.css("top", Math.round(Math.random() * 25) * 20);
        newFood.css("left", Math.round(Math.random() * 45) * 20);
        var x = Math.random();
        if (x < 0.2) {
            newFood.css("background-color", "blue");
            color = "blue";
        }
        if (x > 0.2 && x < 0.4) {
            newFood.css("background-color", "red");
            color = "red";
        } //可以用else if吗？
        if (x > 0.4 && x < 0.6) {
            newFood.css("background-color", "black");
            color = "black"
        }
        if (x > 0.6 && x < 0.8) {
            newFood.css("background-color", "orange");
            color = "orange"
        }
        if (x > 0.8 && x < 1) {
            newFood.css("background-color", "pink");
            color = "pink"
        }
    }
    addFood();
    //setInterval(function(){addFood()}, 7000); 不能用这个让食物自己出来？
    var direction = 'right';

    function move() {
        var lastSnake = a.pop();
        moveViaDirection(direction, lastSnake);
        a.unshift(lastSnake);
    }
    addSnake();
    addSnake("right");

    function others() {
        run = setInterval(function() {
            move()
        }, 250);
        countDown = setInterval(function() {
            t--;
            $("#time").text('00:' + (t > 9 ? t : ('0' + t)))
            if (t == 0) {
                clearInterval(countDown);
                endGame();
            }
        }, 1000);
    }
    others();
    $(document).keydown(function(key) {
        switch (parseInt(key.which, 10)) {
            case 40:
                if (lastDirection == "up") {
                    direction = "up"
                } else {
                    direction = 'down';
                }
                break;
            case 38:
                if (lastDirection == "down") {
                    direction = "down"
                } else {
                    direction = 'up';
                }
                break;
            case 37:
                if (lastDirection == "right") {
                    direction = "right"
                } else {
                    direction = 'left';
                }
                break;
            case 39:
                if (lastDirection == "left") {
                    direction = "left"
                } else {
                    direction = 'right';
                }
                break;
            case 32:
                $('#pause').click();
        }
    })
    $('#replay').click(function() {
        $(".snake").remove();
        $(newFood).remove();
        endGame();
        $('#pause').show();
        $("#fail1,#fail2").hide();
        a = [];
        color = "no";
        point = 0;
        touch = 0;
        t = 60;
        $("#time").text('1:00');
        $('#pause').data('pause', 'run')
        addFood();
        direction = "right";
        addSnake();
        addSnake("right");
        others();
    })
    $('#pause').click(function() {
        $(this).toggleClass('active');
        if ($(this).data('pause') == 'run') {
            clearInterval(run);
            clearInterval(countDown);
            $(this).data('pause', 'pause');
        } else {
            others();
            $(this).data('pause', 'run');
        }
    })
}
$(document).ready(main);
/* 

/*var replay = function(){
	
}

$("#replay").click( function() {
	replay();
});*/