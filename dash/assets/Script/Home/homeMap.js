let mapData = [{"type":"base","prop":"","d":"left","bottom":true},{"type":"base","prop":"","d":"left","bottom":true},{"type":"base","prop":"","d":"left","bottom":true},{"type":"base","prop":"","d":"left"},{"type":"base","prop":"","d":"right"},{"type":"base","prop":"none","d":"right"},{"type":"base","prop":"none","d":"right"},{"type":"base","prop":"","d":"left"},{"type":"base","prop":"","d":"left","bottom":true},{"type":"base","prop":"none","d":"left","bottom":true},{"type":"base","prop":"none","d":"left","bottom":true},{"type":"base","prop":"","d":"left"},{"type":"base","prop":"","d":"right"},{"type":"base","prop":"","d":"right"},{"type":"base","prop":"","d":"right"},{"type":"base","prop":"","d":"right","fork":[{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"}]},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"right","fork":[{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"}]},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"right"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"},{"type":"floor","prop":"","d":"left"}];

cc.Class({
    extends: cc.Component,

    properties: {
        maxIndex: 9999,
        floor: {
            default: null,
            type: cc.Prefab,
        },
    },
    // 输出地板
    outPutFloor(obj) {
        let floor = cc.instantiate(this.floor);
        floor.getComponent('mapfloor').enabled = false;

        // 判断分岔
        if (obj.fork) {
            if (obj.fork[0].d == 'right') {
                this.forkRecord.x = this.record.x + 60;
            } else {
                this.forkRecord.x = this.record.x - 60;
            }
            this.forkRecord.y = this.record.y + 35;
            for (let i = 0; i < obj.fork.length; i++) {
                this.outPutFork(obj.fork[i], i);
            }
        }
        floor.zIndex = this.maxIndex;
        floor.x = this.record.x;
        floor.y = this.record.y;
        floor.parent = this.node;

        floor.getChildByName('prop').destroy();

        // 更新下一个地板出现的位置 (记录数据)
        switch (obj.d) {
            case 'right':
                this.record.x += 60;
                break;
            case 'left':
                this.record.x -= 60;
                break;
        }
        if (obj.bottom) {
            this.record.y -= 35;
        } else {
            this.record.y += 35;
            this.maxIndex -= 1;
        }

        this.record.num += 1;
    },

    // 输出分岔
    outPutFork(obj, index) {
        let floor = cc.instantiate(this.floor);
        floor.getComponent('mapfloor').enabled = false;
        floor.getChildByName('prop').destroy();

        floor.zIndex = this.maxIndex - index;
        floor.x = this.forkRecord.x;
        floor.y = this.forkRecord.y;
        floor.parent = this.node;

        // 更新下一个地板出现的位置 (记录数据)
        switch (obj.d) {
            case 'right':
                this.forkRecord.x += 60;
                break;
            case 'left':
                this.forkRecord.x -= 60;
                break;
        }

        this.forkRecord.y += 35;
    },

    // 安装地板
    initFloor() {
        for (let i = 0; i < mapData.length; i++) {
            this.outPutFloor(mapData[i]);
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 底板记录
        this.record = {
            num: 0,
            x: 180, // 0    60
            y: -141 // -246  -71
        }
        // 地板分岔记录
        this.forkRecord = {
            x: 0,
            y: 0
        }
        this.initFloor();
    },
});
