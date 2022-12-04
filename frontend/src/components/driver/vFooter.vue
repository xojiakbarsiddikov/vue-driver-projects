<template>
  <div class="footer-container">
    <div class="content">
      <div class="flex-box">
        <router-link :to="'/'">
          <div class="home">
            <h1>{{ home }}</h1>
          </div>
        </router-link>
        <router-link :to="'/location'">
          <div class="map">
            <h1>{{ map }}</h1>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "vFooter",
  data() {
    return {
      home: 'home',
      map: 'map'
    }
  }
}
</script>

<style scoped>
.content {
  position: fixed;
  height: 5rem;
  z-index: 997;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 2rem;
  background-color: #ffff;
  transition: left 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 3px 5px rgb(0 0 0 / 2%), 0px 0px 2px rgb(0 0 0 / 5%), 0px 1px 4px rgb(0 0 0 / 8%);
}
h1 {
  font-size: 1rem;
  color: #000;
  font-weight: 500;
  text-transform: uppercase;
}
.flex-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 55%;
  margin: 0 auto;
}
@media(max-width: 414px) {
  .content {
    height: 3.7rem;
  }
  h1 {
    margin-top: 9px;
  }
}
</style>