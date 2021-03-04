<template>
	<div id="nav">
		<v-app-bar dark dense color="#f15e4c" class="full-width">
			<v-card
				elevation="0"
				class="d-flex justify-center align-center nav-card full-height rounded-0 primary"
			>
				<h2>CONCILIAÇÃO</h2>
			</v-card>
		</v-app-bar>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss">
#nav {
	margin-top: 10px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav .nav-card {
	margin: 0px 90px 0px 60px;
	width: 100%;
}

#nav .nav-card .card-nav-user {
	width: 25%;
}

#nav .nav-card .card-nav-user .btn-options-user {
	border-left: 1px solid #6b6b6b3f !important;
}
</style>