
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    sp: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Slider)
    pb: cc.Slider = null;

    // onLoad () {}

    // 材质对象
    private _materi;

    start () {
        this._materi = this.sp.getMaterial(0);
    }

    spHandler (comp: cc.Slider) {
        let num = comp.progress;
        cc.log(num);
        this._materi.effect.setProperty("edge", num);
    }

    // update (dt) {}
}
