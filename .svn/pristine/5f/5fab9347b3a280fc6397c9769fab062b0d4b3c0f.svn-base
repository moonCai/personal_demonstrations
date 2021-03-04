<template>
  <div
    class="radio-wrapper"
    :class="{ checked: isOn }"
    @click="isOn = !isOn"
  ></div>
</template>

<script>
export default {
  data() {
    return {
      isOn: false,
    };
  },
};
</script>

<style scoped lang="scss">
.radio-wrapper {
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: url("~assets/images/public/radio-off.png") no-repeat center /
    cover;

  &.checked {
    background: url("~assets/images/public/radio-on.png") no-repeat center /
      cover;
  }
}
</style>