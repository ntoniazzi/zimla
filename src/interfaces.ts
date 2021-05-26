export interface CountryData {
    name: string;
    iso: string;
    capital: string;
    // flagUnicode: string;
    flagUrl: string;
    area: number;
    population: number;
    density: number;
    water: number;
};

export interface CountryShape {
    iso: string;
    name: string;
    nameShape: SVGGraphicsElement[];
    shape: SVGGraphicsElement;
    capitalShape: SVGGraphicsElement;
    dot: SVGGraphicsElement;
    capital: string;
    // color: string;
};

export interface MapData {
    name: string;
    smallCountries: Array<string>;
    map: string;
};

export interface Player {
    name: string;
    highestScore: number;
    lastPlayed: Date;
    scores: Array<Score>;
}

export interface Score {
    date: Date;
    score: number;
}

export interface WikiCountry {
    alpha2: string;
    countryLabel: string;
    population: number;
    superficie: number;
    surface_en_eau: number;
    capitaleLabel: string;
    flag: string;
}

export interface Answer {
    iso: string;
    label: string;
    points?: number;
}
