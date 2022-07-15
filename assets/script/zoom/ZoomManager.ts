
import { _decorator, Component, Node, EventTouch, v2, Vec2, Camera, clamp, misc, v3, find, TiledMap, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ZoomManager
 * DateTime = Thu Jun 16 2022 22:54:17 GMT+0800 (中国标准时间)
 * FileBasename = ZoomManager.ts
 * FileBasenameNoExtension = ZoomManager
 * URL = db://assets/script/zoom/ZoomManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('ZoomManager')
export class ZoomManager extends Component {

    private nodeCamera: Node;
    private nodeTarget: Node;
    private minLength: number;
    private maxLength: number;

    // 双指初始间距
    private originalTouchDistance = -1;
    // 摄像机初始位置
    private originalCameraPosition;
    // 摄像机初始距离
    private originalCameraDistance;
    // 节点初始缩放
    private originalNodeScale;

    onLoad () {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMoveCamera, this)
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart)
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove)
        // this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMoveCamera)
    }

    init (nodeCamera: Node, nodeTarget: Node, minLength: number, maxLength: number) {
        this.nodeCamera = nodeCamera;
        this.nodeTarget = nodeTarget;
        this.minLength = minLength;
        this.maxLength = maxLength;
    }

    onTouchMove(event: EventTouch) {
        if (this.nodeTarget) {
            let touches = event.getTouches();
            if (touches.length == 1) {
                let delta = event.getDelta();
                this.nodeTarget.setPosition(v3(this.nodeTarget.position.x + delta.x/2, this.nodeTarget.position.y + delta.y/2, this.nodeTarget.position.z))
            } else if (touches.length == 2) {
                let temp = v2();
                Vec2.subtract(temp, touches[0].getLocation(), touches[1].getLocation());
                // 双指当前间距
                let distance = temp.length();
                if (this.originalTouchDistance == -1) {
                    this.originalTouchDistance = distance;
                    this.originalNodeScale = this.nodeTarget.scale.clone();

                }
                let targetScale = v3();
                // 双指当前间距 / 双指初始间距
                let scale = distance / this.originalTouchDistance;
                // 节点初始缩放 * (双指当前间距 / 双指初始间距)
                Vec3.multiplyScalar(targetScale, this.originalNodeScale, scale);
                scale = targetScale.x;
                // 属于节点缩放比
                scale = clamp(scale, this.minLength, this.maxLength);
                this.nodeTarget.setScale(scale, scale, this.nodeTarget.scale.z);
            }
        }
    }

    onTouchMoveCamera(event: EventTouch) {
        if (this.nodeCamera) {
            let touches = event.getTouches();
            if (touches.length == 1) {
                let delta = event.getDelta();
                this.nodeCamera.setPosition(v3(this.nodeCamera.position.x - delta.x, this.nodeCamera.position.y - delta.y, this.nodeCamera.position.z))
            } else if (touches.length == 2) {
                let temp = v2();
                Vec2.subtract(temp, touches[0].getLocation(), touches[1].getLocation());
                // 双指当前间距
                let distance = temp.length();
                if (this.originalTouchDistance == -1) {
                    // 双指初始间距
                    this.originalTouchDistance = distance;
                    // 摄像机初始位置
                    this.originalCameraPosition = this.nodeCamera.position.clone();
                    // 摄像机初始距离
                    this.originalCameraDistance = this.originalCameraPosition.length();
                }
    
                let scale = this.originalTouchDistance / distance;
                // 摄像机机当前距离
                let curCameraDistance = this.originalCameraDistance * scale;
                // 约束摄像机距离
                curCameraDistance = clamp(curCameraDistance, this.minLength, this.maxLength);
    
                // 降维 可以将 z 视作二维平面中的 x
                temp = v2(this.originalCameraPosition.z, this.originalCameraPosition.y);
                // 计算两点间的角度
                let angle = this.getAngle(temp, Vec2.ZERO);
                // 根据角度计算弧度
                let rad = misc.degreesToRadians(angle);
                // http://c.biancheng.net/ref/sin.html
                // sinA = 对边 / 斜边 可得 对边 = sinA * 斜边
                let y = Math.sin(rad) * curCameraDistance;
                // http://c.biancheng.net/ref/cos.html
                // cosA = 临边 / 斜边 可得 临边 = cosA * 对边
                let z = Math.cos(rad) * curCameraDistance;
                this.nodeCamera.setPosition(v3(this.nodeCamera.position.x, y, z));
            }
        }
    }

    onTouchStart(event: EventTouch) {
        this.originalTouchDistance = -1;
    }

    private getAngle(a: Vec2, b: Vec2) {
        let delta = v2();
        Vec2.subtract(delta, a, b);
        let degree = misc.radiansToDegrees(Math.atan2(delta.y, delta.x));
        return degree;
    }
}
