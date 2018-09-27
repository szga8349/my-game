const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 整体容器（缩放用）
        wrap: {
            default: null,
            type: cc.Node
        },
        ball: {
            default: null,
            type: cc.Node
        },
        // 开始遮罩
        coverStart: {
            default: null,
            type: cc.Node
        },
        // 地图容器
        map: {
            default: null,
            type: cc.Node
        },
        // 兽人
        orc: {
            default: null,
            type: cc.Prefab
        },
        // 宝箱
        storehouse: {
            default: null,
            type: cc.Prefab
        },
        // 炸弹
        bomb: {
            default: null,
            type: cc.Prefab
        },
        // 木板
        board: {
            default: null,
            type: cc.Prefab
        },
        // 开始遮罩
        coverOver: {
            default: null,
            type: cc.Node
        },
        // bgm
        audioBgm: {
            default: null,
            type: cc.AudioClip
        },
        audioFail: {
            default: null,
            type: cc.AudioClip
        },
        pauseBtn: {
            default: null,
            type: cc.Node
        }
    },
    // 暂停
    stateSwitch() {
        if (this.pauseGame) {
            this.pauseGame = false;
            cc.director.resume();
            cc.loader.loadRes('pause', cc.SpriteFrame, (err, res) => {
                this.pauseBtn.getComponent(cc.Sprite).spriteFrame = res;
            });
        } else {
            this.pauseGame = true;
            cc.director.pause();
            cc.loader.loadRes('play', cc.SpriteFrame, (err, res) => {
                this.pauseBtn.getComponent(cc.Sprite).spriteFrame = res;
            });
        }
    },
    // 再来一次
    playAgain() {
        cc.director.loadScene('Game');
    },
    // 开始
    startGame() {
        this.coverStart.destroy();
        
        let seq = cc.sequence(cc.moveTo(1, this.wrap.width / 2, 500), cc.callFunc(() => {
            Global.gameInfo.state = 'running';
            this.schedule(() => {
                this.creatStorehouse();
            }, 5);

            this.schedule(() => {
                this.creatBomb();
            }, 10);

            this.schedule(() => {
                this.creatBoard();
            }, 8);
        }));
        // seq.easing(cc.easeOut(3));
        this.ball.runAction(seq);
    },
    // 游戏结束
    gameOver() {
        this.coverOver.active = true;
        
        cc.audioEngine.stopMusic();
        cc.audioEngine.play(this.audioFail, false);
    },
    // 制造兽人
    creatOrc() {
        let orc = cc.instantiate(this.orc);
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
    },
    // 制造宝箱
    creatStorehouse() {
        let orc = cc.instantiate(this.storehouse);
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
    },
    // 制造炸弹
    creatBomb() {
        let orc = cc.instantiate(this.bomb);
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
    },
    // 制造木板
    creatBoard() {
        let orc = cc.instantiate(this.board);
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.game = this;
        //碰撞系统（不需要）
        const managerCollis = cc.director.getCollisionManager();
        managerCollis.enabled = true; 
        // 开启碰撞系统的调试线框绘制
        // managerCollis.enabledDebugDraw = true;
        // managerCollis.enabledDrawBoundingBox = true;

        // ball 脚本
        this.balljs = this.ball.getComponent('Ball');

        // 产出兽人
        for (let i = 0; i < 20; i++) this.creatOrc();
        
        cc.audioEngine.playMusic(this.audioBgm, true);
    },

    start () {
        this.node.on('touchstart', () => {
            if (Global.gameInfo.state == 'over' || this.pauseGame) return;
            // 第一种
            this.balljs.value = 3;
            // this.balljs.bg_speed *= 2;
            // if (this.balljs.bounce > 0) 
            this.balljs.bounce = -Math.abs(this.balljs.bounce);
            
        }, this);
    },

    // update (dt) {},
});
