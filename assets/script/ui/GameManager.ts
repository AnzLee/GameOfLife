
import { _decorator, Component, Node, EventTouch, v2, Vec2, Camera, clamp, misc, v3, find, TiledMap, UITransform, Button, Label } from 'cc';
import { resetLife, runLife, stopLife } from '../life';
import { createMap } from '../map';
import DataManager from '../runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { TileMapManager } from '../tile/TileMapManager';
import { createUINode } from '../utils';
import { ZoomManager } from '../zoom/ZoomManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Thu Jun 16 2022 10:11:07 GMT+0800 (中国标准时间)
 * FileBasename = GameManager.ts
 * FileBasenameNoExtension = GameManager
 * URL = db://assets/script/GameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('GameManager')
export class GameManager extends Component {

    @property(Number)
    x: number = 100

    @property(Number)
    y: number = 100

    @property(Number)
    minLength: number

    @property(Number)
    maxLength: number

    private stage: Node = null //舞台

    start () {
        this.generateStage()
        this.loadZoom(this.stage)
        this.init()
    }

    loadZoom(stage: Node) {
        let zoomManager = this.node.addComponent(ZoomManager)
        zoomManager.init(null, stage, this.minLength, this.maxLength)
    }

    generateStage() {
        this.stage = createUINode()
        this.stage.setParent(this.node)
        this.stage.setSiblingIndex(2)
    }

    async init() {
        // 地图信息
        let mapInfo = createMap(this.x, this.y)
        DataManager.Instance.mapInfo = mapInfo
        DataManager.Instance.mapRowCount = mapInfo.length || 0
        DataManager.Instance.mapColumnCount = mapInfo[0]?.length || 0
        await Promise.all([
            this.generateTileMap()
        ])
    }

    async generateTileMap() {
        const node = createUINode()
        node.setParent(this.stage)
        const tileMapManager = node.addComponent(TileMapManager)
        await tileMapManager.init()
        // this.adaptMapConstentSize(node)
    }

    async destoryTileMap() {
        this.stage.destroyAllChildren()
    }
  
    adaptMapConstentSize(node: Node) {
        const { mapRowCount, mapColumnCount } = DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount)
        const disY = (TILE_HEIGHT * mapColumnCount)
        this.stage.getComponent(UITransform).setContentSize(disX, disY)
        node.getComponent(UITransform).setContentSize(disX, disY)
    }

    startClick () {
        if (DataManager.Instance.status !== 1) {
            runLife()
        }
    }

    stopClick () {
        if (DataManager.Instance.status !== 2) {
            stopLife()
        }
    }

    resetClick () {
        this.stopClick()
        if (DataManager.Instance.status !== 0) {
            resetLife()
        }
    }
}
