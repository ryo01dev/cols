//for vue.js

const COLOR_NUM = 4;
//ref. https://qiita.com/asa-taka/items/888bc5a1d7f30ee7eda2
//msec sleep.
//usage: await sleep(1000);
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const randInt = max => Math.floor(Math.random() * (max + 1));

//for socket.io
const socket = io();

socket.on('color', (msg) => {
    vueApp.color = msg;
});

const vueApp = new Vue({
    el: '#app',
    data: {
        canvasDom: null,
        color: "blue",
        colorList: ["red", "green", "yellow", "blue"],
        colorIndex: 0,
        bpm: 120,
        rhythmic: false
    },
    methods: {
        fill: function () {
            const context = this.canvasDom.getContext("2d");
            context.fillStyle = this.color;
            context.fillRect(0, 0, this.canvasDom.width, this.canvasDom.height);
        },
        colorSet: function () {
            this.colorIndex++;
            if (this.colorIndex >= COLOR_NUM) {
                this.colorIndex = 0;
            }
            this.color = this.colorList[this.colorIndex];
            //this.fill();
            this.emit();
        },

        randomColorSet: function () {
            const r = randInt(255);
            const g = randInt(255);
            const b = randInt(255);
            console.log("r,g,b:", r, g, b);
            this.color = `rgb(${r}, ${g}, ${b})`;
            //this.fill();
            this.emit();
        },

        rhythmColorSet: async function () {
            this.rhythmic = true;

            const sleepmsec = 60000 / this.bpm;
            while (this.rhythmic) {
                this.randomColorSet();
                //60000/bpm
                await sleep(sleepmsec);
            }
        },
        rhythmColorStop: function () {
            this.rhythmic = false;
        },

        resizeCanvasSize: function () {
            const container = document.getElementById("container");

            const windowInnerWidth = window.innerWidth;
            const windowInnerHeight = window.innerHeight;

            this.canvasDom.width = windowInnerWidth;
            this.canvasDom.height = windowInnerHeight;

            this.fill();
            //this.canvasDom.width = container.offsetWidth;
            //this.canvasDom.height = container.offsetHeight;
        },

        emit: function () {
            //socket.emit('color', this.color);//no ack


            socket.emit('color', this.color, (data) => {
                console.log(data); //response data.
            });
            //emit twice. (delay happens if only once emit... why??)
            socket.emit('color', this.color, (data) => {
                console.log(data); //response data.
            });
            //emit socket io ('color', this.color);
        }

    },
    created: function () {
		this.canvasDom = document.getElementById("colorCanvas");
		//change color by clicking canvas
		this.canvasDom.onclick = this.randomColorSet;
        window.addEventListener('resize', this.resizeCanvasSize, false);
    },
    mounted: function () {
        this.resizeCanvasSize();
        this.colorSet();
    },
    watch: {
        color: function (val) {
            this.fill(val);
        }
    },
    beforeDestroy: function () {
        // インスタンスを破棄する前に、イベントリスナから削除
        window.removeEventListener('resize', this.resizeCanvasSize, false);
    }
});

