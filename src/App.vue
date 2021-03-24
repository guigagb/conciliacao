<template>
	<div id="app">
		<v-app class="d-flex">
			<Header />
			<div class="container-content">
				<router-view />
				<notifications class="mt-2" />
			</div>
		</v-app>
	</div>
</template>

<script>
import Header from "@/template/header.vue";

export default {
	components: { Header },
};
</script>

<style lang="sass">
@import './styles/styles.sass'

html
	height: 100vh
	overflow: hidden

#app
	font-family: Roboto, Avenir, Helvetica, Arial, sans-serif
	-webkit-font-smoothing: antialiased
	-moz-osx-font-smoothing: grayscale
	text-align: center
	color: #2c3e50
	height: 100vh

#app .container-content
	width: 100%
	height: 100%
</style>
