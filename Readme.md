# "Haggle" project HacktrainUK 2016
The idea of this project was, to calculate the route not only based on distance or duration, but rather
also take into account the load of a train.

This would help to avoid congestions during rush hours.

By using the load of a train to calculate the price for a ticket, we go even a step further.
The inital idea was to calculate the price for each segment of the trip, based on the load of a train.
This would refelct basic supply and demand and price sensitive users would avoid the main spots during the rush hours.

It can also help the infrstructure provider, by giving incentives to users avoiding those areas and thus, would not
change the entire pricing system.

In the long run, a price per journey segment could make it possible to get a new travel experience since users
could use, e.g. car sharing to the train station, the train, a bus, a bike, until they're at their destination.
And the users wouldn't have to consider alle the different price calculations, e.g. time based, zone based, etc.

With a proper user tracking through Wifi and Smartphones negotiationg smart contracts (blockchain) with e.g. the train,
this is possible in the not so far future. But this new travel experience needs some building blocks to be available
to make it happen. And the Haggle project is one of these building blocks.

Ok, this is a bit more than what we could do on 1 weekend, but what we did is the following:

We used neo4j to import stations and connections between those. Every relationship between the nodes got a weight.
The weight was based on actual loading data of a Tram, which we got from TfL. We got it only for 1 tram, so we had
to make some assumtions about how the load would be on other trains. But in the future, more loading data will be
available.

Next step, was to use neo4j shortestpath() function and reduce() function to find the "shortest" path in terms of
the loading of a train.

Of course this is far away from finished! It's only meant to show and explain the idea. And unfortunately we didn't
win any prize with it ;-) So if you, dear reader of this, are a public transportation infrastructure provider and you
are interested to hear more about this idea, don't hesitate to contact me!

## Interested in our presentation?
Here you go: [Presentation](presentation/Hagglev2.pdf)

## Used technologies
- Neo4j
- Silverrail API (to compare routing and get fares)
- Frontend (not part of this repository): Bootstrap, jQuery.

# Links
## Routing in General
http://i11www.iti.uni-karlsruhe.de/extra/publications/p-mmrp-09.pdf

## Neo4j Routing
https://neo4j.com/blog/finding-the-shortest-path-through-the-park/

http://blog.bruggen.com/2015/11/loading-general-transport-feed-spec.html

https://www.quora.com/What-is-the-best-way-to-model-GTFS-data-in-a-graph-database-such-as-Neo4j

https://neo4j.com/blog/graph-compute-neo4j-algorithms-spark-extensions/


## Data Feeds
https://navitia.opendatasoft.com/explore/dataset/uk/table/?sort=type_file

http://transitfeeds.com/l/177-united-kingdom

## Specs
https://en.wikipedia.org/wiki/General_Transit_Feed_Specification


# Development
Use docker-compose!

The node app is not yet ready for docker-compose. start it from the outside. You have to set the docker engine IP
as an ENV variable (see exportDevEnv.sh).

I removed the data feeds, because I was not sure regarding the license. I only left the header and 1 line as an example.
The csv directory is linked into the neo4j container, which makes it easy to use the web frontent to execute the queries.

All useful queries you can find described in: [Queries](Queries.md)


