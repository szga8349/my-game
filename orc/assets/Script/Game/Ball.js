const Global = require('Global');
const colors = [
    {
        mountain: '#7D2C1B',
        tree: '#491D12',
        floor: '#75280C',
        ground: '#3D1805',
    },{
        mountain: '#81b68c',
        tree: '#65977a',
        floor: '#e5c282',
        ground: '#2b5748',
    }
]
cc.Class({
    extends: cc.Component,

    properties: {
        // 风景移动容器
        moveBox: {
            default: null,
            type: cc.Node
        },
        // 背景容器
        // background: {
        //     default: null,
        //     type: cc.Node
        // },
        bg2:{
            default: null,
            type: cc.Node
        },
        // 音效
        audioFloor: {
            default: null,
            type: cc.AudioClip
        },
        audioDeath: {
            default: null,
            type: cc.AudioClip
        },
        audioBox: {
            default: null,
            type: cc.AudioClip
        },
        audioBoom: {
            default: null,
            type: cc.AudioClip
        },
        audioBoard: {
            default: null,
            type: cc.AudioClip
        },
    },
    // 视觉缩放
    viewScale() {
        // console.log(Global.game.wrap.scale);
        if (this.node.y < 500) return;
        Global.game.wrap.scale = (1110 - 600) / this.node.y;
    },
    switchColor(key) {
        
    },
    // 背景移动
    bgMove() {
        const _w = this.moveBox.width;
        let sun = this.moveBox.getChildByName('sun'),
            tree = this.moveBox.getChildByName('tree'),
            mountain = this.moveBox.getChildByName('mountain'),
            floor = this.moveBox.getChildByName('floor'),
            ground = this.moveBox.getChildByName('ground'),
            cloud = this.moveBox.getChildByName('cloud');
        // 太阳 移动 
        sun.x -= this.bg_speed / 8;
        if (sun.x <= -sun.width) {
            sun.x = _w;
            this.bg_count += 1;
            // console.log('========> 切换背景颜色');
            // 切换背景颜色
            if (this.bg_count == 1) {
                this.bg_count = 0;
                // 判断颜色
                if (sun.opacity == 255) {
                    this.bg2.runAction(cc.fadeIn(0.3));
                    sun.runAction(cc.fadeOut(0.3));
                    cloud.runAction(cc.fadeIn(0.3));
                    mountain.color = cc.hexToColor(colors[1].mountain);
                    tree.color = cc.hexToColor(colors[1].tree);
                    floor.color = cc.hexToColor(colors[1].floor);
                    ground.color = cc.hexToColor(colors[1].ground);
                } else {
                    this.bg2.runAction(cc.fadeOut(0.3));
                    sun.runAction(cc.fadeIn(0.3));
                    cloud.runAction(cc.fadeOut(0.3));
                    mountain.color = cc.hexToColor(colors[0].mountain);
                    tree.color = cc.hexToColor(colors[0].tree);
                    floor.color = cc.hexToColor(colors[0].floor);
                    ground.color = cc.hexToColor(colors[0].ground);
                }
            }
        }

        // 云移动
        cloud.x -= this.bg_speed / 8;
        if (cloud.x <= -cloud.width) cloud.x = _w;

        // 山丘移动
        mountain.x -= this.bg_speed / 3;
        if (mountain.x <= -_w) mountain.x = 0;

        // 树木移动
        tree.x -= this.bg_speed / 2;
        if (tree.x <= -_w) tree.x = 0

        // gound移动
        ground.x -= this.bg_speed / 1.5;
        if (ground.x <= -_w) ground.x = 0;
    },
    // 重置下参数
    restData(num = 0, bone = false) {
        // 砸地板计数
        this.floorNum = num;
        // 背景移动速度
        if (!bone) this.bg_speed = 16;
        // 衰减值
        this.value = 0.5;
        if (bone) {
            this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).timeScale = 0.5;
        } else {
            this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).timeScale = 1;
        }
    },
    // 撞到地板
    collisionFloor() {
        this.floorNum += 5;
        if (this.floorNum >= 25) {
            Global.gameInfo.state = 'over';
            this.node.y = this.node.height / 2;
            this.bounce = 0;

            cc.log('游戏结束');
            this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).playAnimation('rockStop', 1);
            this.node.getChildByName('particle').getComponent(cc.ParticleSystem).stopSystem();
            Global.game.gameOver();
        } else {
            this.bounce = 25 - this.floorNum;
        }

        this.bg_speed =  this.bg_speed / 2;
        
        cc.log('撞到地面', this.floorNum);
        this.restData(this.floorNum, true);
        cc.audioEngine.play(this.audioFloor, false);
    },

    // 撞到兽人
    collisionOrc(el) {
        if (Global.gameInfo.state == 'over' || this.value <= 1 || this.isBoard) return; 
        // console.log('衰减值=======>', this.value);
        if (this.bounce < 20 && !this.isBoard) this.bounce = 20;       // 上升高度
        el.destroy();
        Global.game.creatOrc();
        this.scheduleOnce(() => {
            if (!this.isBoard) this.restData();
        }, 0.01);
        cc.audioEngine.play(this.audioDeath, false);
    },

    // 撞到宝箱
    collisionStorehouse(el) {
        if (Global.gameInfo.state == 'over' || this.value <= 1) return; 
        if (this.bounce < 25) this.bounce = 25;       // 上升高度
        el.destroy();
        this.scheduleOnce(() => {
            this.restData();
        }, 0.01);
        cc.audioEngine.play(this.audioBox, false);
    },

    // 撞到炸弹
    collisionBomb(el) {
        if (Global.gameInfo.state == 'over' || this.value <= 1) return; 
        this.bounce = 30;       // 上升高度
        el.destroy();
        this.scheduleOnce(() => {
            this.restData();
        }, 0.01);
        cc.audioEngine.play(this.audioBoom, false);
    },

    // 撞到木板
    collisionBoard(el) {
        if (Global.gameInfo.state == 'over' || this.value <= 1) return; 
        this.bounce = 15;       // 上升高度
        this.floorNum = 10;
        el.destroy();
        this.isBoard = true; // 碰到木板
        this.scheduleOnce(() => {
            this.restData(this.floorNum);
            this.isBoard = false;
            console.log('floorNum', this.floorNum);
        }, 0.01);
        cc.audioEngine.play(this.audioBoard, false);
    },

    // 碰撞回调
    onCollisionEnter(other, self) {
        // console.log(other.node.name);
        
        switch (other.node.name) {
            case 'floor':
                this.collisionFloor();
                break;
            case 'orc':
                this.collisionOrc(other.node);
                break;
            case 'storehouse':
                this.collisionStorehouse(other.node);
                break;
            case 'bomb':
                this.collisionBomb(other.node);
                break;
            case 'board':
                this.collisionBoard(other.node);
                break;
            default:
                break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 弹力值
        this.bounce = 0;
        this.restData();
        // 背景移动计数
        this.bg_count = 0;
    },

    start() {

    },

    update(dt) {
        if (Global.gameInfo.state == 'running') {
            // 背景移动
            this.bgMove();

            // 视觉缩放监听
            this.viewScale();
            
            // 第一种
            this.bounce -= 1 * this.value;
            // if (this.bounce >= 0 && this.bounce < 2) this.value = 0.5;
            // if (Math.abs(this.bounce * this.value) >= 20) {
            //     this.node.y += (this.bounce * this.value) / 2;
            //     this.node.y += (this.bounce * this.value) / 2;
            // } else {
            //     this.node.y += this.bounce * this.value;
            // }
            this.node.y += this.bounce;
            // console.log(this.bounce * this.value);
            
            
            // 防止掉落
            if (this.node.y < 0) this.node.y = this.node.width / 2;
        }
    },
});
