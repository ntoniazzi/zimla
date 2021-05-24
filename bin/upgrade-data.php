<?php

$baseUrl = "https://query.wikidata.org/sparql";
$format = "json";
$query = <<<EOS
SELECT DISTINCT ?alpha2 ?countryLabel ?population ?superficie ?surface_en_eau ?capitaleLabel ?flag WHERE {
  ?country wdt:P31 wd:Q3624078;
    wdt:P1082 ?population.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
  OPTIONAL { ?country wdt:P297 ?alpha2. }
  OPTIONAL { ?country wdt:P2046 ?superficie. }
  OPTIONAL { ?country wdt:P2927 ?surface_en_eau. }
  OPTIONAL { ?country wdt:P36 ?capitale. }
  FILTER(NOT EXISTS { ?country wdt:P31 wd:Q3024240. })
  OPTIONAL { ?country wdt:P41 ?flag. }
}
ORDER BY DESC (?population)
EOS;

$cache = "data.cache";
if (file_exists($cache)) {
    $results = json_decode(file_get_contents($cache), true);
} else {
    $params = [
        'format' => $format,
        'query' => $query
    ];

    $url = $baseUrl . '?query=' . str_replace('+', '%20', urlencode($query));

    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'Accept: application/sparql-results+json',
                'User-Agent: WDQS-example PHP/' . PHP_VERSION, // TODO adjust this; see https://w.wiki/CX6
            ],
        ],
    ];

    $context = stream_context_create($opts);
    $response = file_get_contents($url, false, $context);
    if (false === $response) {
        var_dump($http_response_header);

        echo "Erreur de requête\n";

        exit(1);
    }

    $data = json_decode($response, true);
    if (null === $data) {
        echo "Erreur de réponse\n";

        exit(1);
    }

    $results = [];
    $clean = function ($data) {
        $new = [];
        foreach ($data as $key => $item) {
            if (!'litteral' === $item['type']) {
                continue;
            }

            if (is_numeric($item['value'])) {
                $new[$key] = false === strpos($item['value'], '.') ? intval($item['value']) : floatval($item['value']);
            } else {
                $new[$key] = trim($item['value']);
            }
        }

        return $new;
    };

    foreach ($data['results']['bindings'] as $item) {
        $results[] = $clean($item);
    }

    file_put_contents($cache, json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}
