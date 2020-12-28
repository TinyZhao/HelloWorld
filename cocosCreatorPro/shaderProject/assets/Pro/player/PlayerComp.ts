// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Graphics)
    graph: cc.Graphics = null;

    viewAngle: number = 90; 
    distance: number = 450;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        //graphics
        this.graph.clear();
        this.graph.moveTo(0, 0);
        let pointArr = [];
        for (let i = 0; i < this.viewAngle; i++) {
            let v1 = new cc.Vec2(Math.sin(Math.PI * i / 180 + Math.PI * 45 / 180) * this.distance, -Math.cos(Math.PI * i / 180 + Math.PI * 45 / 180) * this.distance);
            let v2 = this.node.convertToWorldSpaceAR(v1);
            let results = cc.director.getPhysicsManager().rayCast(this.node.convertToWorldSpaceAR(cc.v2(0,0)), v2, cc.RayCastType.Closest);
            for (let j = 0; j < results.length; j++) {
                let v3 = this.node.convertToNodeSpaceAR(results[j].point);
                if (v3.dot(v3) < v1.dot(v1)) {
                    v1 = this.node.convertToNodeSpaceAR(results[j].point);

                    pointArr.push({x: v1.x,y: v1.y});
                }
            }
            this.graph.lineTo(v1.x, v1.y);
        }

        this.graph.lineTo(0, 0);
        this.graph.fillColor = cc.color(0, 172, 242, 100);
        this.graph.fill();
    }
}
