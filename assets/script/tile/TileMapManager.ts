import { _decorator, Component } from 'cc'
import DataManager from '../runtime/DataManager'
import { ResourceManager } from '../runtime/ResourceManager'
import { createUINode, randomByRange } from '../utils'
import { TileManager } from './TileManager'
const { ccclass } = _decorator

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const { mapInfo } = DataManager.Instance
    DataManager.Instance.tileInfo = []
    const spriteFrames = await ResourceManager.Instance.loadDir('images/life/')
    DataManager.Instance.spriteFrames = spriteFrames
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      DataManager.Instance.tileInfo[i] = []
      for (let j = 0; j < column.length; j++) {
        let item = column[j]
        if (item === null) {
          continue
        }
        
        let number = item

        const imgSrc = `life-${number}`
        const spriteFrame = spriteFrames.find(item => item.name === imgSrc) || spriteFrames[0]
        const tile = createUINode()
        const tileManager = tile.addComponent(TileManager)
        tileManager.init(spriteFrame, i, j)
        tile.setParent(this.node)
        DataManager.Instance.tileInfo[i][j] = tileManager
      }
    }
  }
}
