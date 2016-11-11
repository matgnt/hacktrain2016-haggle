# Queries
## Index, etc
```
CREATE CONSTRAINT ON (s:Station) ASSERT s.name IS UNIQUE;
CREATE INDEX ON :CONNECTS_TO(loading);
CREATE INDEX ON :CONNECTS_TO(line);
```

## Load Stations
```
USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "file:///csv/Station_Input_Ver3.csv"
  AS section
MERGE (s:Station {name:section.From_Station, long:section.From_Station_Long, lat:section.From_Station_Lat});
```

## Load more stations from the TO field
```
USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "file:///csv/Station_Input_Ver3.csv"
  AS section
MERGE (s:Station {name:section.To_Station, long:section.To_Station_Long, lat:section.To_Station_Lat});
```

## Load connections between stations
```
USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "file:///csv/Station_Input_Ver3.csv"
  AS section
MATCH (start:Station {name:section.From_Station})
MATCH (end:Station {name:section.To_Station})
MERGE (start)-[:CONNECTS_TO {loading:toInt(section.Loading_Factor), line:section.Tube_Line, lineCode:section.Tube_Line_Code} ]-(end);
```

## Show our entire network
```
MATCH (s:Station)-[r:CONNECTS_TO]->(e:Station) RETURN s,e,r
```

## Example search 1
```
MATCH (start:Station {name:"London Bridge"})
MATCH (end:Station {name:"Liverpool Street"})
MATCH p=(start)-[:CONNECTS_TO*1..15]->(end)
RETURN p as shortestPath,
REDUCE(loadingsum=0, r in relationships(p) | loadingsum+r.loading) AS totalLoading
ORDER BY totalLoading ASC
LIMIT 1
```

## Example search 2
```
MATCH (start:Station {name:"Shepherds Bush"})
MATCH (end:Station {name:"Highbury and Islington"})
MATCH p=(start)-[:CONNECTS_TO*1..15]-(end)
RETURN p as shortestPath,
REDUCE(loadingsum=0, r in relationships(p) | loadingsum+r.loading) AS totalLoading
ORDER BY totalLoading ASC
LIMIT 1
```

## Delete everything
```
MATCH (n)
OPTIONAL MATCH (n)-[r]-()
DELETE n,r
```