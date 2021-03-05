<template>
	<div class="conciliacao">
		<v-row>
			<v-col md="4">
				<v-textarea rows="1" label="Cole o extrato do nubank" no-resize v-model="textNubank"></v-textarea>
				<v-btn @click="loadNubank" color="success">Carregar</v-btn>
				<div>
					<v-card
						@click="clickSyncNu(index)"
						:disabled="conta.conciliado"
						v-for="(conta, index) in dadosNubank"
						:key="conta.data+conta.descricao+conta.valor"
						class="mt-4"
						:class="[
							index == indexMobillsSync ? 'selected' : '',
							conta.conciliado ? 'conciliado' : ''
						]"
					>
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
					<v-card
						@click="clickSyncMobills(index)"
						:disabled="conta.conciliado"
						v-for="(conta,index) in dadosMobills"
						:key="conta.data + conta.descricao + conta.valor"
						class="mt-4"
						:class="[
							index == indexMobillsSync ? 'selected' : '',
							conta.conciliado ? 'conciliado' : ''
						]"
					>
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
import { nameMonthToMonth } from "../../js/util";
import moment from "moment";

export default {
	components: {},
	data() {
		return {
			textNubank: "",
			dadosNubank: [],
			xlsMobills: [],
			dadosMobills: [],
			indexNuSync: undefined,
			indexMobillsSync: undefined,
			dadosSincronismo: [],
		};
	},
	computed: {},

	methods: {
		loadNubank() {
			let dados = this.textNubank.match(/\d{2} \D{3}\n.*/g);

			this.dadosNubank = dados.map((value) => {
				value = value.split(/\n/g);
				let data = value[0];
				let [dia, mes] = data.split(" ");
				dia = dia.toString().padStart(2, "0");
				mes = nameMonthToMonth(mes).toString().padStart(2, "0");

				return {
					data: moment(`2021-${mes}-${dia}`).format("DD/MM/YYYY"),
					descricao: value[1].match(/.*	/g)[0].trim(),
					valor: value[1].match(/	.*/g)[0].trim(),
					conciliado: 0,
				};
			});
		},
		loadMobills() {
			this.xlsMobills = this.xlsMobills[0];
			this.xlsMobills.splice(0, 1);
			this.dadosMobills = this.xlsMobills.map((value) => {
				let [dia, mes, ano] = value[0].split("/");
				return {
					moment: moment([ano, mes - 1, dia]),
					data: value[0],
					descricao: value[1],
					valor: value[3].replace("R$ ", ""),
					conciliado: 0,
				};
			});

			this.dadosMobills = this.dadosMobills.reverse();
		},
		clickSyncNu(index) {
			this.indexNuSync = index;
			this.pushConciliacao();
		},
		clickSyncMobills(index) {
			this.indexMobillsSync = index;
			this.pushConciliacao();
		},
		pushConciliacao() {
			if (this.indexNuSync != undefined && this.indexMobillsSync != undefined) {
				this.dadosNubank[this.indexNuSync].conciliado = 1;
				this.dadosMobills[this.indexMobillsSync].conciliado = 1;
				this.dadosSincronismo.push({
					nubank: this.dadosNubank[this.indexNuSync],
					mobills: this.dadosMobills[this.indexMobillsSync],
				});
				this.indexNuSync = undefined;
				this.indexMobillsSync = undefined;
			}
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

.conciliacao .selected
	border: 1px solid green

.conciliacao .conciliado
	color: green
</style>