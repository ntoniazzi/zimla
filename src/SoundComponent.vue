<template>
    <div>
        <div>
            <span>Musique</span>
            <input type="checkbox" v-model="options.music" />
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                v-model.number="options.musicVolume"
            />
            <span>{{ Math.round(options.musicVolume * 100) }}</span>
        </div>
        <div>
            <span>Sons</span>
            <input type="checkbox" v-model="options.sound" />
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                v-model.number="options.soundVolume"
                v-on:input="trySound"
            />
            <span>{{ Math.round(options.soundVolume * 100) }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { Howl, HowlOptions } from "howler";
    import Vue from "vue";
    import { Component, Watch } from "vue-property-decorator";
    import soundConfig from ".webpack[javascript/auto]!=!../howler-loader.js!../assets/sounds/output.json";


    const STORAGE_KEY = 'sound-settings';

    class MusicOptions {
        musicVolume: number = 1.0;
        soundVolume: number = 1.0;
        sound: boolean = true;
        music: boolean = true;

        unserialize(serialized: string): void {
            let data = JSON.parse(serialized);

            this.musicVolume = parseFloat(data[0]);
            this.soundVolume = parseFloat(data[1]);
            this.music = data[2];
            this.sound = data[3];
        }

        serialize(): string {
            return JSON.stringify([
                this.musicVolume,
                this.soundVolume,
                this.music,
                this.sound,
            ]);
        }
    }

    @Component({})
    export default class SoundComponent extends Vue {
        private sound: Howl = null;
        private musicIntroId: number = 0;
        private musicLoopId: number = 0;
        private soundId: number = 0;
        private saveDelayed: () => void;

        private options: MusicOptions = null;

        @Watch("options", { deep: true })
        onOptionChanged() {
            if (!this.options.music) {
                this.sound.stop(this.musicIntroId);
                this.sound.stop(this.musicLoopId);

                this.musicLoopId = 0;
                this.musicIntroId = 0;
            } else {
                if (
                    !this.sound.playing(this.musicIntroId) &&
                    !this.sound.playing(this.musicLoopId)
                ) {
                    this.playIntro();
                }
            }

            this.sound.volume(this.options.musicVolume, this.musicIntroId);
            this.sound.volume(this.options.musicVolume, this.musicLoopId);

            this.saveDelayed();
        }

        private save() {
            localStorage.setItem(STORAGE_KEY, this.options.serialize());
        }

        private trySound() {
            this.play('right');
        }

        private created() {
            let options = new MusicOptions();
            let saved = localStorage.getItem(STORAGE_KEY);
            if (null !== saved) {
                options.unserialize(saved);
            }
            this.options = options;

            let saveTimeout: NodeJS.Timeout;
            this.saveDelayed = () => {
                if (saveTimeout) {
                    clearTimeout(saveTimeout);
                }

                saveTimeout = setTimeout(this.save, 500);
            }

            this.sound = new Howl(<any>soundConfig);
            this.sound.on("end", (id) => {
                if (id === this.musicIntroId) {
                    this.musicLoopId = this.sound.play("music-loop");
                    this.sound.volume(this.options.musicVolume, this.musicLoopId);
                }
            });
            this.sound.once("load", () => {
                this.playIntro();
            });
        }

        private playIntro()
        {
            if (!this.options.music) {
                return;
            }

            if (this.musicIntroId > 0 || this.musicLoopId > 0) {
                console.log("already playing");
                return;
            }

            this.musicIntroId = this.sound.play("music-intro");
            this.sound.volume(this.options.musicVolume, this.musicIntroId);
        }

        public playRight() {
            if (!this.options.sound) {
                return;
            }

            this.play('right');
        }

        public playWrong() {
            if (!this.options.sound) {
                return;
            }

            this.play('wrong');
        }

        public playDie() {
            if (!this.options.sound) {
                return;
            }

            this.play('die');
        }

        private play(sprite: string) {
            let id = this.sound.play(sprite);
            this.sound.volume(this.options.soundVolume, id);
        }
    }
</script>
