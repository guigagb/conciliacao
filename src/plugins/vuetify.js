import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#ab0a89",
                secondary: "#2b1292"
            },
        },
    },
})

export default vuetify
