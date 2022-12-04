<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img alt="Logo" :src="topbarImage()"/>
        </router-link>
        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button"
                v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein',
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
            <i class="pi pi-ellipsis-v"></i>
        </button>
        <ul class="layout-topbar-menu hidden lg:flex origin-top flex-row">
            <li class="flex align-items-center mr-2">
                <img src="@/assets/demo/flags/flag_placeholder.png"
                     :class="{'border-gray-900 border-2': $root.$i18n.locale==='uz'}"
                     class="flag flag-uz cursor-pointer" width="30"
                     @click="$root.$i18n.locale='uz'"/>
            </li>
            <li class="flex align-items-center mr-2">
                <img src="@/assets/demo/flags/flag_placeholder.png"
                     :class="{'border-gray-900 border-2': $root.$i18n.locale==='ru'}"
                     class="flag flag-ru cursor-pointer" width="30"
                     @click="$root.$i18n.locale='ru'"/>
            </li>
            <li>
                <button class="p-link layout-topbar-button" @click="event => $refs.userMenu.toggle(event)">
                    <i class="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Menu ref="userMenu" :model="userMenu" :popup="true">
                    <template #item="{item}">
                        <a class="p-menuitem-link" @click="menuItemClick(item.action)" role="menuitem">
                            <span :class="['p-menuitem-icon', item.icon]"></span>
                            <span class="p-menuitem-text">{{ item.label }}</span>
                        </a>
                    </template>
                </Menu>
            </li>
        </ul>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import EventBus from '@/AppEventBus';

export default {
    methods: {
        addReminder() {
            EventBus.emit('showSidebar::reminder')
        },
        ...mapActions({
            signOut: "auth/logout"
        }),
        logout() {
            this.signOut()
            this.$router.replace('/')
        },
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
        topbarImage() {
            return 'img/logo.png';
        },
        menuItemClick(action) {
            switch (action) {
                case 'logout':
                    this.logout()
                    break
                case 'profile':
                    this.$router.replace({name: 'Profile'})
                    break
            }
            this.$refs.userMenu.hide()
        }
    },
    computed: {
        darkTheme() {
            return this.$appState.darkTheme;
        },
        userMenu() {
            return [
                {
                    label: this.$t('user.profile'),
                    icon: 'pi pi-user',
                    action: 'profile'
                },
                {
                    label: this.$t('logout'),
                    icon: 'pi pi-sign-out',
                    action: 'logout'
                },
            ]
        }
    },
}
</script>

<style lang="scss">
.layout-topbar {
    .flag {
        border: 1px solid #999;
        border-radius: 5px;
    }
}
</style>