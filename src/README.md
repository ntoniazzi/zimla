
# Sources

## Cartes

* [France](https://commons.wikimedia.org/wiki/File:European_Union,_administrative_divisions,_other_countries_and_capitals_-_fr.svg)

## Données

Les données géographiques et statistiques proviennent de Wikidata.

https://query.wikidata.org/sparql?format=json&query=

```
#sparql:
# defaultView BubbleChart
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
```

Autres liens :

* https://io.datascience-paris-saclay.fr/searchQuery.php?dataset_id=41
* https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service
* https://www.mediawiki.org/wiki/Wikidata_Query_Service/User_Manual

## Musique

La musique de fond a été empruntée au jeu Infotron sur Mac.
