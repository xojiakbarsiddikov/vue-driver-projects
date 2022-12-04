<template>
  <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <Toast/>
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
      <div class="col-12 xl:col-4"
           style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
        <div class="h-full w-full m-0 py-7 px-4"
             style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
          <div class="w-full md:w-10 mx-auto">
            <div class="text-center">
              <img src="img/logo.png" alt="NORM system logo" class="mb-5" style="width:81px;">
            </div>
            <div class="p-fluid grid">
              <div class="field col-12">
                <BaseInput v-model="phone" tag="phone" :errors="authErrors" type="mask" mask="99 999 99 99" placeholder="XX XXX XX XX"
                           :label-text="$t('user.phone')"/>
                <BaseInput v-model="password" tag="password" :errors="authErrors" type="password" :label-text="$t('user.password')"/>
              </div>
            </div>
            <Button :loading="loading" :label="$t('login.login_btn_text')" class="w-full p-3 text-xl"
                    @click="submitLogin"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {errorHandling} from "../../helper"
import BaseInput from "../base-components/BaseInput";

export default {
  components: {BaseInput},
  data() {
    return {
      phone: '',
      password: '',
      checked: false,
      authErrors: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    ...mapActions({
      login: "auth/login"
    }),
    submitLogin() {
      this.loading = true
      this.login({phone: this.phone.replace(/\s/g,''), password: this.password}).then(() => {
        this.$router.replace({name: '/'})
      }).catch(e => {
        this.authErrors = errorHandling(e, this.$t, this.$toast)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>