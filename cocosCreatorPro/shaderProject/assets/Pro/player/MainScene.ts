// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Camera)
    caCamera: cc.Camera = null;

    @property(cc.Node)
    ndBg: cc.Node = null;

    @property(cc.Node)
    ndPlayer: cc.Node = null;

    @property(cc.Sprite)
    showSp: cc.Sprite = null;

    @property(cc.Label)
    lbPos: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private touchPos: cc.Vec2 = null;
    private keyPos:cc.Vec2 = null;

    onLoad(){
        (window as any)._Zcx = this;

        cc.director.getPhysicsManager().enabled = true;

        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit;

        this.showSp.node.scaleY = -1;//Y轴翻转

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        const texture = new cc.RenderTexture();
        texture.initWithSize(this.showSp.node.width, this.showSp.node.height);
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        this.caCamera.targetTexture = texture;
        this.showSp.spriteFrame = spriteFrame;
    }

    start () {
        this.ndBg.on(cc.Node.EventType.TOUCH_START,(evt)=>{
            let pos = evt.getLocation();
            this.touchPos = this.ndPlayer.parent.convertToNodeSpaceAR(this.caCamera.getScreenToWorldPoint(pos));
        })
        this.ndBg.on(cc.Node.EventType.TOUCH_MOVE,(evt)=>{
            let pos = evt.getLocation();
            this.touchPos = this.ndPlayer.parent.convertToNodeSpaceAR(this.caCamera.getScreenToWorldPoint(pos));
        })
    }


    _speed = 100;
    onKeyUp (event) {
        this.keyPos = null;
    }
    onKeyDown (event) {
        // set a flag when key pressed
        this.touchPos = null;
        this.keyPos = null;
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.keyPos = cc.v2(-1,0);
                break;
            case cc.macro.KEY.d:
                this.keyPos = cc.v2(1,0);
                break;
            case cc.macro.KEY.w:
                this.keyPos = cc.v2(0,1);
                break;
            case cc.macro.KEY.s:
                this.keyPos = cc.v2(0,-1);
                break;
        }
    }


    update (dt) {
        //move
        let movePos = cc.v2(0,0);
        if(this.touchPos){
            if(!this.touchPos.sub(this.ndPlayer.getPosition()).fuzzyEquals(cc.v2(0,0),10)){
                let desVector = this.touchPos.sub(this.ndPlayer.getPosition()).normalize();
                movePos = movePos.add(desVector);
            }
        }
        if(this.keyPos){
            movePos = movePos.add(this.keyPos);
        }
        if(!movePos.equals(cc.v2(0,0))){
            let rotation = Math.acos(movePos.x/movePos.len()) * 180 / Math.PI;
            this.ndPlayer.getChildByName("player").angle = -(movePos.y < 0 ? rotation : -rotation);
            this.ndPlayer.setPosition(this.ndPlayer.getPosition().add(movePos.multiplyScalar(500 * dt)));
        }

        this.lbPos.string = this.ndPlayer.position.toString() 
            + "\nmovePos: " + movePos.toString() 
            + "\nrotation: " + this.ndPlayer.getChildByName("player").angle;
    }

    resetHandler(){
        this.touchPos = null;
        this.keyPos = null;
        this.ndPlayer.getChildByName("player").angle = 0;
        this.ndPlayer.position = cc.v3(0,0,0);
    }
}
