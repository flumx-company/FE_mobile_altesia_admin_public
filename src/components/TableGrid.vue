<template>
    <table>
        <th></th>
    </table>
</template>

<script>
    export default {
        props: {
          headers: {
              type: Array,
              default: () => ([])
          }
        },
        name: "table"
    }
</script>

<style scoped>

</style>
