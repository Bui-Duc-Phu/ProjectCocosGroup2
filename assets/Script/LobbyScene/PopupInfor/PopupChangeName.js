
const LocalStorageKey = require('LocalStorageKey');
const ScoreController = require('ScoreController');
const Emitter = require('Emitter');
const EventKey = require('EventKey');

cc.Class({
    extends: require('PopupItem'),

    properties: {
        inputName: {
            type: cc.EditBox,
            default: null
        },
        resultLable: {
            type: cc.Label,
            default: null
        }
    },
    onLoad() {
        this.init()
    },
    init() {
        let username = this.getUsername();
        this.inputName.string = username;
    },
    onClickSave() {
        let newName = this.inputName.string.trim();
        this.resultLable.node.color = cc.Color.RED;
        let currentName = this.getUsername();

        if (newName === currentName) {
            this.resultLable.string = "Username not change!";
            return;
        } else if (newName.length === 0) {
            this.resultLable.string = "Username cannot be empty!";
            return;
        } else if (newName.length < 3) {
            this.resultLable.string = "Username must be at least 3 characters.";
            return;
        } 
        this.resultLable.string = "Name changed successfully!";
        this.resultLable.node.color = cc.Color.GREEN;
        this.setUsername(newName);
        Emitter.emit(EventKey.PLAYER.CHANGE_NAME);

    },
    hide() {
        cc.tween(this.node)
            .to(0.1, { opacity: 0 }) 
            .call(() => {
                this.init();
                this.node.active = false;  
            })
            .start();
    },
    getUsername() {
        let username = cc.sys.localStorage.getItem(LocalStorageKey.PLAYER.NAME);
        if (!username) {
            cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.NAME, 'Player');
            return username;
        }
        return username;
    },
    setUsername(username) {
        cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.NAME, username);
    },



});
