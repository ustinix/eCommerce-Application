<template>
  <div class="app-logo">
    <div class="logo-container">
      <img class="bg-logo-svg" src="../../assets/images/bg.svg" alt="background for logo" />
      <img class="shoe-logo-svg" src="../../assets/images/shoe.svg" alt="shoe for logo" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-logo {
  width: 40px;
  .logo-container {
    position: relative;
    width: 35px;
    height: 35px;
  }

  .bg-logo-svg {
    position: absolute;
    top: 0;
    left: 0;
  }

  .shoe-logo-svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
