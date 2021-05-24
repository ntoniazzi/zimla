import "../assets/scss/main.scss";
import MainComponent from "./MainComponent.vue";

let el = document.querySelector("main");

new MainComponent({
    el,
});

// const sha512 = async (input: string): Promise<string> => {
//     const enc = new TextEncoder();

//     let buffer = await crypto.subtle.digest('SHA-512', enc.encode(input));
//     let view = new Uint8Array(buffer);
//     let hash = view.reduce((s, c) => s + c.toString(16), "");

//     return hash;
// }

// let x = sha512("toto");
// console.log(x);

// window.sha512 = sha512;

// const countriesColors: Dictionary<number> = {
//     at: 3, // Autriche
//     be: 4, // Belgique
//     bg: 2, // Bulgarie
//     cy: 2, // Chypre
//     cz: 2, // République Tchèque
//     de: 1, // Allemagne
//     dk: 4, // Denamark
//     ee: 0, // Estonie
//     es: 1, // Espagne
//     fi: 3, // Finlande
//     fr: 0, // France
//     gr: 0, // Grèce
//     hr: 2, // Croatie
//     hu: 1, // Hongrie
//     ie: 2, // Irlande
//     it: 1, // Italie
//     lt: 2, // Lituanie
//     lu: 4, // Luxembourg
//     lv: 4, // Lettonie
//     mt: 4, // Malte
//     nl: 3, // Pays Bas
//     pl: 0, // Pologne
//     pt: 3, // Portugal
//     ro: 0, // Roumanie
//     se: 2, // Suède
//     si: 0, // Slovénie
//     sk: 4, // Slovaquie
// };

// const euCountries = [
//     "at", // Autriche
//     "be", // Belgique
//     "bg", // Bulgarie
//     "cy", // Chypre
//     "cz", // République Tchèque
//     "de", // Allemagne
//     "dk", // Denamark
//     "ee", // Estonie
//     "es", // Espagne
//     "fi", // Finlande
//     "fr", // France
//     "gr", // Grèce
//     "hr", // Croatie
//     "hu", // Hongrie
//     "ie", // Irlande
//     "it", // Italie
//     "lt", // Lituanie
//     "lu", // Luxembourg
//     "lv", // Lettonie
//     "mt", // Malte
//     "nl", // Pays Bas
//     "pl", // Pologne
//     "pt", // Portugal
//     "ro", // Roumanie
//     "se", // Suède
//     "si", // Slovénie
//     "sk", // Slovaquie
// ];

// const landColors = [
//     "#e8f2ad", // vert
//     "#fffdc0", // jaune
//     "#ffdea9", // orange
//     "#ffcccc", // rouge
//     "#ebcef2", // mauve
//     "#e8e7e7", // gris (non-eu)
// ];
// const defaultColor = "#fefee9"; // jaune
// const seeColor = "#c6ecff"; // bleu
// const nonEUColor = "#e8e7e7"; // gris
