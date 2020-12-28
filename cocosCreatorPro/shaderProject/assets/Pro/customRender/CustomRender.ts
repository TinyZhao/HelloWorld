const renderEngine = cc.renderer.renderEngine;
const SpriteMaterial = renderEngine.SpriteMaterial;
import {CustomAssembler} from './CustomAssembler'
const {ccclass, property} = cc._decorator;

@ccclass
export class CustomRender extends cc.RenderComponent {
    @property(cc.Texture2D)
    texture: cc.Texture2D = null;

    // get texture() {
    //     return this._texture;
    // };
    // set texture (value) {
    //     this._texture = value;
    // };

    _assembler = null;
    _spriteMaterial = null;
    _renderData = null;
    _material = null;
    _texture: cc.Texture2D = null;
    uv = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    constructor(){
        super();
    }

    onEnable(){
        this._updateAssembler();
        this._activateMaterial();
        this._calculateUV();

        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onNodeSizeDirty, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
    }


    _onNodeSizeDirty () {
        if (!this._renderData) return;
        this.markForUpdateRenderData(true);
    }

    _updateAssembler(){
        let assemble = CustomAssembler;
        if(this._assembler != assemble){
            this._assembler = assemble;
            this._renderData = null;
        }

        if(!this._renderData){
            this._renderData = this._assembler.createDate(this);
            this._renderData.material = this._material;
        }
    }

    _activateMaterial(){
        let material = this._material;
        if(!material){
            material = this._material = new SpriteMaterial();
        }

        material.useColor = true;
        if(this._texture){
            material.texture = this._texture;
            this.markForUpdateRenderData(true);
            this.markForRender(true);
        }else{
            this.disableRender();
        }

        this._updateMaterial(material);
    }

    _calculateUV(){
        let uv = this.uv;

        let l = 0, r = 1, b = 1, t = 0;

        uv[0] = l;
        uv[1] = b;
        uv[2] = r;
        uv[3] = b;
        uv[4] = l;
        uv[5] = t;
        uv[6] = r;
        uv[7] = t;
    }


    // update (dt) {}
}
