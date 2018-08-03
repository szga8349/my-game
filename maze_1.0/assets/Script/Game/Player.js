const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 游戏结束界面
        overBox: {
            default: null,
            type: cc.Node
        },
        // 所有关卡完成弹出提示容器
        successBox: {
            default: null,
            type: cc.Node
        },
        // 通过关卡音效
        adoptAudio: {
            default: null,
            url: cc.AudioClip
        },
        // 失败音效
        fallAudio: {
            default: null,
            url: cc.AudioClip
        },
    },
    // 碰撞回调
    onCollisionEnter(other, self) {
        if (other.name.includes('arrow') && Global.game.gameover === false) {
            cc.log('撞到箭头');
            Global.game.move_direction = other.node.dataDirection;
        } else if (other.name.includes('wall') && Global.game.gameover === false) {
            cc.log('撞到墙');
            let wall = other.node.name.split('wall-').join('');
            Global.game.gameover = true;
            this.overMove(wall);
            cc.audioEngine.playEffect(this.fallAudio);
            // cc.director.loadScene('Rank');
        }
    },
    // 检查终点，碰撞结束后
    onCollisionExit(other, self) {
        if (other.name.includes('end') && Global.game.gameover === false) {
            cc.log('撞到终点了');
            Global.game.gameover = true;
            if (Global.gameInfo.level == Global.levels.length - 1) {
                this.successBox.active = true;
                let _action = cc.spawn(cc.fadeIn(0.5), cc.scaleTo(0.5, 1, 1));
                _action.easing(cc.easeOut(3.0));
                this.successBox.runAction(_action);
            } else {
                Global.gameInfo.level += 1;
                // 储存游戏进度
                if (Global.gameInfo.level > Global.gameInfo.saveLevel) {
                    Global.gameInfo.saveLevel = Global.gameInfo.level;
                    // 本地储存一下
                    window.localStorage.setItem('level', Global.gameInfo.level);
                }
                cc.audioEngine.playEffect(this.adoptAudio);
                this.scheduleOnce(() => {
                    cc.director.loadScene('Game');
                }, 0.5);
            }
        } else if (other.name.includes('arrow') && Global.game.gameover === false) {
            other.node.destroy();
        }
    },
    /**
     * 执行结束动画
     * @param {string} wall 撞到的墙
     */
    overMove(wall) {
        let action = null;
        let num = this.node.width / 2;
        switch (wall) {
            case 'top':
                action = cc.spawn(cc.rotateBy(1, 360), cc.scaleBy(1, 0.4, 0.4), cc.moveBy(1, 0, num));
                break;
            case 'bottom':
                action = cc.spawn(cc.rotateBy(1, 360), cc.scaleBy(1, 0.4, 0.4), cc.moveBy(1, 0, -num));
                break;
            case 'left':
                action = cc.spawn(cc.rotateBy(1, 360), cc.scaleBy(1, 0.4, 0.4), cc.moveBy(1, -num, 0));
                break;
            case 'right':
                action = cc.spawn(cc.rotateBy(1, 360), cc.scaleBy(1, 0.4, 0.4), cc.moveBy(1, num, 0));
                break;
        }
        action.easing(cc.easeOut(3.0));
        this.node.runAction(action);
        // 游戏结束显示界面
        this.scheduleOnce(() => {
            cc.log('游戏结束了~');
            this.overBox.active = true;
            let _action = cc.spawn(cc.fadeIn(0.5), cc.scaleTo(0.5, 1, 1));
            _action.easing(cc.easeOut(3.0));
            this.overBox.runAction(_action);
        }, 0.8);
    },
    // 节点移动
    playerMove() {
        if (Global.game.gameover) return;
        switch (Global.game.direction) {
            case 'left':
                this.node.x -= Global.gameInfo.speed;
                break;
            case 'right':
                this.node.x += Global.gameInfo.speed;
                break;
            case 'top':
                this.node.y += Global.gameInfo.speed;
                break;
            case 'down':
                this.node.y -= Global.gameInfo.speed;
                break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    update(dt) {
        this.playerMove();
    },
});
