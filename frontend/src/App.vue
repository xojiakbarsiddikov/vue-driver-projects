<template>
    <div :class="containerClass" @click="onWrapperClick">
        <Toast/>
        <ConfirmDialog></ConfirmDialog>
        <AppTopbar @menu-toggle="onMenuToggle"/>
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick"/>
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view/>
            </div>
            <AppFooter/>
        </div>

        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
    </div>
</template>

<script>
import {
  adminMenu,
  adminRoleId, driverMenu, driverRoleId,
  translateDefaultStrings
} from "./helper";
import AppMenu from "./AppMenu";
import AppFooter from "./AppFooter";
import AppTopbar from "./AppTopbar";
import {mapGetters} from "vuex";

export default {
    name: "App",
    components: {AppTopbar, AppFooter, AppMenu},
    watch: {
        "$i18n.locale"() {
            localStorage.setItem('lang', this.$i18n.locale)
            translateDefaultStrings(this.$primevue, this.$t)
        },
        user() {
            if (!this.user) {
                this.menu = []
            } else {
                switch (this.user.roleId) {
                    case adminRoleId:
                        this.menu = adminMenu
                        break
                }
            }
        },
    },
    emits: ['change-theme'],
    data() {
        return {
            layoutMode: 'static',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            menu: []
        }
    },
    created() {
        translateDefaultStrings(this.$primevue, this.$t)
        switch (this.user.roleId) {
          case adminRoleId:
            this.menu = adminMenu
            break
          case driverRoleId:
            this.menu = driverMenu
            break
        }
    },
    updated() {
    },
    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
                    if (this.mobileMenuActive === true) {
                        this.overlayMenuActive = true;
                    }

                    this.overlayMenuActive = !this.overlayMenuActive;
                    this.mobileMenuActive = false;
                } else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            } else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth >= 992;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
            }

            return true;
        }
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
                'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        logo() {
            return (this.$appState.darkTheme) ? "images/logo-white.svg" : "images/logo.png";
        },
        ...mapGetters({
            user: 'auth/user'
        }),
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    },
}
</script>

<style lang="scss">
@import './App.scss';
@import './assets/demo/badges.scss';
</style>
