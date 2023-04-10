import * as Cesium from "cesium";

class MousePosition {
    _positionDiv = document.createElement("div");
    _lat = 0.0;
    _lng = 0.0;
    _handler: Cesium.ScreenSpaceEventHandler;
    viewer: Cesium.Viewer

    constructor(viewer: Cesium.Viewer) {
        this._positionDiv.style.cssText = `
      position: fixed;
      bottom:0;
      right:58px;
      height:29px;
      line-height:29px;
      background-color: rgba(0,0,0,0.5);
      color: #fff;
      font-size: 14px;
      text-align: center;
      z-index: 100;
    `;
        this.viewer = viewer
        this._handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        viewer.container.append(this._positionDiv)

        this._handler.setInputAction((movement: any) => {
            this.getPosition(movement)
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this._handler.setInputAction((movement: any) => {
            this.getPosition(movement)
        }, Cesium.ScreenSpaceEventType.WHEEL);
    }

    // 获取鼠标位置
    getPosition(movement: any) {
        const cartesian = this.viewer.camera.pickEllipsoid(
            movement.endPosition,
            this.viewer.scene.globe.ellipsoid
        );
        if (cartesian) {
            //   转换成经纬度
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(
                cartographic.longitude
            ).toFixed(4);
            const latitude = Cesium.Math.toDegrees(
                cartographic.latitude
            ).toFixed(2);
            const cameraHeight = this.viewer.camera.positionCartographic.height;
            let levelText = '级数：0级  ';
            let tileRender = (this.viewer.scene as any)._globe._surface._tilesToRender;
            if (tileRender && tileRender.length > 0) {
                levelText = "级数：" + (this.viewer.scene as any)._globe._surface._tilesToRender[0]._level + '级  ';
            }
            this._positionDiv.innerHTML = `经度：${longitude} 纬度：${latitude} heading: ${this.viewer.camera.heading}  pitch: ${this.viewer.camera.pitch} roll: ${this.viewer.camera.roll} 相机高度： ${cameraHeight}`;
            this._positionDiv.innerHTML += levelText
        }
    }
}

export default MousePosition;
