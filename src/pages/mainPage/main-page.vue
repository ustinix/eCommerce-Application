<script setup lang="ts">
const advertMainTitleFirst = 'Fantastic Features That';
const advertMainTitleSecond = 'Makes You Look Cool';
const advertMainText =
  'Phasellus risus turpis, pretium sit amet magna non, molestie ultricies enim. Nullam pulvinar felis at metus.';
const advertBtnText = 'View All Items';
</script>

<template>
  <div class="main-page">
    <div class="content">
      <div class="advert">
        <div class="text">
          <h2>{{ advertMainTitleFirst }} <span></span>{{ advertMainTitleSecond }}</h2>
          <p>{{ advertMainText }}</p>
          <button class="button">{{ advertBtnText }}</button>
        </div>
        <div class="image-container">
          <img src="../../assets/images/black-white.png" alt="snikers" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  text-align: center;
  .content {
    padding: 5vw 10vw;
    background-color: #e7e8e9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    .advert {
      display: flex;
      align-items: center;
      .text {
        font-family: Montserrat, sans-serif;
        flex: 50%;
        display: flex;
        flex-direction: column;
        gap: 2vh;
        text-align: left;
        h2 {
          font-weight: 900;
          color: #000;
          font-size: 30px;
        }
        p {
          font-weight: 400;
          font-size: 17px;
          color: #504e4a;
        }
        span {
          display: block;
        }
        .button {
          width: 150px;
        }
      }
      .image-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: auto;
          max-width: 500px; /* Максимальный размер изображения */
          object-fit: contain;
        }
      }
    }
  }
}
@media (max-width: 1000px) {
  .main-page {
    .content {
      .advert {
        flex-direction: column;
        gap: 3vh;
        .text {
          gap: 3vh;
          h2 {
            font-size: 22px;
          }
          p {
            font-size: 12px;
          }
          .image-container {
            width: 100%;
            padding: 0 1rem;

            img {
              max-width: 80%;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .main-page {
    .content {
      .advert {
        .image-container {
          img {
            max-width: 100%;
          }
        }
      }
    }
  }
}
</style>
