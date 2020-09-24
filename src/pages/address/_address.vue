<template>
    <h1>Hello world</h1>
</template>
<script>
export default {
    mounted() {
        console.log(this.$route.fullPath);
        console.log(this.$route.params)
      }
    };
</script>