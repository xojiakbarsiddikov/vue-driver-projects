<template>
  <div class="grid-templates">
    <div class="col-12222">
      <div class="card">
        <div class="col-12222 md:col-4">
          <div class="card-product">
            <div class="grid-templates">
                <div class="text-center12" v-for="card in products.city" :key="card.id" @click="open">
                  <img src="../../assets/images/andijan.jpg" class="w-999 shadow-2 my-3 mx-0">
                  <div class="text-2xl12 font-bold">{{ card.title }}</div>
                </div>
            </div>
          </div>
          <Dialog  header="Dialog" v-model:visible="display" :breakpoints="{'960px': '75vw'}" :style="{width: '30vw'}"
                   :modal="true">
            <form>
              <div class="field">
                <Calendar id="calendar" v-model="value3" class="input"  :showTime="true" :showIcon="true" />
              </div>
              <div class="field">
                <Textarea id="textarea" v-model="value9" rows="6" cols="40"/>
              </div>
              <div class="text">
                <h5>shahar: {{ products.id }}</h5>
              </div>
            </form>
            <template #footer>
              <Button label="Ok" @click="close" icon="pi pi-check" class="p-button-outlined"/>
            </template>
          </Dialog>
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
  name: 'vCity',
  data() {
    return {
      dataviewValue: null,
      id: this.$route.params.id,
      display: false,
      products: [],
      value3: null,
      value9: null,
    }
  },
  methods: {
    open() {
      this.display = true;
    },
    close() {
      this.display = false;
    },
  },
  mounted() {
    axios
        .get(`http://localhost:3000/product/${this.id}`)
        .then(response => (this.products = response.data))
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
  .layout-main-container {
    padding: 5.5rem 2rem 2rem 4rem!important;
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
