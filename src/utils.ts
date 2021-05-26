import { RNG } from "./rng";

export function genId(): string {
    const length = 6;
    let out = "";

    for (let i = 0; i < length; ++i) {
        let c = ((Math.random() * 52) | 0) + 0x41; // A
        if (c > 0x5a) {
            // between Z and a
            c += 5;
        }
        out += String.fromCharCode(c);
    }

    return out;
}

export function shuffleArray(array: Array<any>, id: string) {
    let rng = new RNG(id);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng.random(i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
