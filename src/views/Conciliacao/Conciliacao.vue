<template>
	<div class="conciliacao">
		<v-row>
			<v-col md="4">
				<v-textarea rows="1" label="Cole o extrato do nubank" no-resize v-model="textNubank"></v-textarea>
				<v-btn @click="loadNubank" color="success">Carregar</v-btn>
				<div>
					<v-card v-for="conta in dadosNubank" :key="conta" class="mt-4">
						<div class="d-flex flex-column px-2">
							<div class="d-flex justify-space-between">
								<span class="small">{{conta.data}}</span>
								<span class="small">{{conta.valor}}</span>
							</div>
							<div class="d-flex flex-start">
								<span>{{conta.descricao}}</span>
							</div>
						</div>
					</v-card>
				</div>
			</v-col>
			<v-col md="4">
				<div>
					<v-card class="mt-4">Nubank</v-card>
				</div>
				<div>
					<v-card class="mt-4">Mobills</v-card>
				</div>
			</v-col>
			<v-col md="4">
				<v-file-input ref="inputFile" label="Selecionar arquivo .xls"></v-file-input>
				<v-btn @click="loadMobills" color="success">Carregar</v-btn>
				<div>
					<v-card v-for="conta in dadosMobills" :key="conta" class="mt-4">
						<div class="d-flex flex-column px-2">
							<div class="d-flex justify-space-between">
								<span class="small">{{conta.data}}</span>
								<span class="small">{{conta.valor}}</span>
							</div>
							<div class="d-flex flex-start">
								<span>{{conta.descricao}}</span>
							</div>
						</div>
					</v-card>
				</div>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import readXlsxFile from "read-excel-file";

export default {
	components: {},
	data() {
		return {
			textNubank: "",
			dadosNubank: [],
			xlsMobills: [],
			dadosMobills: [],
		};
	},
	computed: {},
	methods: {
		loadNubank() {
			let dados = this.textNubank.match(/\d{2} \D{3}\n.*/g);

			this.dadosNubank = dados.map((value) => {
				value = value.split(/\n/g);
				return {
					data: value[0],
					descricao: value[1].match(/.*	/g)[0].trim(),
					valor: value[1].match(/	.*/g)[0].trim(),
				};
			});
		},
		loadMobills() {
			this.xlsMobills = this.xlsMobills[0];
			this.xlsMobills.splice(0, 1);
			this.dadosMobills = this.xlsMobills.map((value) => {
				return {
					data: value[0],
					descricao: value[1],
					valor: value[3].replace("R$ ", ""),
				};
			});
			console.log(this.dadosMobills);
		},
	},
	async mounted() {
		await this.$nextTick();
		let input = this.$refs.inputFile.$refs.input;
		input.addEventListener("change", () => {
			this.xlsMobills = [];
			readXlsxFile(input.files[0]).then((rows) => {
				this.xlsMobills.push(rows);
				// `rows` is an array of rows
				// each row being an array of cells.
			});
		});
	},
};
</script>

<style lang="sass">
.conciliacao
	padding: 10px

.conciliacao span.small
	font-size: 12px
</style>