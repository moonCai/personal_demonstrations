import HeaderComponent from "components/common/Header";

export const locationMixin = {
  data() {
    return {
      mapViewer: null,
      hubeiGeoRect: [
        113.15906303451439,
        29.93802544460981,
        115.43153969272025,
        31.38353006245101
      ]
    }
  },
  components: {
    HeaderComponent
  },
  destoyed() {
    this.mapViewer && this.mapViewer.destoy();
  }
}
