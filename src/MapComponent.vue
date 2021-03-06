<template>
    <div id="map-box" class="metal-panel red corner">
        <div class="label">Carte</div>
        <div style="height: 100%">
            <div
                id="map"
                ref="map"
                v-if="map"
                v-html="map"
                v-on:click="clickHandler"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop, Watch } from "vue-property-decorator";
    import { Dictionary } from "./Dictionary";
    import { CountryShape, MapData } from "./interfaces";
    import Panzoom, { PanzoomObject } from "@panzoom/panzoom";

    @Component
    export default class MapComponent extends Vue {
        @Prop()
        public mapData: MapData;

        private scale = 1.0;
        private startWidth = 0;
        private map: string = "";
        private svg: SVGElement = null;
        private items: Dictionary<CountryShape> = {};
        private container: HTMLDivElement = null;
        // private dragOrigin = { x: 0, y: 0 };
        // private scrollOrigin = { left: 0, top: 0 };
        // private dragged = false;
        private inited = false;
        public pan: PanzoomObject = null;
        private panned = false;

        created() {
            console.log("map component created");
            this.onMapChange(this.mapData);
        }

        @Watch("mapData")
        private onMapChange(newMap: MapData) {
            console.log("Map Changed");
            if (null == newMap) {
                return;
            }

            this.inited = false;
            fetch(newMap.map)
                .then((response) => {
                    return response.text();
                })
                .then((data) => {
                    this.map = data;
                    this.$nextTick(() => {
                        this.container = <HTMLDivElement>this.$refs["map"];
                        this.svg = <SVGElement>this.container.firstElementChild;

                        this.pan = Panzoom(<SVGElement>this.svg, {
                            maxScale: 1.7,
                            minScale: 0.4,
                            canvas: true,
                            // contain: 'outside',
                            // animate: false,
                        });
                        this.svg.parentElement.addEventListener(
                            "wheel",
                            this.pan.zoomWithWheel
                        );

                        this.svg.addEventListener("panzoomstart", () => {
                            this.panned = false;
                        });
                        this.svg.addEventListener("panzoompan", () => {
                            this.panned = true;
                        });
                        this.init();
                    });
                });
        }

        public center(iso: string): void {
            let country = this.items[iso];
            if (undefined === country) {
                return;
            }

            let bb: SVGRect = country.shape.getBBox();
            let centerX = this.scale * (bb.x + bb.width / 2);
            let centerY = this.scale * (bb.y + bb.height / 2);

            let offsetX = centerX - this.container.clientWidth / 2;
            let offsetY = centerY - this.container.clientHeight / 2;

            this.container.scrollTo({
                left: Math.max(0, offsetX),
                top: Math.max(0, offsetY),
                behavior: "smooth",
            });
        }

        public colorize(iso: string, color: string) {
            let country = this.items[iso];
            if (undefined === country) {
                return;
            }

            country.shape.style.fill = color;
        }

        public showDot(iso: string) {
            let country = this.items[iso];
            if (undefined === country) {
                return;
            }

            if (country.dot) {
                country.dot.style.display = "block";
            }
        }

        public showCapital(iso: string) {
            let item = this.items[iso];
            if (undefined === item) {
                return;
            }

            item.capitalShape.style.display = "block";
        }

        public change(
            iso: string,
            country: boolean,
            capital: boolean,
            dot: boolean,
            color?: string
        ) {
            let item = this.items[iso];
            if (undefined === item) {
                return;
            }

            item.nameShape.forEach(
                (shape) => (shape.style.display = country ? "block" : "none")
            );
            if (item.capitalShape) {
                item.capitalShape.style.display = capital ? "block" : "none";
            } else {
                console.warn("No capital for %o", item);
            }

            if (item.dot) {
                item.dot.style.display = dot ? "block" : "none";
            } else {
                console.warn("No dot for %o", item);
            }

            if (color) {
                item.shape.style.fill = color;
            }
        }

        public showCountry(iso: string) {
            let item = this.items[iso];
            if (undefined === item) {
                return;
            }

            item.nameShape.forEach((shape) => (shape.style.display = "block"));
        }

        public hideCountries(): void {
            Object.keys(this.items).forEach((key) => {
                let item = this.items[key];
                item.nameShape.forEach((o) => (o.style.display = "none"));
            });
        }

        public hideCapitals(): void {
            Object.keys(this.items).forEach((key) => {
                let item = this.items[key];
                if (item.capitalShape) {
                    item.capitalShape.style.display = "none";
                }
            });
        }

        public hideDots(): void {
            Object.keys(this.items).forEach((key) => {
                let item = this.items[key];
                if (item.dot) {
                    item.dot.style.display = "none";
                }
            });
        }

        public showCountries(): void {
            Object.keys(this.items).forEach((key) => {
                let item = this.items[key];
                item.nameShape.forEach((o) => (o.style.display = "block"));
            });
        }

        public showCapitals(): void {
            Object.keys(this.items).forEach((key) => {
                let item = this.items[key];
                if (item.capitalShape) {
                    item.capitalShape.style.display = "block";
                }
            });
        }

        public showDots(): void {
            Object.keys(this.items).forEach((key) => {
                let item = this.items[key];
                if (item.dot) {
                    item.dot.style.display = "block";
                } else {
                    console.log("Item %o has no dot", item);
                }
            });
        }

        public getCountries(): Array<string> {
            return Object.keys(this.items);
        }

        public reset() {
            this.showCapitals();
            this.showDots();
            this.showCountries();

            // reset colors
            Object.keys(this.items).forEach((key) => {
                this.items[key].shape.style.fill = null;
            });
        }

        private init() {
            this.svg.querySelectorAll('[id^="shp-"]').forEach((shape) => {
                let iso = shape.id.substring(4);
                let cityDot: SVGGraphicsElement = this.svg.querySelector(
                    "#dot-" + iso
                );
                let cityName: SVGGraphicsElement = this.svg.querySelector(
                    "#cty-" + iso
                );
                let countryName = [].slice.call(
                    this.svg.querySelectorAll('[id^="nam-' + iso + '"]')
                );

                this.items[iso] = {
                    iso: iso,
                    name: countryName[0]?.textContent,
                    nameShape: countryName,
                    dot: cityDot,
                    shape: <SVGGraphicsElement>shape,
                    capitalShape: cityName,
                    capital: cityName?.textContent,
                    // color: landColors[colorIndex],
                };
            });

            // Observe style attribute the compute clientWidth at the right time.
            const observer = new MutationObserver((mutationList, observer) => {
                if (mutationList[0].attributeName !== "style") {
                    return;
                }

                console.log("Observer triggered", mutationList[0]);

                if (this.inited) {
                    return;
                }

                this.startWidth = this.svg.clientWidth;

                // init small countries
                this.mapData.smallCountries.forEach((iso) => {
                    console.log("init small country ", iso);
                    let item = this.items[iso];
                    let shape = item.shape;

                    let g = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "g"
                    );
                    g.setAttribute("id", shape.id);
                    shape.removeAttribute("id");
                    let circle = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );
                    let bb: SVGRect = (<SVGElement>shape).getBBox();
                    circle.setAttribute("cx", (bb.x + bb.width / 2).toFixed(4));
                    circle.setAttribute(
                        "cy",
                        (bb.y + bb.height / 2).toFixed(4)
                    );
                    circle.setAttribute("r", "12");
                    circle.style.fill = "transparent";
                    circle.classList.add("helper");

                    // bottom, to be placed above all other shapes
                    shape.parentNode.appendChild(g);
                    g.appendChild(shape);
                    g.appendChild(circle);

                    shape = g;
                });

                this.inited = true;
            });
            const observerOptions = {
                childList: false,
                attributes: true,
                subtree: false,
            };
            observer.observe(this.$el, observerOptions);

            console.log("Map loaded and initialized");
            this.$emit("loaded");
        }

        private clickHandler(event: MouseEvent | TouchEvent) {
            console.log("Map event: %s, panned=%o", event.type, this.panned);
            let target = <Element>event.target;

            if (this.panned) {
                return;
            }

            if (
                "circle" === target.nodeName &&
                target.classList.contains("helper")
            ) {
                target = target.parentElement;
            } else if ("path" !== target.nodeName) {
                // console.info(target.nodeName);

                return;
            }

            let iso: string = target.id.substring(4);
            this.$emit("country-select", iso);
        }

        private scaleMap() {
            this.svg.setAttribute(
                "width",
                (this.startWidth * this.scale).toFixed(3) + "px"
            );
        }

        private zoomIn() {
            if (this.scale >= 4) {
                return;
            }

            this.scale += 0.125;

            this.scaleMap();
        }

        private zoomOut() {
            if (this.scale <= 0.125) {
                return;
            }

            this.scale -= 0.125;

            this.scaleMap();
        }

        private zoomReset() {
            this.scale = 1.0;

            this.scaleMap();
        }
    }
</script>
