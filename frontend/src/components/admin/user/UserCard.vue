<template>
    <div class="user-card">
        <div class="grid">
            <div class="md:col-4 col-12">
                <div class="card">
                    <h4 class="p-card-title flex align-items-center justify-content-between flex-wrap">
                        {{$t('user.form_heading')}}
                            <Button icon="pi pi-pencil" class="p-button-success border-round-3xl"
                                    @click="showUserDialog = true"/>
                    </h4>
                    <p><b>Id: </b>#{{user.id}}</p>
                    <p><b>{{$t('user.username')}}: </b>{{user.username}}</p>
                    <p><b>{{$t('role.name')}}: </b>{{$t(getRoleTitle(user.roleId))}}</p>
                </div>
            </div>
        </div>
        <Sidebar position="right" v-model:visible="showUserDialog" :style="{width: '450px'}" :header="$t('user.form_heading')" class="p-fluid">
            <div>

                <div class="md:w-20rem flex float-r mt-2">
                    <Button :label="$t('crud_table.confirm_yes')" icon="pi pi-check" class="p-button-text"
                            @click="save" :loading="loading"/>
                    <Button :label="$t('crud_table.confirm_no')" icon="pi pi-times" class="p-button-text"
                            @click="showUserDialog = false"/>
                </div>
            </div>
        </Sidebar>
    </div>
</template>

<script>

import {
    API_URL,
    errorHandling,
    getRoleName,
    getRoles,
    saveOrUpdate
} from "../../../helper";

export default {
    name: "UserCard",
    data() {
        return {
            user: {},
            showUserDialog: false,
            errors: [],
            loading: false
        }
    },
    computed: {
        userId() {
            return this.$route.params.id
        },
        roles() {
            return getRoles()
        }
    },
    created() {
        this.getUser()
    },
    methods: {
        save() {
            this.loading = true
            saveOrUpdate(this.user, this.$toast, this.$t, 'user').then(data => {
                this.loading = false
                this.user = data
            }).catch(e => {
                this.errors = errorHandling(e, this.$t, this.$toast)
            }).finally(() => {
                this.loading = false
            })
        },
        getRoleTitle(roleId) {
            return getRoleName(roleId)
        },
        getUser() {
            this.axios.get(API_URL+`user/${this.userId}`).then(res => {
                this.user = res.data
            }).catch(e => {
                errorHandling(e, this.$t, this.$toast)
            })
        }
    }
}
</script>

<style lang="scss">
    .user-card {

        @media (min-width: 960px) {
            >.grid {
                position: relative;
                >div {
                    position: absolute;
                    top: 300px
                }
            }
        }
    }
</style>