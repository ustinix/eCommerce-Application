<script setup lang="ts">
const props = defineProps({
  github: {
    type: String,
    default: '',
  },
  githubLabel: {
    type: String,
    default: 'GitHub',
  },
  backgroundImage: {
    type: String,
    required: true,
  },
  avatarImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  aboutText: {
    type: String,
    default: '',
  },
  contributionTitle: {
    type: String,
    default: 'Contribution to the project:',
  },
  items: {
    type: Array<{ text: string; icon: string }>,
    default: () => [],
  },
});
</script>

<template>
  <div class="about-container">
    <div class="card-container">
      <v-card class="mx-auto" width="600" height="800" rounded="0">
        <v-img :src="props.backgroundImage" cover>
          <v-avatar color="grey" rounded="10" size="250">
            <v-img height="100%" :src="props.avatarImage" cover></v-img>
          </v-avatar>
          <div class="info-block">
            <v-list-item
              class="text-black"
              :subtitle="props.subtitle"
              :title="props.title"
            ></v-list-item>
            <v-list-item v-if="github" class="github-link">
              <a :href="github" target="_blank" rel="noopener noreferrer">
                {{ githubLabel }}
              </a>
            </v-list-item>
          </div>
          <v-list density="compact">
            <v-card-text class="px-4 py-2 text-body-2"> {{ props.aboutText }} </v-card-text>
            <v-list-subheader>{{ props.contributionTitle }}</v-list-subheader>

            <v-list-item v-for="(item, i) in props.items" :key="i" :value="item" color="primary">
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>

              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-img>
      </v-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.about-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 30px;
  .card-container {
    display: flex;
    .info-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 16px;
    }

    .github-link {
      font-size: 14px;
      min-height: 40px;

      a {
        color: inherit;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .v-list-item-title {
    text-align: left;
  }
}
</style>
