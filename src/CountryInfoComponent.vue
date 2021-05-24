<template>
    <div>
        <p v-if="null === country">Sélectionnez un pays</p>
        <template v-if="country">
            <div class="flag">
                <img
                    v-bind:src="
                        '/build/flags/' + country.flagUrl.split('/').pop()
                    "
                />
            </div>
            <div class="well" id="info">
                <dl>
                    <dt>Nom</dt>
                    <dd>{{ country.name }}</dd>
                    <dt>Capitale</dt>
                    <dd>{{ country.capital }}</dd>
                    <dt>Population</dt>
                    <dd>
                        {{ country.population.toLocaleString("fr") }}
                        hab.
                    </dd>
                    <dt>Superficie</dt>
                    <dd>
                        {{
                            country.area.toLocaleString("fr", {
                                maximumFractionDigits: 0,
                            })
                        }}
                        km<sup>2</sup>
                    </dd>
                    <dt>Superficie en eau</dt>
                    <dd>
                        <template v-if="country.water == 0">
                            Inconnue
                        </template>
                        <template v-else>
                            {{
                                country.water.toLocaleString("fr", {
                                    maximumFractionDigits: 2,
                                    style: "unit",
                                    unit: "percent",
                                })
                            }}
                        </template>
                    </dd>
                    <dt>Densité de population</dt>
                    <dd>
                        {{
                            country.density.toLocaleString("fr", {
                                maximumFractionDigits: 2,
                            })
                        }}
                        hab/km<sup>2</sup>
                    </dd>
                </dl>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import { CountryData } from "./interfaces";

    @Component
    export default class CountryInfoComponent extends Vue {
        @Prop({
            type: Object,
            default: null,
        })
        private country?: CountryData;
    }
</script>
