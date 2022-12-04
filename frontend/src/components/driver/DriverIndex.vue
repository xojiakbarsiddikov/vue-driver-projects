<template>
  <div class="grid-templates">
    <div class="col-12222">
      <div class="card">
        <div class="col-12222 md:col-4">
          <div class="card-product">
            <div class="grid-templates">
              <router-link class="href" v-for="card in cards" :key="card.id" :to="'/city/' + card.id">
                <div class="text-center12">
                  <img :src="require(`../../assets/images/${ card.img }`)" class="w-999 shadow-2 my-3 mx-0">
                  <div class="text-2xl12 font-bold">{{ card.title }}</div>
                </div>
              </router-link>
            </div>
          </div>
         <v-footer />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import vFooter from './vFooter'
export default {
  name: 'DrinverIndex',
  data() {
    return {
      dataviewValue: null,
      layout: 'grid',
      sortKey: null,
      sortOrder: null,
      sortField: null,
      cards: []
    }
  },
  mounted() {
    axios
        .get('http://localhost:3000/product')
        .then(response => (this.cards = response.data))
        .catch((err) => {
          console.log(err)
        })
  },
  components: {
    vFooter
  }
}
</script>

<style scoped lang="scss">
.w-999 {
  width: 77%;
  height: 100px;
}
.text-center12 {
  text-align: center!important;
  width: 173px;
  text-transform: capitalize;
}
.text-2xl12 {
  font-size: 1rem !important;
}
.href[data-v-c90de95e] {
  text-decoration: none!important;
  color: #1f1e1e!important;
}
a {
  text-decoration: none!important;
  color: #1f1e1e!important;
}
.shadow-2 {
  box-shadow: 0px 4px 10px rgb(0 0 0 / 3%), 0px 0px 2px rgb(0 0 0 / 6%), 0px 2px 6px rgb(0 0 0 / 12%) !important;
}
.href[data-v-c90de95e] {
  text-decoration: none;
  color: #1f1e1e;
  width: 143px;
}
.col-12222 {
  width: 356px;
  height: 1100px;
  padding: 15px 0;
}

@media(max-width: 2000px) {
  .grid-templates {
    display: none;
  }
}

@media(max-width: 500px) {
  .layout-wrapper {
    padding-left: 0.5rem!important;
  }
  .grid-templates {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    margin-right: -0.7rem!important;
    margin-top: -0.5rem!important;
    width: 100%;
    margin: 0 auto;
  }
}

@media(max-width: 414px) {
  .layout-wrapper .layout-main-container {
    margin-left: -9px;
    padding-left: 0rem;
  }
  .w-999[data-v-c95a4e2a] {
    width: 77%;
  }
  .text-2xl12[data-v-c95a4e2a] {
    font-size: 1.2rem !important;
  }
  .col-12222 {
    width: 389px;
  }
  .grid-templates {
    padding-bottom: 146px;
  }
  .card {
    padding: 0rem!important;
  }
  .text-center12 {
    width: 174px;
  }
}

@media(max-width: 393px) {
  .col-12222{
    width: 368px;
  }
  .text-center12 {
    width: 166px;
  }
}

@media(max-width: 390px) {
  .col-12222 {
    width: 365px;
  }
  .text-center12 {
    width: 165px;
  }
}

@media(max-width: 375px) {
  .grid-templates {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    margin-right: 1rem !important;
    margin-top: -0.5rem !important;
    width: 93%;
    margin: 0 auto;
  }
  .col-12222 {
    width: 350px;
  }
  .text-center12{
    width: 166px;
  }
  .w-999 {
    width: 71%!important;
    height: 99px!important;
  }
}
@media(max-width: 360px) {
  .col-12222 {
    width: 337px;
  }
  .text-center12{
    width: 158px;
  }
}
@media(max-width: 320px) {
  .col-12222{
    width: 303px!important;
  }
  .text-center12 {
    width: 147px!important;
  }
}
</style>
