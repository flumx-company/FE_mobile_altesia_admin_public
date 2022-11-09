<template>
    <div class="header">
      <router-link to="/">
        <img src="../assets/images/logo.png" alt="">
      </router-link>

      <div class="exit-block" v-if="isLoginPage">
        <div class="admin-name">
          <img class="avatar" src="../assets/images/user.png" alt="">
          <div class="title">Superadmin</div>
        </div>
        <div class="exit" @click="exit">
          Exit
        </div>
      </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from "vue-router";
import { AltesiaTokenWorkerPlugin } from "../plugins/token.plugin";
import { useRouter } from "vue-router";
import { ROUTES } from "../router";

  export default {
    name: "header",
    setup() {
      const route = useRoute()

      const isLoginPage = computed(() => route.path !== "/login")

      const exit = router => {
        return () => {
          console.log(router.currentRoute.value.query.redirectUrl)
          AltesiaTokenWorkerPlugin.clearToken();
          router.push(
            router.currentRoute.value.query.redirectUrl
              ? router.currentRoute.value.query.redirectUrl
              : ROUTES.LOGIN
          )
        }
      }
      
      const router = useRouter();

      return {
        isLoginPage,
        exit: exit(router)
      }
    }
  }
</script>

<style lang="scss">
@import '../assets/styles/_colors.scss';
@import '../assets/styles/_mixins.scss';
@import '../assets/styles/_header.scss';
</style>