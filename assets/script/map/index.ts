export const createMap = (width: number = 0, height: number = 0) => {
    const map = new Array();
    for (let j = 0; j < height; j++) {
        let column = new Array();
        for (let i = 0; i < width; i++) {
            column[i] = 0;
        }
        map[j] = column;
    }
    return map;
}