# House Finder

Web application for finding neighbourhoods that suit your preferences. Choose and rank services you want near your neighbourhood like schools, grocery stores, and zoos to see the top ten neighbourhoods that match your preferences. Try out my project [here](https://master.dvkzgxknbigt2.amplifyapp.com/)

## Built With

- React
- Python Flask
- SciPy, GeoPy, Shapely
- Mapbox GL
- Semantic UI
- SQLite

## How it Works

Every neighbourhood is defined by a series of coordinates that create a shape. Using a KD-tree from the SciPy library, the distance is calculated from each service (school, church, etc) to the coordinate in the neighbourhood that results in the minimum distance. This distance is then saved in a database for faster querying.

When the user gets the list of best neighbourhoods, the list and rank of their preferences is used to query for distances between those services and all neighbourhoods. The total distance is summed up and put through calculations to sort the top ten neighbourhoods and return them.
