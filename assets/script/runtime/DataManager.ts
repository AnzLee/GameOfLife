import { SpriteFrame } from 'cc'
import Singleton from '../base/Singleton'
import { TileManager } from '../tile/TileManager'

/**
 * 全局数据管理类
 */
export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  mapRowCount: number
  mapColumnCount: number
  mapInfo: Array<Array<number>> = [] //初始生命的描述数据
  tileInfo: Array<Array<TileManager>> = [] //实例化出来的tileManager实例
  ruler: string = 'B3S23' // 规则
  speed: number = 1000 // 执行速度 间隔毫秒
  status: number = 0 // 0 结束 1 开始 2 暂停
  interval: number = 0; // 定时器
  spriteFrames: SpriteFrame[]

  private constructor() {
    super()
    this.reset()
  }

  reset() {
    //地图信息
    this.mapInfo = []
    this.tileInfo = []
    this.ruler = 'B3S23'
    this.speed = 1000
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.status = 0
    this.spriteFrames = []
    if (this.interval && this.interval > 0) {
      clearInterval(this.interval)
      this.interval = 0
    }
  }
}
