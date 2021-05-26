<template>
    <div class="counter-container">
        {{ value }}
        <transition name="appear">
            <div v-if="popping" ref="shadow">{{ value }}</div>
        </transition>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop, Watch } from "vue-property-decorator";
    import { CountryData } from "./interfaces";

    @Component
    export default class CounterComponent extends Vue {
        @Prop()
        public value: number;
        private shadow: HTMLDivElement;
        private popping: boolean = false;

        @Watch("value")
        onValueChange(newValue: number) {
            this.popping = true;
            setTimeout(() => {
                this.popping = false;
            }, 500);
        }
    }
</script>

<style lang="scss">
    .counter-container {
        position: relative;

        & > div {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
    .appear-enter-active {
        animation: appear 500ms;
    }

    @keyframes appear {
        0% {
            transform-origin: 50% 50%;
            transform: scale(1);
            opacity: 0.6;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
</style>
