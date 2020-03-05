const line = {
    init: function (questionObj, answerObj) {
        this.draw = SVG('draw').size("100%", "100%");
        console.log('🌹',this.draw)
        this.lineArr = [];
        this.currentInfo = {};
        this.createList(questionObj)
        this.createList(answerObj)
        this.bindBtnEvent()
        this.bindParentsEvent()
    },
    /* 创建列表 */
    createList: function (obj, callback) {
        let type = obj.type,
            data = obj.data,
            content = [];
        if (type == 'question') {
            $('.question-list').empty()
            data.forEach(element => {
                let item = '<li class="question-li" data-question=' + element.question + ' data-answer=' + element.answer + '>' + element.question + '</li>',
                    obj = {};
                obj.beginValue = element.question;
                obj.line = this.createLine();
                console.log('👌',this)
                this.lineArr.push(obj)
                content.push(item);
            });
            $('.question-list').html(content)
        } else {
            $('.answer-list').empty()
            data.forEach(element => {
                let item = '<li class="answer-li" data-answer=' + element + '>' + element + '</li>';
                content.push(item);
            });
            $('.answer-list').html(content);

        }
        // this.itemForEach(true)
    },
    /* 绑定按钮事件 */
    bindBtnEvent: function () {
        let self = this,
            parentPosition = $('#draw').offset();
        /* 鼠标按下question-list列，调整线条开始位置 */
        $('.question-list').on('mousedown', 'li', function (e) {

            let current = self.lineArr.find(el => {
                return el.beginValue == $(this).attr('data-question');
            });
            current.begin = {};
            current.beginElement = this;
            current.begin.y = $(this).offset().top - parentPosition.top + 15;
            current.begin.x = $(this).offset().left - parentPosition.left + 110;
            current.line.show();
            current.line.stroke({
                color: "#67C23A",
            });
            current.line.plot(current.begin.x, current.begin.y, current.begin.x, current.begin.y);
            current.end = {};
            /* 如果存在结束位置，删除 */
            if (current.endElement) {
                $(current.endElement).removeClass('selected')
                $(this).removeClass('selected')
            }
            current.endElement = '';
            current.endValue = '';
            self.currentInfo = current;
        })
        /* 鼠标按下answer-list列，调整线条结束位置 */
        $('.answer-list').on('mouseup', 'li', function (e) {
            let current = self.lineArr.find(el => {
                return el.beginValue == self.currentInfo.beginValue;
            });

            current.end.y = $(this).offset().top - parentPosition.top + 15;
            current.end.x = $(this).offset().left - parentPosition.left - 20;
            current.endElement = this;
            current.endValue = $(this).attr('data-answer');
            
            current.line.plot(current.begin.x, current.begin.y, current.end.x, current.end.y);
            $(current.beginElement).addClass('selected')
            $(current.beginElement).attr('data-selected', current.endValue)
            $(this).addClass('selected')

            self.currentInfo = '';
        })
    },
    /* 绑定父亲事件事件 */
    bindParentsEvent: function (params) {
        let self = this;

        $(document).mouseup(function (e) {
            if (!$(e.target).is(".answer-li") && self.currentInfo.line) {
                self.currentInfo.line.hide();
                $("#draw")
                    .find(".question-li")
                    .removeClass("display-block-hover");
            }
        })
        $('#draw').mousemove(function (e) {
            e.preventDefault();
            if (Object.keys(self.currentInfo).length != 0) {
                let end = {}
                end.x = self.getMousePos(event).x - $("#draw").offset().left;
                end.y = self.getMousePos(event).y - $("#draw").offset().top;
                self.currentInfo.line.plot(self.currentInfo.begin.x, self.currentInfo.begin.y, end.x, end.y);
            }
        })
    },
    /* 创建线条 */
    createLine: function () {
        let self = this,
            line = self.draw.line();
            console.log('👌',line,self.draw)
        line.stroke({
            color: "#67C23A",
            width: 2,
            opacity: 0.6,
            linecap: "round"
        });
        line.hide()
        line.click(function () {
            let current = self.lineArr.find(el => {
                return el.line == this;
            });
            $(current.beginElement).removeClass("selected");
            $(current.endElement).removeClass("selected");
            $(current.beginElement).attr('data-selected', '')

            current.endValue = "";
            current.endElement = "";
            current.end = "";

            this.hide();
        });
        line.mouseover(function () {
            let current = self.lineArr.find(el => {
                return el.line == this;
            });
            if (current.endValue) {
                let left, top;
                left =
                    (current.end.x + current.begin.x - 20) / 2 + "px";
                top =
                    (current.end.y + current.begin.y - 20) / 2 + "px";
                $('.remove-btn').css({
                    'left': left,
                    'top': top
                }).show()
                this.addClass("hover-g");
            }
        });
        line.mouseout(function () {
            $('.remove-btn').hide();
            this.removeClass("hover-g");
        });
        /* line.marker("end", 8, 8, function (add) {
            add.polyline([
                [1, 0],
                [1, 8],
                [7, 4],
                [1, 0]
            ]);
            this.fill("#67C23A");
            this.stroke({
                color: "#67C23A",
                opacity: 0.6,
                width: 1
            });
        }); */
        return line;
    },
    /* 获取鼠标的坐标 */
    getMousePos: function (event) {
        var e = event || window.event;
        var scrollX =
            document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY =
            document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        //alert('x: ' + x + '\ny: ' + y);
        return {
            x: x,
            y: y
        };
    },
}
const question = [{
            question: '1+1',
            answer: 2
        },
        {
            question: '2+2',
            answer: 4
        }
    ],
    answer = [1, 2, 3, 4];
let questionObj = {
        data: question,
        type: 'question'
    },
    answerObj = {
        data: answer,
        type: 'answer'
    }
line.init(questionObj, answerObj)