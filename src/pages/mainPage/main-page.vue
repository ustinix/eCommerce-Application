<script setup lang="ts">
import { useRouter } from 'vue-router';
import { TextEditComponent } from '../../enums/text-edit-component';

const router = useRouter();
const goToPromo = () => {
  router.push('/promo');
};
</script>

<template>
  <div class="main-page">
    <div class="content">
      <div class="advert">
        <div class="text-content">
          <h2>{{ TextEditComponent.mainTitleText }}</h2>
          <p>{{ TextEditComponent.mainIntroText }}</p>
          <button class="button">{{ TextEditComponent.advertButtonText }}</button>
        </div>
        <div class="product-image">
          <img src="../../assets/images/black-white.png" alt="sneakers" />
        </div>
      </div>
    </div>
    <div class="discount">
      <div class="discount-content">
        <h2>{{ TextEditComponent.discountTitle }}</h2>
        <p>{{ TextEditComponent.discountText }}</p>
      </div>
      <div class="discount-banner">
        <div class="banner-text">
          <h2>{{ TextEditComponent.discountText2 }}</h2>
          <button class="button" @click="goToPromo">{{ TextEditComponent.discountButton }}</button>
        </div>
        <img src="../../assets/images/discount.png" alt="discount sneakers" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.main-page {
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  .content {
    padding: 5vw 10vw;
    background-color: v.$color-lightgray;
    .advert {
      display: flex;
      align-items: center;
      gap: 40px;
      .text-content {
        flex: 1;
        text-align: left;
        h2 {
          font:
            900 30px/1.2 Montserrat,
            sans-serif;
          color: v.$color-black;
          margin-bottom: 20px;
        }
        p {
          font:
            400 17px/1.5 Montserrat,
            sans-serif;
          color: v.$color-text;
          margin-bottom: 30px;
        }
      }
      .product-image {
        flex: 1;

        img {
          width: 100%;
          max-width: 500px;
          height: auto;
          display: block;
        }
      }
    }
  }
  .discount {
    position: relative;
    margin-top: -50px;
    z-index: 2;
    padding: 0 10vw;
    display: flex;
    align-items: stretch;
    .discount-content {
      flex: 1;
      background: v.$color-white;
      padding: 30px;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-shadow: 0 20px 80px v.$color-border;
      h2 {
        font:
          900 25px/1.2 Montserrat,
          sans-serif;
        color: v.$color-black;
        margin-bottom: 15px;
      }
      p {
        font:
          400 17px/1.5 Montserrat,
          sans-serif;
        color: v.$color-text;
      }
    }
    .discount-banner {
      flex: 1;
      position: relative;

      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
    .banner-text {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      h2 {
        font:
          900 40px/1.2 Montserrat,
          sans-serif;
        color: v.$color-white;
        margin-bottom: 30px;
      }
    }
    .banner-text {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      h2 {
        font:
          900 40px/1.2 Montserrat,
          sans-serif;
        color: v.$color-white;
        margin-bottom: 30px;
      }
    }
  }
  .button {
    padding: 12px 24px;
    background: v.$color-red;
    color: v.$color-white;
    border: none;
    border-radius: 4px;
    font:
      500 16px Montserrat,
      sans-serif;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: v.$color-black;
    }
  }
}
@media (max-width: 1000px) {
  .advert {
    flex-direction: column;

    .text-content {
      text-align: center;

      h2 {
        font-size: 22px;
      }

      p {
        font-size: 14px;
      }
    }
  }

  .discount {
    flex-direction: column;
  }

  .banner-text h2 {
    font-size: 30px !important;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 5vw;
  }

  .discount {
    padding: 0 5vw;
    margin-top: -30px;
  }

  .banner-text h2 {
    font-size: 24px !important;
    margin-bottom: 15px !important;
  }
}
</style>
