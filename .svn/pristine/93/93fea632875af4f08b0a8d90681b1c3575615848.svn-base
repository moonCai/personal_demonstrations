<template>
  <div
    class="check-box-wrapper"
    :class="{ checked: isChecked }"
    @click="isChecked = !isChecked"
  ></div>
</template>

<script>
export default {
  data() {
    return {
      isChecked: false,
    };
  },
};
</script>

<style scoped lang="scss">
.check-box-wrapper {
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: url("~assets/images/public/unchecked.png") no-repeat center /
    cover;

  &.checked {
    background: url("~assets/images/public/checked.png") no-repeat center /
      cover;
  }
}
</style>