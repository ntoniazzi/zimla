import { Dictionary } from "./Dictionary";
// Regional Indicator Symbol Letter
const risl: Dictionary<string> = {
    a: "\u{1F1E6}",
    b: "\u{1F1E7}",
    c: "\u{1F1E8}",
    d: "\u{1F1E9}",
    e: "\u{1F1EA}",
    f: "\u{1F1EB}",
    g: "\u{1F1EC}",
    h: "\u{1F1ED}",
    i: "\u{1F1EE}",
    j: "\u{1F1EF}",
    k: "\u{1F1F0}",
    l: "\u{1F1F1}",
    m: "\u{1F1F2}",
    n: "\u{1F1F3}",
    o: "\u{1F1F4}",
    p: "\u{1F1F5}",
    q: "\u{1F1F6}",
    r: "\u{1F1F7}",
    s: "\u{1F1F8}",
    t: "\u{1F1F9}",
    u: "\u{1F1FA}",
    v: "\u{1F1FB}",
    w: "\u{1F1FC}",
    x: "\u{1F1FD}",
    y: "\u{1F1FE}",
    z: "\u{1F1FF}",
};

const getFlag = function (iso: string): string {
    return risl[iso[0]] + risl[iso[1]];
};

export default { getFlag };
