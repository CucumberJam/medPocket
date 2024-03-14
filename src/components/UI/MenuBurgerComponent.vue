<script setup>
import {RouterLink} from "vue-router";
import {ref} from "vue";

defineProps({
  isLoggedIn: Boolean,
  logout: Function,
})
const showBurger = ref(false);
const toggleBurger = () => {
  showBurger.value = !showBurger.value;
}
</script>

<template>
  <div class="menu-burger" @click="toggleBurger">
    <button class="menu-btn">
      <span class="menu-btn__item"></span>
    </button>
    <ul v-if="showBurger" class="menu-list">

      <li class="menu-list-item">
        <RouterLink to="/">Home</RouterLink>
      </li>

      <li class="menu-list-item" v-if="isLoggedIn">
        <RouterLink to="/profile">Profile</RouterLink>
      </li>

      <li class="menu-list-item" v-else>
        <RouterLink to="/signup">SignUp</RouterLink>
      </li>

      <li class="menu-list-item" v-if="isLoggedIn"
          @click.prevent="logout">
        <a href="#" class="nav-link">Log out</a>
      </li>

      <li class="menu-list-item" v-else>
        <RouterLink to="/signin">SignIn</RouterLink>
      </li>

    </ul>
  </div>
</template>

<style scoped>
.menu-burger{
  display: none;
  position: relative;
  overflow: visible;
  margin-right: 10px;
}
.menu-btn{
  display: flex;

  padding: 0;
  margin: 0;
  width: 32px;
  height: 23px;
  border: none;
  background-color: transparent;
}
.menu-btn:hover .menu-btn__item,
.menu-btn:hover .menu-btn__item::before,
.menu-btn:hover .menu-btn__item::after{
  background-color: #222222;
}
.menu-btn__item{
  margin: auto;
  display: block;
  width: 100%;
  height: 3px;
  background-color: #fff;
  position: relative;
  overflow: visible;
}
.menu-btn__item::before,
.menu-btn__item::after{
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background-color: #fff;
  position: absolute;
  left: 0;
}
.menu-btn__item::before{
  top: -10px;
}
.menu-btn__item::after{
  top: 10px;
}

.menu-list {
  color: #551A8B;
  width: 90px;
  padding: 10px 0 10px 0;
  border-radius: 3px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;

  background-color: #fff;
  list-style-type: none;
  position: absolute;
  top: 30px;
  right: 0;
  visibility: visible;
  z-index: 10;

}
.menu-list-item {}
.menu-list-item a, .nav-link {
  color: #551A8B;
  text-decoration: none;
}
.menu-list-item a:hover, .nav-link:hover {
  color: orange;
}
.menu-list-item a:active, .nav-link:active {
  color: grey;
}
@media screen and (max-width: 696px){
  header{
    margin: 0 10px;
  }
  .menu-burger{
    display: flex;
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