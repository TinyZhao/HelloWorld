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
    cameraWater: cc.Camera = null;
    @property(cc.Sprite)
    spWaterShow: cc.Sprite = null;


    onLoad () {
        const texture = new cc.RenderTexture();
        texture.initWithSize(this.spWaterShow.node.width, this.spWaterShow.node.height);
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        this.cameraWater.targetTexture = texture;
        this.spWaterShow.spriteFrame = spriteFrame;
    }

    // update (dt) {}
}
