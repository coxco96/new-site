    // mapbox access token
    mapboxgl.accessToken = "pk.eyJ1IjoiY294Y285NiIsImEiOiJja3BrY2k0ZHgwa3Y0MnZwYTl3NWs4emJ5In0.ItwJEcRmF0LwO1DkHFgpZw";


    const geoCoderControl = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        countries: 'us'
    });

    geoCoderControl.addTo('#geocoder');

    // Get the geocoder results container.
    const results = document.getElementById('result');

    // Add geocoder result to container.
    geoCoderControl.on('result', (e) => {
        let searchResult = e.result.geometry.coordinates;
        let searchName = e.result['place_name']
        getDistance(searchResult, searchName)
    });


    function getDistance(searchResult, searchName) {
        let hospitals;
        // request feature collection 
        d3.json("https://raw.githubusercontent.com/coxco96/nearest-hospital-lookup/main/data/feature-collection.json")
            .then(data => {
                hospitals = data;

                let nearest = turf.nearestPoint(searchResult, hospitals);
                let name = nearest.properties['FEATURE_NAME'];

                let from = turf.point(searchResult);
                let to = nearest.geometry.coordinates;
                let options = {
                    units: 'miles'
                };

                let distance = turf.distance(from, to, options);

                let formattedDistance = distance.toFixed(2) + ' miles';

                console.log(
                    `The closest hospital to your search location is ${name}, which is ${formattedDistance} miles away.`
                    )
                console.log(`You searched for ${searchName}`)

                results.innerHTML =
                    `Nearest hospital: <strong>${name}</strong> <br><em>${formattedDistance} miles away</em>`
            })
    }

    // Clear results container when search is cleared.
    geoCoderControl.on('clear', () => {
        results.innerText = '';
    });