import { find, Label, Sprite } from "cc"
import { createMap } from "../map"
import DataManager from "../runtime/DataManager"
import { TileManager } from "../tile/TileManager"

export const runLife = () => {
    DataManager.Instance.status = 1
    let ruler = find("Canvas/Inputs/Rule/TEXT_LABEL").getComponent(Label).string
    let speed = parseInt(find("Canvas/Inputs/Speed/TEXT_LABEL").getComponent(Label).string)
    if (ruler) {
        DataManager.Instance.ruler = ruler
    } else {
        DataManager.Instance.ruler = 'B3S23'
    }
    if (speed) {
        DataManager.Instance.speed = speed
    } else {
        DataManager.Instance.speed = 1000
    }
    let tempRuler = DataManager.Instance.ruler
    let tempSpeed = DataManager.Instance.speed
    let indexB = tempRuler.indexOf('B')
    let indexS = tempRuler.indexOf('S')
    let born:number = parseInt(tempRuler.substring(indexB + 1, indexS))
    let servive: number[] = tempRuler.substring(indexS + 1).split('').map(item => {return parseInt(item)})
    let spriteFrames = DataManager.Instance.spriteFrames
    DataManager.Instance.interval = setInterval(() => {
        let tileInfo: TileManager[][] = DataManager.Instance.tileInfo
        let mapInfo: number[][] = DataManager.Instance.mapInfo
        let copyMapInfo: Array<Array<number>> = createMap(DataManager.Instance.mapRowCount, DataManager.Instance.mapColumnCount)
        let isChange = false
        for (let i = 0; i < tileInfo.length; i++) {
            let column = tileInfo[i]
            for (let j = 0; j < column.length; j++) {
                let neighbour: number = 0
                let tileManager = column[j]
                if (i === 0) {
                    if (j === 0) {
                        neighbour = mapInfo[i+1][j] + mapInfo[i][j+1] + mapInfo[i+1][j+1]
                    } else if (j === column.length - 1) {
                        neighbour = mapInfo[i][j-1] + mapInfo[i+1][j-1] + mapInfo[i+1][j]
                    } else {
                        neighbour = mapInfo[i][j-1] + mapInfo[i][j+1] + mapInfo[i+1][j-1] + mapInfo[i+1][j] + mapInfo[i+1][j+1]
                    }
                } else if (i === tileInfo.length - 1) {
                    if (j === 0) {
                        neighbour = mapInfo[i-1][j] + mapInfo[i-1][j+1] + mapInfo[i][j+1]
                    } else if (j === column.length - 1) {
                        neighbour = mapInfo[i-1][j-1] + mapInfo[i][j-1] + mapInfo[i-1][j]
                    } else {
                        neighbour = mapInfo[i-1][j-1] + mapInfo[i-1][j] + mapInfo[i-1][j+1] + mapInfo[i][j-1] + mapInfo[i][j+1]
                    }
                } else {
                    if (j === 0) {
                        neighbour = mapInfo[i-1][j] + mapInfo[i+1][j] + mapInfo[i][j+1] + mapInfo[i+1][j] + mapInfo[i+1][j+1]
                    } else if (j === column.length - 1) {
                        neighbour = mapInfo[i-1][j-1] + mapInfo[i][j-1] + mapInfo[i][j-1] + mapInfo[i+1][j-1] + mapInfo[i+1][j]
                    } else {
                        neighbour = mapInfo[i-1][j-1] + mapInfo[i-1][j] + mapInfo[i-1][j+1] + mapInfo[i][j-1] + mapInfo[i][j+1] + mapInfo[i+1][j-1] + mapInfo[i+1][j] + mapInfo[i+1][j+1]
                    }
                }
                copyMapInfo[i][j] = mapInfo[i][j]
                if (mapInfo[i][j] === 0) {
                    if (neighbour === born) {
                        copyMapInfo[i][j] = 1
                        tileManager.getComponent(Sprite).spriteFrame = spriteFrames.find(item => item.name === 'life-1') || spriteFrames[0]
                    }
                } else if (mapInfo[i][j] === 1) {
                    let isServive = servive.filter(item => item === neighbour).length > 0
                    if (!isServive) {
                        copyMapInfo[i][j] = 0
                        tileManager.getComponent(Sprite).spriteFrame = spriteFrames.find(item => item.name === 'life-0') || spriteFrames[0]
                    }
                }
                if (copyMapInfo[i][j] !== mapInfo[i][j]) {
                    isChange = true
                }
            }
        }
        DataManager.Instance.mapInfo = copyMapInfo
        if (!isChange) {
            stopLife()
        }
    }, tempSpeed)
}

export const stopLife = () => {
    DataManager.Instance.status = 2
    if (DataManager.Instance.interval && DataManager.Instance.interval > 0) {
        clearInterval(DataManager.Instance.interval)
        DataManager.Instance.interval = 0
    }
}

export const resetLife = () => {
    DataManager.Instance.status = 0
    stopLife()
    let tileInfo: TileManager[][] = DataManager.Instance.tileInfo
    let mapInfo: number[][] = DataManager.Instance.mapInfo
    let spriteFrames = DataManager.Instance.spriteFrames
    for (let i = 0; i < tileInfo.length; i++) {
        let column = tileInfo[i]
        for (let j = 0; j < column.length; j++) {
            let tileManager = column[j]
            mapInfo[i][j] = 0
            tileManager.getComponent(Sprite).spriteFrame = spriteFrames.find(item => item.name === 'life-0') || spriteFrames[0]
        }
    }
    DataManager.Instance.mapInfo = mapInfo
}