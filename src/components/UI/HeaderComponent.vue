<script setup>
import SearchComponent from "@/components/UI/SearchComponent.vue";
import NavBarComponent from "@/components/UI/NavBarComponent.vue";
import MenuBurgerComponent from "@/components/UI/MenuBurgerComponent.vue";
import LogoComponent from "@/components/UI/LogoComponent.vue";

defineProps({
  id_user: String,
  isLoggedIn: Boolean,
  logout: Function,
  filterAnalyses: Function,
  filterMedications: Function,
  mode: String
})
</script>

<template>
  <header class="wrapper-head">
    <nav>
      <LogoComponent/>
      <SearchComponent :id_user="id_user"
                       :filter-analyses="filterAnalyses"
                       :filter-medications="filterMedications"
                       :mode="mode"/>

      <NavBarComponent :is-logged-in="isLoggedIn"
                       :logout="logout"/>

      <MenuBurgerComponent :is-logged-in="isLoggedIn"
                           :logout="logout"/>

    </nav>
  </header>
</template>

<style scoped>
.wrapper-head {
  line-height: 1.5;
  max-height: 100vh;
  height: 100%;

  margin: 0 30px;

  border-radius: 5px;
  background: #8B5CF6;;
  opacity:85%;
  color: white;
  overflow: visible;
}
nav {
  padding: 10px 0;
  font-size: 14px;
  text-align: center;
  font-weight: bolder;

  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: visible;
}
nav div:first-child{
  padding-left: 20px;
}
nav div:last-child{
  padding-right: 10px;
  margin-left: 20px;
}

nav a:first-of-type {
  border: 0;
}

@media screen and (max-width: 696px){
  header{
    margin: 0 10px;
  }
}
@media screen and (max-width: 460px){
  header{
    margin: 0;
  }
  .wrapper nav{
    flex-wrap: wrap;
  }
}
</style>