<script setup lang="ts"></script>

<template>
  <div class="main-page">
    <div class="content">
      <div class="advert">
        <div class="text">
          <h2>Fantastic Features That <span></span>Makes You Look Cool</h2>
          <p>
            Phasellus risus turpis, pretium sit amet magna non, molestie ultricies enim. Nullam
            pulvinar felis at metus.
          </p>
          <button class="button">View All Items</button>
        </div>
        <img src="../../assets/images/black-white.png" alt="snikers" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  margin: 0 auto;
  padding: 20px;
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
      img {
        max-width: 50%;
        flex: 50%;
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
        }
      }
    }
  }
}
</style>
