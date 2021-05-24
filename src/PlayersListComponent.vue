<template>
    <div class="players">
        <div
            class="player glass-panel"
            v-for="(player, key) in players"
            v-bind:key="key"
            v-on:click="$emit('selected', player)"
        >
            <img v-bind:src="`https://robohash.org/${player.name}/set_set3`" />
            <div class="name">{{ player.name }}</div>
            <div class="last">
                {{
                    player.lastPlayed
                        ? formatDate(player.lastPlayed)
                        : "jamais joué"
                }}
            </div>
            <div class="score">
                {{ player.highestScore }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import { Player } from "./interfaces";

    @Component
    export default class PlayersListComponent extends Vue {
        @Prop()
        private players: Array<Player>;

        private formatDate(date: Date) {
            return date.toLocaleString("fr", {
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            });
        }
    }
</script>
