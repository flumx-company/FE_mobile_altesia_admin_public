<template>
    <div class="sidebar">
      <ul>
        <li v-for="item in sidebar" :key="item.id">
          <router-link :to="item.link" :class="{active: item.isActive}">
              <img :src="item.img" alt="">
              {{ item.name }}
          </router-link>

        </li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: "sidebar",
    methods: {
      getImgUrl (pic) {
        return require('../assets/images/' + pic)
      }
    },
      computed:{
          sidebar() {
              return [
                  { id: 0, name: 'Users', img: this.getImgUrl('users.svg'), link: '/panel/users'},
                  { id: 1, name: 'Opportunities', img: this.getImgUrl('opportunities.svg'), link: '/panel/opportunities'},
                  { id: 2, name: 'Events', img: this.getImgUrl('events.svg'), link: '/panel/events'},
                  { id: 3, name: 'Requested features', img: this.getImgUrl('features.svg'), link: '/panel/requested-features' },
                  { id: 4, name: 'Community (forum)', img: this.getImgUrl('forum.svg'), link: '/panel/community' },
                  { id: 5, name: 'Managing', img: this.getImgUrl('managing.svg'), link: '/panel/managing' }
              ].map(item => ({
                  ...item,
                  isActive: this.$route.path.includes(item.link)
              }))
          }
      }
  }
</script>

<style lang="scss">
@import '../assets/styles/_colors.scss';
@import '../assets/styles/_mixins.scss';
@import '../assets/styles/_sidebar.scss';

    .active {
        color: #40BB15!important;
    }
</style>
