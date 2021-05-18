<template>
  <div id="particle-cesium"></div>
</template>

<script>
  import { server } from "request/api.js";

  import { locationMixin } from "assets/js/mixin/mixin";
  import { defaultInitCesium, A_MAP } from "assets/js/cesium/mapInit";

  export default {
    data() {
      return {};
    },
    mixins: [locationMixin],

    mounted() {
      this.initScene();
    },
    methods: {
      initScene() {
        this.mapViewer = defaultInitCesium("particle-cesium", A_MAP, true);

        this.mapViewer.camera.setView({
          destination: Cesium.Rectangle.fromDegrees(...this.hubeiGeoRect),
        });

        this.creatSnowscene();
      },

      creatSnowscene() {
        let scene = this.mapViewer.scene;
        scene.globe.depthTestAgainstTerrain = true;
        let resetCameraFunction = function () {
          scene.camera.setView({
            destination: new Cesium.Cartesian3(
              277096.634865404,
              5647834.481964232,
              2985563.7039122293
            ),
            orientation: {
              heading: 4.731089976107251,
              pitch: -0.32003481981370063,
            },
          });
        };
        resetCameraFunction();

        // snow
        let snowParticleSize = 12.0;
        let snowRadius = 100000.0;
        let minimumSnowImageSize = new Cesium.Cartesian2(
          snowParticleSize,
          snowParticleSize
        );
        let maximumSnowImageSize = new Cesium.Cartesian2(
          snowParticleSize * 2.0,
          snowParticleSize * 2.0
        );

        let snowSystem;

        let snowGravityScratch = new Cesium.Cartesian3();
        let snowUpdate = function (particle, dt) {
          snowGravityScratch = Cesium.Cartesian3.normalize(
            particle.position,
            snowGravityScratch
          );
          Cesium.Cartesian3.multiplyByScalar(
            snowGravityScratch,
            Cesium.Math.randomBetween(-30.0, -300.0),
            snowGravityScratch
          );
          particle.velocity = Cesium.Cartesian3.add(
            particle.velocity,
            snowGravityScratch,
            particle.velocity
          );

          let distance = Cesium.Cartesian3.distance(
            scene.camera.position,
            particle.position
          );
          if (distance > snowRadius) {
            particle.endColor.alpha = 0.0;
          } else {
            particle.endColor.alpha =
              snowSystem.endColor.alpha / (distance / snowRadius + 0.1);
          }
        };

        snowSystem = new Cesium.ParticleSystem({
          modelMatrix: new Cesium.Matrix4.fromTranslation(
            scene.camera.position
          ),
          minimumSpeed: -1.0,
          maximumSpeed: 0.0,
          lifetime: 15.0,
          emitter: new Cesium.SphereEmitter(snowRadius),
          startScale: 0.5,
          endScale: 1.0,
          image: "../../../static/snow.png",
          emissionRate: 3000.0,
          startColor: Cesium.Color.WHITE.withAlpha(0.0),
          endColor: Cesium.Color.WHITE.withAlpha(1.0),
          minimumImageSize: minimumSnowImageSize,
          maximumImageSize: maximumSnowImageSize,
          updateCallback: snowUpdate,
        });
        scene.primitives.add(snowSystem);
      },
    },
  };
</script>

<style scoped>
  #particle-cesium {
    width: 100%;
    height: 100%;
  }
</style>
