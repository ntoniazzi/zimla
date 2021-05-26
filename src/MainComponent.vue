<template>
    <main>
        <header class="metal-panel">
            <button v-if="state !== 0" v-on:click="state = 0, currentPlayer = null">
                <div class="label">Retour</div>
                <div class="icon">👈</div>
            </button>
            <button v-if="state === 0" v-on:click="discover">
                <div class="label">Découverte</div>
                <div class="icon">🌍</div>
            </button>

            <button v-on:click="showOptions = true">
                <div class="label">Options</div>
                <div class="icon">🔧</div>
            </button>

            <div
                class="player-menu"
                v-if="currentPlayer !== null"
            >
                <div class="name">{{ currentPlayer.name }}</div>
                <img
                    v-bind:src="`https://robohash.org/${currentPlayer.name}/set_set3`"
                />
            </div>
        </header>

        <div class="cards">
            <div id="screen-1" class="card" v-if="state === 0">
                <div class="metal-panel corner red new-player">
                    <div class="label">Nouveau joueur</div>

                    <div class="well has-input">
                        <input v-model="playerName" autofocus v-on:keyup.enter="createPlayer" />
                    </div>

                    <button v-on:click="createPlayer" v-bind:disabled="playerName.length === 0">Créer</button>
                </div>

                <players-list v-bind:players="players" v-on:selected="selectPlayer"></players-list>
            </div>

            <div class="card" v-if="state === 2" id="screen-options">
                <div class="metal-panel blue corner">
                    <div class="label">Options</div>

                    <fieldset>
                        <legend>Carte</legend>
                        <select disabled>
                            <option selected>Europe</option>
                        </select>
                    </fieldset>

                    <fieldset>
                        <legend>Questions</legend>
                        <label>
                            <input
                                type="radio"
                                v-model="num"
                                value="10"
                            />
                            10 questions
                        </label>
                        <label>
                            <input
                                type="radio"
                                v-model="num"
                                value="20"
                            />
                            20 questions
                        </label>
                        <label>
                            <input
                                type="radio"
                                v-model="num"
                                value="30"
                            />
                            30 questions
                        </label>
                        <label>
                            <input
                                type="radio"
                                v-model="num"
                                value="0"
                            />
                            Défi
                        </label>
                    </fieldset>


                    <fieldset>
                        <legend>Jeu</legend>

                        <label>
                            <input type="radio" v-model="mode" value="name" />
                            Pays
                        </label>
                        <label>
                            <input type="radio" v-model="mode" value="capitale" />
                            Capitales
                        </label>
                        <label>
                            <input type="radio" v-model="mode" value="flag" />
                            Drapeaux
                        </label>
                    </fieldset>

                    <button
                        v-on:click="start"
                        v-bind:disabled="current !== null"
                    >
                        Jouer!
                    </button>
                </div>
            </div>

            <div class="card" id="screen-play" v-show="state === 1 || state === 3">
                <map-component
                    v-show="state === 1 || state === 3"
                    ref="map"
                    v-on:country-select="countrySelectHandler"
                    v-on:loaded="onMapLoaded"
                    v-bind:mapData="currentMap"
                ></map-component>

                <!-- <div class="panels"> -->
                    <div
                        class="metal-panel green corner"
                        v-if="state === 1"
                    >
                        <div class="label">Informations</div>

                        <country-info
                            v-bind:country="selectedCountry"
                        ></country-info>
                    </div>

                    <div
                        class="metal-panel blue corner"
                        v-if="
                            'info' !== mode && null !== current && state === 3
                        "
                    >
                        <div class="label">Question</div>
                        <div>
                            <span v-if="mode === 'name'">
                                Où se trouve ce pays
                            </span>
                            <span v-else-if="mode === 'capitale'">
                                Où se trouve cette capitale?
                            </span>
                            <span v-else-if="mode === 'flag'">
                                À quel pays appartient ce drapeau?
                            </span>
                            <div class="question">
                                <template v-if="mode === 'name'">
                                    {{ countries[gameIsoList[current]].name }}
                                </template>
                                <template v-else-if="mode === 'capitale'">
                                    {{
                                        countries[gameIsoList[current]].capital
                                    }}
                                </template>
                                <template v-else-if="mode === 'flag'">
                                    <img
                                        v-bind:src="'/build/flags/' + countries[gameIsoList[current]].flagUrl.split('/').pop()"
                                        style="max-width:16rem"
                                    />
                                </template>
                            </div>
                        </div>
                    </div>

                    <div
                        class="metal-panel yellow corner"
                        v-if="mode !== 'info' && state === 3"
                    >
                        <div class="label">Résultats</div>
                        <vue-counter
                            class="top-right-counter"
                            v-bind:value="currentScore"
                            v-bind:duration="1000"
                        ></vue-counter>
                        <div v-if="max">
                            <span
                                class="game"
                                v-for="(i, k) in max"
                                v-bind:key="k"
                                v-bind:class="{
                                    failure:
                                        answers[k] && answers[k].points === 0,
                                    success:
                                        answers[k] && answers[k].points > 0,
                                }"
                            ></span>
                        </div>
                    </div>
                <!-- </div> -->
            </div>

            <div class="card" v-if="state === 4" id="screen-score">
                <div class="glass-panel">
                    <div class="head">
                        Résultats
                        <div>{{ currentScore }}</div>
                    </div>
                    <div
                        v-for="answer in answers"
                        v-bind:key="answer.iso"
                        class="game"
                        v-bind:class="{
                            failure: answer.points === 0,
                            success: answer.points > 0,
                        }"
                    >
                        <span class="label">{{ answer.label }}</span>
                        <span class="score">{{ answer.points }}</span>
                    </div>

                    <div class="foot">
                        <button v-on:click="reset()">Retour</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-background" v-show="showOptions">
            <div class="modal glass-panel" v-show="showOptions">
                <sound-component ref="sound" class="music"></sound-component>

                <button v-on:click="showOptions = false">Fermer</button>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import dataUrl from "!!file-loader!../data/countries.data";
    import extraDataUrl from "!!file-loader!../data/extra.data";
    import mapsUrl from "!!file-loader!../maps/maps.data";
    import MapComponent from "./MapComponent.vue";
    import RISL from "./RISL";
    import { Dictionary } from "./Dictionary";
    import CountryInfoComponent from "./CountryInfoComponent.vue";
    import { Answer, CountryData, MapData, Player, WikiCountry } from './interfaces';
    import CounterComponent from "./CounterComponent.vue";
    import SoundComponent from './SoundComponent.vue';
    import PlayersListComponent from "./PlayersListComponent.vue";
    import { genId, shuffleArray } from './utils';

    enum Mode {
        INFO = "info",
        CAPITALE = "capitale",
        NAME = "name",
        FLAG = "flag",
    }

    enum State {
        NAME = 0,
        DISCOVER,
        OPTIONS,
        PLAY,
        RESULTS,
    }

    @Component({
        components: {
            "map-component": MapComponent,
            "country-info": CountryInfoComponent,
            "vue-counter": CounterComponent,
            "sound-component": SoundComponent,
            "players-list": PlayersListComponent,
        },
    })
    export default class MainComponent extends Vue {
        private map: MapComponent = null;

        public mode = Mode.NAME;

        private countries: Dictionary<CountryData> = {};
        private countryData: Dictionary<WikiCountry> = {};
        private selectedCountry: CountryData = null;
        private mapLoaded = false;
        private dataLoaded = false;
        private num: number = 10;
        private mapsData: Array<MapData>;
        private currentMap: MapData = null;

        private answers: Array<Answer> = [];
        private gameId: string = "";

        private max: number = 0;
        private gameIsoList: Array<string> = [];
        private current?: number = null;
        private startTime: number = 0;

        private playerName: string = "";
        private currentPlayer: Player = null;

        private state: State = State.NAME;

        private players: Array<Player> = [];

        private sound: SoundComponent = null;
        private showOptions = false;

        private created() {
            let players: Array<Player> = JSON.parse(
                localStorage.getItem("scores")
            );
            if (null === players) {
                players = [];
            }
            players.forEach((player) => {
                if (null !== player.lastPlayed) {
                    player.lastPlayed = new Date(player.lastPlayed);
                }

                player.scores.forEach((score) => {
                    score.date = new Date(score.date);
                });
            });

            this.players = players;

            let mapsPromise = fetch(mapsUrl)
                .then((response) => {
                    return response.json();
                })
                .then((mapsData: Array<MapData>) => {
                    this.mapsData = mapsData;

                    this.currentMap = this.mapsData[0];
                });
            let dataPromise = fetch(dataUrl).then((response) => {
                return response.json();
            });
            let extraDataPromise = fetch(extraDataUrl).then((response) => {
                return response.json();
            });
            Promise.all([dataPromise, extraDataPromise]).then(
                ([data, extraData]) => {
                    let dataMap: Dictionary<WikiCountry> = {};
                    data.forEach((item: WikiCountry) => {
                        if (undefined === item["alpha2"]) {
                            return;
                        }

                        dataMap[item.alpha2.toLowerCase()] = item;
                    });

                    let extraMap: Dictionary<WikiCountry> = {};
                    extraData.forEach((item: WikiCountry) => {
                        if (undefined === item["alpha2"]) {
                            return;
                        }

                        extraMap[item.alpha2.toLowerCase()] = item;
                    });

                    this.countryData = {
                        ...dataMap,
                        ...extraMap,
                    };

                    this.dataLoaded = true;
                    if (this.mapLoaded) {
                        this.initCountries();
                    }
                }
            );
        }

        private mounted() {
            this.sound = <SoundComponent> this.$refs['sound'];
        }

        private discover() {
            this.map.reset();
            this.state = State.DISCOVER;
        }

        private selectPlayer(player: Player) {
            this.currentPlayer = player;
            this.state = State.OPTIONS;
        }

        private createPlayer() {
            let name = this.playerName.trim();
            if ("" === name) {
                return;
            }

            let player: Player = {
                name: name,
                highestScore: 0,
                lastPlayed: null,
                scores: [],
            };

            let num = this.players.push(player);
            this.currentPlayer = player;
            this.state = State.OPTIONS;
        }

        private updatePlayer() {
            let player = this.currentPlayer;
            player.scores.push({
                date: new Date(),
                score: this.currentScore,
            });
            player.lastPlayed = new Date();
            player.highestScore = player.scores.reduce(
                (max, current) => Math.max(max, current.score),
                0
            );

            localStorage.setItem("scores", JSON.stringify(this.players));
        }

        public get total(): number {
            return this.answers.length;
        }

        public get currentScore(): number {
            return this.answers.reduce((prev, game) => {
                return prev + game.points;
            }, 0);
        }

        public start(): void {
            this.state = State.PLAY;
            this.gameId = genId();

            this.$nextTick(() => {
                shuffleArray(this.gameIsoList, this.gameId);
                this.max =
                    this.num === 0
                        ? 0
                        : Math.min(this.num, this.gameIsoList.length);

                // prepare the map
                this.map.getCountries().forEach((iso) => {
                    this.map.change(iso, false, false, false, "#fefee9");
                });

                // start the game
                this.current = 0;
                this.answers = [];
                this.startTime = Date.now();
            });
        }

        private onMapLoaded() {
            this.map = <MapComponent>this.$refs["map"];
            this.mapLoaded = true;
            this.gameIsoList = this.map.getCountries();

            if (this.dataLoaded) {
                this.initCountries();
            }
        }

        private initCountries() {
            this.gameIsoList.forEach((iso) => {
                // let flag: string = RISL.getFlag(iso);
                let data = this.countryData[iso];
                this.countries[iso] = {
                    iso: iso,
                    name: data?.countryLabel,
                    capital: data?.capitaleLabel,
                    area: data?.superficie ?? 0,
                    water: data?.surface_en_eau ?? 0,
                    population: data?.population ?? 0,
                    density:
                        data && data.superficie
                            ? data.population / data.superficie
                            : 0,
                    // flagUnicode: flag,
                    flagUrl: data?.flag,
                };
            });
        }

        private countrySelectHandler(iso: string) {
            let country = this.countries[iso];

            if (undefined === country) {
                console.error("Unknown country");

                return;
            }

            if (State.DISCOVER === this.state) {
                this.selectedCountry = country;
                // this.map.center(country.iso);

                return;
            }

            let isoAnswer = this.gameIsoList[this.current];
            let label;
            switch (this.mode) {
                case Mode.NAME:
                case Mode.FLAG:
                    label = this.countries[isoAnswer].name;
                    break;
                case Mode.CAPITALE:
                    label = this.countries[isoAnswer].capital;
                    break;
            }

            let myAnswer: Answer = {
                iso: iso,
                label: label,
                points: 0,
            };
            let endTime = Date.now();

            if (country.iso !== isoAnswer) {
                // wrong answer


                this.answers.push(myAnswer);

                if (this.max === 0) {
                    // mode défi
                    this.sound.playDie();
                    this.endGame();

                    return;
                }

                this.sound.playWrong();

                // wrong guess (red)
                this.map.change(country.iso, true, true, true, "#ffcccc");

                // right country (orange)
                this.map.change(isoAnswer, true, true, true, "#ffdea9");

                // this.map.center(isoAnswer);
            } else {
                this.sound.playRight();
                // good guess (green)
                /**
                 * 100pts min, and bonus if faster (<= 2s: 100 → 12s
                 *
                 * 100 +--------------o
                 *     |           o  |
                 *     |        o     |
                 *     |     o        |
                 *   0 +--o--+--+--+--+--+--+--+
                 *     o
                 *     0  2  4  6  8  10
                 */

                let delay = Math.round((endTime - this.startTime) / 1000);

                myAnswer.points =
                    200 - Math.min(100, Math.round(delay * 12.5 - 25));

                this.answers.push(myAnswer);

                this.map.change(country.iso, true, true, true, "#e8f2ad");
                // this.map.center(isoAnswer);

                if (this.max === 0) {
                    if (this.answers.length >= this.gameIsoList.length) {
                        this.endGame();

                        return;
                    }

                    this.selectNext();

                    return;
                }
            }

            if (this.answers.length >= this.max) {
                // end of game
                this.endGame();

                return;
            }

            this.selectNext();
        }

        private selectNext() {
            let nextIso: string;

            // skip already shown countries
            do {
                ++this.current;
                nextIso = this.gameIsoList[this.current];
            } while (
                0 <= this.answers.findIndex((score) => score.iso === nextIso)
            );

            this.startTime = Date.now();
        }

        private endGame() {
            this.current = null;
            this.state = State.RESULTS;
            this.map.reset();
            this.updatePlayer();
        }

        private reset(): void {
            // this.mode = Mode.INFO;
            this.state = State.OPTIONS;
            this.current = null;
        }
    }
</script>

<style lang="scss">
    // .slide-left-enter {
    //     transform: translate(-110%);
    //     opacity: 1;
    // }

    .slide-left-enter-active {
        animation: slide-left 2000ms;
    }

    .slide-left-leave-active {
        animation: slide-left 2000ms reverse;
    }

    @keyframes slide-left {
        0% {
            transform: translate(-110%);
            opacity: 1;
        }

        100% {
            transform: translate(0);
            opacity: 1;
        }
    }

    // .slide-right-enter {
    //     transform: translate(110%);
    //     opacity: 0;
    // }

    .slide-right-enter-active {
        animation: slide-right 2000ms;
    }

    .slide-right-leave-active {
        animation: slide-right 2000ms reverse;
    }

    @keyframes slide-right {
        0% {
            transform: translate(110%);
            opacity: 1;
        }

        100% {
            transform: translate(0);
            opacity: 1;
        }
    }
</style>
