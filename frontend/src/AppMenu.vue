<template>
	<div class="layout-menu-container">
		<AppSubmenu :items="model" class="layout-menu" :root="true" @menuitem-click="onMenuItemClick" @keydown="onKeyDown" />
        <hr>
        <ul class="layout-menu">
            <li class="p-menu-separator" role="separator">
                <a href="#" class="p-ripple" @click="logout">
                    <i class="pi pi-fw pi-sign-out"></i>
                    <span>{{$t('logout')}}</span>
                </a>
            </li>
        </ul>
	</div>
</template>

<script>
import AppSubmenu from './AppSubmenu';
import { mapActions } from "vuex";

export default {
	props: {
		model: Array
	},
    methods: {
        ...mapActions({
            signOut: "auth/logout"
        }),
        logout() {
            this.signOut()
            this.$router.replace('/')
        },
        onMenuItemClick(event) {
            this.$emit('menuitem-click', event);
        },
		onKeyDown(event) {
			const nodeElement = event.target;
			if (event.code === 'Enter' || event.code === 'Space') {
				nodeElement.click();
				event.preventDefault();
			}
		},
		bannerImage() {
			return this.$appState.darkTheme ? 'images/banner-primeblocks-dark.png' : 'images/banner-primeblocks.png';
		}
    },
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	},
	components: {
		'AppSubmenu': AppSubmenu
	}
}
</script>