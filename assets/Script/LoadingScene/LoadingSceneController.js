

const SpineAnimation = require('SpineAnimation');
cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: {
            default: null,
            type: cc.ProgressBar,
        },
        loadingLabel: {
            default: null,
            type: cc.Label,
        },
        fillLight: {
            default: null,
            type: cc.Node,
        },
        spineSkeleton: {
            default: null,
            type: sp.Skeleton,
        }
    },

    onLoad() {
        this.doLoadingScene();
        this.onProgressStart();
        cc.game['ROOM_INIT_LOAD'] = true;
    },
    onProgressStart() {
        this.dotStates = ["Loading", "Loading.", "Loading..", "Loading..."];
        this.currentDotStateIndex = 0;
        this.loadingBar.progress = 0;
        this.fillLight.width = this.loadingBar.totalLength;
        this.loadingLabel.string = `${this.dotStates[this.currentDotStateIndex]} 0%`;
        this.spineSkeleton.setAnimation(0, SpineAnimation.HOVERBOARD, true);
    },
    onProgressUpdate(progress) {
        this.loadingBar.progress = progress > this.loadingBar.progress ? progress : this.loadingBar.progress;
        this.fillLight.width = this.loadingBar.totalLength;
        this.spineSkeleton.node.setPosition(cc.v2(this.loadingBar.totalLength * this.loadingBar.progress, 20));
        let loadingPrefix = this.dotStates[this.currentDotStateIndex];
        this.loadingLabel.string = `${loadingPrefix} ${Math.floor(progress * 100)}%`;
        this.currentDotStateIndex = (this.currentDotStateIndex + 1) % this.dotStates.length;
    },
    doLoadingScene() {
        cc.director.preloadScene('Lobby', (completedCount, totalCount, item) => {
            let progress = totalCount > 0 ? completedCount / totalCount : 0;
            this.onProgressUpdate(progress);
        }, () => {
            cc.director.loadScene('Lobby');
        });
    },


});
