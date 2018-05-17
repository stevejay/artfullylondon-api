# Indexes

* talent-full
* talent-auto
* venue-full
* venue-auto
* event-series-full
* event-series-auto
* event-full
* combined-event-auto

# event-full Search Index

```
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
            "filter": {
                "english_stop": {
                    "type":       "stop",
                    "stopwords":  "_english_"
                },
                "english_stemmer": {
                    "type":       "stemmer",
                    "language":   "english"
                },
                "english_possessive_stemmer": {
                    "type":       "stemmer",
                    "language":   "possessive_english"
                },
                "asciifolding_custom": {
                    "type" : "asciifolding",
                    "preserve_original" : true
                }
            },
            "analyzer": {
                "english_custom": {
                    "tokenizer":  "standard",
                    "filter": [
                        "asciifolding_custom",
                        "english_possessive_stemmer",
                        "lowercase",
                        "english_stop",
                        "english_stemmer"
                    ]
                }
            }
        }
    },
    "mappings": {
        "default": {
            "_all": {
                "enabled": false
            },
            "properties": {
                "entityType": {
                    "type": "keyword",
                    "index": false
                },
                "id": {
                    "type": "keyword",
                    "index": false
                },
                "status": {
                    "type": "keyword",
                    "index": true
                },
                "name": {
                    "type": "text",
                    "index": true,
                    "analyzer": "english_custom",
                    "fields": {
                        "fuzzy": {
                        	"type": "text",
                        	"index": true,
                        	"analyzer": "standard"
                        }
                    }
                },
                "name_sort": {
                    "type": "keyword",
                    "index": true
                },
                "venueId": {
                    "type": "keyword",
                    "index": true
                },
                "venueName": {
                    "type": "text",
                    "index": true,
                    "analyzer": "english_custom",
                    "fields": {
                        "fuzzy": {
                        	"type": "text",
                        	"index": true,
                        	"analyzer": "standard"
                        }
                    }
                },
                "venueName_sort": {
                    "type": "keyword",
                    "index": true
                },
                "area": {
                    "type": "keyword",
                    "index": true
                },
                "postcode": {
                    "type": "text",
                    "index": false
                },
                "eventSeriesId": {
                    "type": "keyword",
                    "index": true
                },
                "eventType": {
                    "type": "keyword",
                    "index": true
                },
                "occurrenceType": {
                    "type": "keyword",
                    "index": true
                },
                "costType": {
                    "type": "keyword",
                    "index": true
                },
                "costFrom": {
                    "type": "float",
                    "index": false
                },
                "bookingType": {
                    "type": "keyword",
                    "index": true
                },
                "dateFrom": {
                    "type": "date",
                    "format": "yyyy/MM/dd",
                    "index": true
                },
                "dateTo": {
                    "type": "date",
                    "format": "yyyy/MM/dd",
                    "index": true
                },
                "summary": {
                    "type": "text",
                    "index": true,
                    "analyzer": "english_custom",
                    "fields": {
                        "fuzzy": {
                        	"type": "text",
                        	"index": true,
                        	"analyzer": "standard"
                        }
                    }
                },
                "rating": {
                    "type": "short",
                    "index": false
                },
                "minAge": {
                    "type": "short",
                    "index": true
                },
                "maxAge": {
                    "type": "short",
                    "index": true
                },
                "talents": {
                    "type": "keyword",
                    "index": true
                },
                "image": {
                    "type": "text",
                    "index": false
                },
                "imageCopyright": {
                    "type": "text",
                    "index": false
                },
                "imageRatio": {
                    "type": "float",
                    "index": false
                },
                "imageColor": {
                    "type": "text",
                    "index": false
                },
                "latitude": {
                    "type": "float",
                    "index": false
                },
                "longitude": {
                    "type": "float",
                    "index": false
                },
                "locationOptimized": {
                    "type": "geo_point"
                },
                "artsType": {
                    "type": "keyword",
                    "index": true
                },
                "tags": {
                    "type": "keyword",
                    "index": true
                },
                "dates": {
                    "type": "nested",
                    "properties": {
                        "date": {
                            "type": "date",
                            "format": "yyyy/MM/dd",
                            "index": true
                        },
                        "from": {
                            "type": "keyword",
                            "index": true
                        },
                        "to": {
                            "type": "keyword",
                            "index": true
                        },
                        "tags": {
                            "type": "keyword",
                            "index": true
                        }
                    }
                },
                "externalEventId": {
                    "type": "keyword",
                    "index": true
                },
                "version": {
                    "type": "short",
                    "index": false
                }
            }
        }
    }
}
```

# combined-event-auto Search Index

```
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "default": {
            "_all": {
                "enabled": false
            },
            "properties": {
                "nameSuggest": {
                    "type": "completion",
                    "analyzer": "simple",
                    "search_analyzer": "simple"
                },
                "output": {
                    "type": "text",
                    "index": false
                },
                "entityType": {
                    "type": "keyword",
                    "index": false
                },
                "eventType": {
                    "type": "keyword",
                    "index": false
                },
                "id": {
                    "type": "keyword",
                    "index": false
                },
                "status": {
                    "type": "keyword",
                    "index": false
                },
                "version": {
                    "type": "short",
                    "index": false
                }
            }
        }
    }
}
```

# event-series-full Search Index

```
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
            "filter": {
                "english_stop": {
                    "type":       "stop",
                    "stopwords":  "_english_"
                },
                "english_stemmer": {
                    "type":       "stemmer",
                    "language":   "english"
                },
                "english_possessive_stemmer": {
                    "type":       "stemmer",
                    "language":   "possessive_english"
                },
                "asciifolding_custom": {
                    "type" : "asciifolding",
                    "preserve_original" : true
                }
            },
            "analyzer": {
                "english_custom": {
                    "tokenizer":  "standard",
                    "filter": [
                        "asciifolding_custom",
                        "english_possessive_stemmer",
                        "lowercase",
                        "english_stop",
                        "english_stemmer"
                    ]
                }
            }
        }
    },
    "mappings": {
        "default": {
            "_all": {
                "enabled": false
            },
            "properties": {
                "entityType": {
                    "type": "keyword",
                    "index": false
                },
                "id": {
                    "type": "keyword",
                    "index": false
                },
                "status": {
                    "type": "keyword",
                    "index": true
                },
                "name": {
                    "type": "text",
                    "index": true,
                    "analyzer": "english_custom",
                    "fields": {
                        "fuzzy": {
                        	"type": "text",
                        	"index": true,
                        	"analyzer": "standard"
                        }
                    }
                },
                "name_sort": {
                    "type": "keyword",
                    "index": true
                },
                "eventSeriesType": {
                    "type": "keyword",
                    "index": true
                },
                "occurrence": {
                    "type": "text",
                    "index": false
                },
                "summary": {
                    "type": "text",
                    "index": false
                },
                "image": {
                    "type": "text",
                    "index": false
                },
                "imageCopyright": {
                    "type": "text",
                    "index": false
                },
                "imageRatio": {
                    "type": "float",
                    "index": false
                },
                "imageColor": {
                    "type": "text",
                    "index": false
                },
                "version": {
                    "type": "short",
                    "index": false
                }
            }
        }
    }
}
```

# event-series-auto Search Index

```
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "default": {
            "_all": {
                "enabled": false
            },
            "properties": {
                "nameSuggest": {
                    "type": "completion",
                    "analyzer": "simple",
                    "search_analyzer": "simple"
                },
                "output": {
                    "type": "text",
                    "index": false
                },
                "entityType": {
                    "type": "keyword",
                    "index": false
                },
                "id": {
                    "type": "keyword",
                    "index": false
                },
                "status": {
                    "type": "keyword",
                    "index": false
                },
                "version": {
                    "type": "short",
                    "index": false
                }
            }
        }
    }
}
```

# venue-full Search Index

```
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
            "filter": {
                "english_stop": {
                    "type":       "stop",
                    "stopwords":  "_english_"
                },
                "english_stemmer": {
                    "type":       "stemmer",
                    "language":   "english"
                },
                "english_possessive_stemmer": {
                    "type":       "stemmer",
                    "language":   "possessive_english"
                },
                "asciifolding_custom": {
                    "type" : "asciifolding",
                    "preserve_original" : true
                }
            },
            "analyzer": {
                "english_custom": {
                    "tokenizer":  "standard",
                    "filter": [
                        "asciifolding_custom",
                        "english_possessive_stemmer",
                        "lowercase",
                        "english_stop",
                        "english_stemmer"
                    ]
                }
            }
        }
    },
    "mappings": {
        "default": {
            "_all": {
                "enabled": false
            },
            "properties": {
                "entityType": {
                    "type": "keyword",
                    "index": false
                },
                "id": {
                    "type": "keyword",
                    "index": false
                },
                "status": {
                    "type": "keyword",
                    "index": true
                },
                "name": {
                    "type": "text",
                    "index": true,
                    "analyzer": "english_custom",
                    "fields": {
                        "fuzzy": {
                        	"type": "text",
                        	"index": true,
                        	"analyzer": "standard"
                        }
                    }
                },
                "name_sort": {
                    "type": "keyword",
                    "index": true
                },
                "venueType": {
                    "type": "keyword",
                    "index": true
                },
                "address": {
                    "type": "text",
                    "index": false
                },
                "postcode": {
                    "type": "text",
                    "index": false
                },
                "latitude": {
                    "type": "float",
                    "index": false
                },
                "longitude": {
                    "type": "float",
                    "index": false
                },
                "locationOptimized": {
                    "type": "geo_point"
                },
                "image": {
                    "type": "text",
                    "index": false
                },
                "imageCopyright": {
                    "type": "text",
                    "index": false
                },
                "imageRatio": {
                    "type": "float",
                    "index": false
                },
                "imageColor": {
                    "type": "text",
                    "index": false
                },
                "version": {
                    "type": "short",
                    "index": false
                }
            }
        }
    }
}
```

# venue-auto Search Index

```
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "default": {
            "_all": {
                "enabled": false
            },
            "properties": {
                "nameSuggest": {
                    "type": "completion",
                    "analyzer": "simple",
                    "search_analyzer": "simple"
                },
                "output": {
                    "type": "text",
                    "index": false
                },
                "entityType": {
                    "type": "keyword",
                    "index": false
                },
                "id": {
                    "type": "keyword",
                    "index": false
                },
                "status": {
                    "type": "keyword",
                    "index": false
                },
                "version": {
                    "type": "short",
                    "index": false
                },
                "venueType": {
                    "type": "keyword",
                    "index": false
                },
                "address": {
                    "type": "text",
                    "index": false
                },
                "postcode": {
                    "type": "text",
                    "index": false
                }
            }
        }
    }
}
```

# talent-full Search Index

```
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
            "filter": {
                "english_stop": {
                    "type":       "stop",
                    "stopwords":  "_english_"
                },
                "english_stemmer": {
                    "type":       "stemmer",
                    "language":   "english"
                },
                "english_possessive_stemmer": {
                    "type":       "stemmer",
                    "language":   "possessive_english"
                },
                "asciifolding_custom": {
                    "type" : "asciifolding",
                    "preserve_original" : true
                }
            },
            "analyzer": {
                "english_custom": {
                    "tokenizer":  "standard",
                    "filter": [
                        "asciifolding_custom",
                        "english_possessive_stemmer",
                        "lowercase",
                        "english_stop",
                        "english_stemmer"
                    ]
                }
            }
        }
    },
    "mappings": {
        "default": {
            "_all": {
                "enabled": false
            },
            "properties": {
                "entityType": {
                    "type": "keyword",
                    "index": false
                },
                "id": {
                    "type": "keyword",
                    "index": false
                },
                "status": {
                    "type": "keyword",
                    "index": true
                },
                "firstNames": {
                    "type": "text",
                    "index": true,
                    "analyzer": "english_custom",
                    "fields": {
                        "sort": {
                            "type": "keyword",
                            "index": true
                        },
                        "fuzzy": {
                        	"type": "text",
                        	"index": true,
                        	"analyzer": "standard",
                        	"term_vector": "yes"
                        }
                    }
                },
                "lastName": {
                    "type": "text",
                    "index": true,
                    "analyzer": "english_custom",
                    "fields": {
                        "fuzzy": {
                        	"type": "text",
                        	"index": true,
                        	"analyzer": "standard",
                        	"term_vector": "yes"
                        }
                    }
                },
                "lastName_sort": {
                	"type": "keyword",
                    "index": true
                },
                "talentType": {
                    "type": "keyword",
                    "index": true
                },
                "commonRole": {
                    "type": "keyword",
                    "index": true
                },
                "image": {
                    "type": "text",
                    "index": false
                },
                "imageCopyright": {
                    "type": "text",
                    "index": false
                },
                "imageRatio": {
                    "type": "float",
                    "index": false
                },
                "imageColor": {
                    "type": "text",
                    "index": false
                },
                "version": {
                    "type": "short",
                    "index": false
                }
            }
        }
    }
}
```

# talent-auto Search Index

```
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "default": {
            "_all": {
                "enabled": false
            },
            "properties": {
                "nameSuggest": {
                    "type": "completion",
                    "analyzer": "simple",
                    "search_analyzer": "simple"
                },
                "output": {
                    "type": "text",
                    "index": false
                },
                "entityType": {
                    "type": "keyword",
                    "index": false
                },
                "id": {
                    "type": "keyword",
                    "index": false
                },
                "status": {
                    "type": "keyword",
                    "index": false
                },
                "version": {
                    "type": "short",
                    "index": false
                },
                "talentType": {
                    "type": "keyword",
                    "index": false
                },
                "commonRole": {
                    "type": "text",
                    "index": false
                }
            }
        }
    }
}
```
