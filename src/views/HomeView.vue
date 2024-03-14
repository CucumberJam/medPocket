<script setup>

</script>

<template>
    <div class="image-box">
      <div class="title">
        <h3>Get start</h3>
        <span>keeping information about your analyses, medications</span>
      </div>
      <img class="image" src='/pexels-anna-shvets-3683039.jpg' alt='image'/>
  </div>

</template>

<style scoped>
.image-box{
  margin: 20px auto;
  max-width: 1000px;
  position: relative;
  z-index: -1;
}
.image{
  width: 100%;
  height: auto;;
  max-height: 800px;
  object-fit: cover;
  opacity: 70%;
}
.title{
  right: 10%;
  position: absolute;
  top: 13%;
  left: 10%;
  z-index: 5;
  font-size: 24px;
  color:#8B5CF6;
  text-shadow: 0px 0px 2px rgba(71,31,19,0.98);
}
.title h3{
  margin: 0;
}
@media screen and (min-width: 1150px){
  .image-box{
    max-width: 1400px;
  }
}
</style>