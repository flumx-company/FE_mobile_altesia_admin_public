<template>
  <div class="pannel">

    <Header />
      <div class="main-body">
        <Sidebar />
        <div class="main-body-container">
          <router-view></router-view>
        </div>
      </div>
    <Footer />
  </div>
</template>

<script>
    import Header from '@/components/Header.vue';
    import Footer from '@/components/Footer.vue';
    import Sidebar from '@/components/Sidebar.vue';

    export default {
        name: "index",
        components: {
            Header,
            Footer,
            Sidebar,
        }
    }
</script>

<style lang="scss">
@import '../../assets/styles/_panel.scss';
.main-body-container {
    padding: 20px;
    margin-bottom: 50px;
}

</style>
