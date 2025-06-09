<script setup lang="ts">
import Avatar from '../../components/layout/avatar.vue';
import { AppNames } from '../../enums/app-names';
import { ksuData, olgaData, rs } from '../../constants/constants';
import rsIcon from '../../assets/images/rs_school_js.svg';
import { TextEditComponent } from '../../enums/text-edit-component';
</script>

<template>
  <div class="about-page">
    <div class="img-container">
      <div class="text">
        <div class="text-inside">
          <h1>{{ AppNames.aboutTitle }}</h1>
          <p>{{ TextEditComponent.aboutPart1 }}</p>
          <p>{{ TextEditComponent.aboutPart2 }}</p>
          <p>
            {{ TextEditComponent.aboutPart3 }}
            <a :href="rs.url" target="_blank" class="rs-icon-link">
              <img :src="rsIcon" :alt="rs.title" class="rs-icon" />
            </a>
            {{ TextEditComponent.aboutPart4 }}
          </p>
        </div>
      </div>
      <img src="../../assets/images/about.png" alt="about img title" class="header-about" />
    </div>
    <div class="avatars">
      <Avatar v-bind="ksuData" />
      <Avatar v-bind="olgaData" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.about-page {
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 3vw;
  text-align: center;
  .img-container {
    position: relative;
    .text {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: v.$color-white;
      .text-inside {
        padding: 10px;
        background-color: v.$color-text;
        opacity: 0.8;
        width: 75%;
        .rs-icon-link {
          margin: 0px 5px;
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          width: 60px;
          height: 50px;
          transition: all 0.3s ease;
          .rs-icon {
            width: 60px;
          }

          &:hover {
            transform: translateY(-2px);
            opacity: 0.8;
            color: v.$color-hover;
          }
        }
      }
    }
    img {
      display: block;
      width: 100%;
    }
  }
  .avatars {
    display: flex;
    gap: 30px;
    justify-content: space-evenly;
  }
}

@media (max-width: 1300px) {
  .avatars {
    flex-direction: column;
  }
}
@media (max-width: 920px) {
  .avatars {
    flex-direction: column;
  }
  .about-page .img-container .text .text-inside[data-v-867ab44e] {
    height: 100%;
    width: 100%;
    .rs-icon-link {
      margin: 0px 5px;
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      width: 40px;
      height: 30px;
      transition: all 0.3s ease;
      .rs-icon {
        width: 40px;
      }
    }
  }
  h1 {
    font-size: 30px;
  }
  p {
    font-size: 12px;
  }
}
@media (max-width: 700px) {
  h1 {
    font-size: 20px;
  }
  p {
    font-size: 10px;
  }
}
</style>
