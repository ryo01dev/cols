//for vue.js

const COLOR_NUM = 4;

const vueApp = new Vue({
    el: '#app',
    data: {
        canvasDom: null,
        color: "blue",
        colorList: ["red", "green", "yellow", "blue"],
        colorIndex: 0
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
            this.fill();
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
        }

    },
    created: function () {
        this.canvasDom = document.getElementById("colorCanvas");
        window.addEventListener('resize', this.resizeCanvasSize, false);
    },
    mounted: function () {
        this.resizeCanvasSize();
        this.colorSet();
    },
    beforeDestroy: function () {
        // インスタンスを破棄する前に、イベントリスナから削除
        window.removeEventListener('resize', this.resizeCanvasSize, false);
    }
});

