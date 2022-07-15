import { _decorator, Component, Sprite, UITransform, SpriteFrame, Node, EventTouch, v2, Vec2 } from 'cc'
import DataManager from '../runtime/DataManager'
import { ResourceManager } from '../runtime/ResourceManager'
const { ccclass } = _decorator

export const TILE_WIDTH = 16
export const TILE_HEIGHT = 16

@ccclass('TileManager')
export class TileManager extends Component {

  private positionX: number;

  private positionY: number;

  async init(spriteFrame: SpriteFrame, i: number, j: number) {
    const uiTransform = this.getComponent(UITransform)
    const sprite = this.node.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    uiTransform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    // this.node.setPosition(canvasWidth / 2 - i * TILE_WIDTH / 2, canvasHeight / 2 - j * TILE_HEIGHT / 2)
    let mapRowCount = DataManager.Instance.mapRowCount
    let mapColumnCount = DataManager.Instance.mapColumnCount
    this.node.setPosition((i - mapRowCount / 2) * TILE_WIDTH, (mapColumnCount / 2 - j) * TILE_HEIGHT)
    this.positionX = i;
    this.positionY = j;
  }

  onLoad () {
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
  }

  onDestroy () {
    this.node.off(Node.EventType.TOUCH_START, this.onTouchStart)
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd)
  }

  // 初始位置
  private originalTouchLocation = null;

  async onTouchStart (event: EventTouch) {
    let touches = event.getTouches()
    this.originalTouchLocation = touches[0].getLocation()
  }

  async onTouchEnd (event: EventTouch) {
    if (DataManager.Instance.status === 0 || DataManager.Instance.status === 2) {
      let touches = event.getTouches()
      if (touches.length == 1) {
        let location = touches[0].getLocation()
        if (this.originalTouchLocation) {
          let temp = v2()
          Vec2.subtract(temp, location, this.originalTouchLocation)
          let distance = temp.length()
          if (distance < 10) {
            let info = DataManager.Instance.mapInfo[this.positionX][this.positionY]
            if (info == 0) {
              DataManager.Instance.mapInfo[this.positionX][this.positionY] = 1
            } else {
              DataManager.Instance.mapInfo[this.positionX][this.positionY] = 0
            }
            const spriteFrames = DataManager.Instance.spriteFrames
            const imgSrc = `life-${DataManager.Instance.mapInfo[this.positionX][this.positionY]}`
            this.node.getComponent(Sprite).spriteFrame = spriteFrames.find(item => item.name === imgSrc) || spriteFrames[0]
          }
        }
      }
    }
  }

}
