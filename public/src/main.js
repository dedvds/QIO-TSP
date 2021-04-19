
//Global vars
let map, searchManager, directionsManager, directionsManager2, apiPassword

//This holds all the locatiosn that we want to visit, pre loaded with some location
let cities = { "Amsterdam, Netherlands": { name: "Amsterdam, Netherlands", coordinates: { lat: 52.370216, lon: 4.895168 }, selected: true }, "Maastricht, Netherlands": { name: "Maastricht, Netherlands", coordinates: { lat: 50.849375, lon: 5.694609 }, selected: true }, "Groningen, Netherlands": { name: "Groningen, Netherlands", coordinates: { lat: 53.2193835, lon: 6.5665018 }, selected: true }, "Rotterdam, Netherlands": { name: "Rotterdam, Netherlands", coordinates: { lat: 51.9244201, lon: 4.4777325 }, selected: true } }

// Random dutch cities which can be added
let citiesJson = {
    "Amsterdam, Netherlands": {
        "name": "Amsterdam, Netherlands",
        "coordinates": {
            "lat": 52.373165130615234,
            "lon": 4.890659809112549
        },
        "selected": true
    },
    "Rotterdam, Netherlands": {
        "name": "Rotterdam, Netherlands",
        "coordinates": {
            "lat": 51.92291259765625,
            "lon": 4.470584869384766
        },
        "selected": true
    },
    "The Hague, Netherlands": {
        "name": "The Hague, Netherlands",
        "coordinates": {
            "lat": 52.080196380615234,
            "lon": 4.31013298034668
        },
        "selected": true
    },
    "Utrecht, Netherlands": {
        "name": "Utrecht, Netherlands",
        "coordinates": {
            "lat": 52.09168243408203,
            "lon": 5.120363235473633
        },
        "selected": true
    },
    "Eindhoven, Netherlands": {
        "name": "Eindhoven, Netherlands",
        "coordinates": {
            "lat": 51.43659591674805,
            "lon": 5.478002071380615
        },
        "selected": true
    },
    "Groningen, Netherlands": {
        "name": "Groningen, Netherlands",
        "coordinates": {
            "lat": 53.21446990966797,
            "lon": 6.566481113433838
        },
        "selected": true
    },
    "Tilburg, Netherlands": {
        "name": "Tilburg, Netherlands",
        "coordinates": {
            "lat": 51.55512237548828,
            "lon": 5.090493202209473
        },
        "selected": true
    },
    "Almere, Netherlands": {
        "name": "Almere, Netherlands",
        "coordinates": {
            "lat": 52.37201690673828,
            "lon": 5.216705799102783
        },
        "selected": true
    },
    "Breda, Netherlands": {
        "name": "Breda, Netherlands",
        "coordinates": {
            "lat": 51.589317321777344,
            "lon": 4.77447509765625
        },
        "selected": true
    },
    "Nijmegen, Netherlands": {
        "name": "Nijmegen, Netherlands",
        "coordinates": {
            "lat": 51.84169387817383,
            "lon": 5.858651161193848
        },
        "selected": true
    },
    "Apeldoorn, Netherlands": {
        "name": "Apeldoorn, Netherlands",
        "coordinates": {
            "lat": 52.21632385253906,
            "lon": 5.9646220207214355
        },
        "selected": true
    },
    "Haarlem, Netherlands": {
        "name": "Haarlem, Netherlands",
        "coordinates": {
            "lat": 52.379493713378906,
            "lon": 4.637718200683594
        },
        "selected": true
    },
    "Arnhem, Netherlands": {
        "name": "Arnhem, Netherlands",
        "coordinates": {
            "lat": 51.97972869873047,
            "lon": 5.9124040603637695
        },
        "selected": true
    },
    "Enschede, Netherlands": {
        "name": "Enschede, Netherlands",
        "coordinates": {
            "lat": 52.220848083496094,
            "lon": 6.890952110290527
        },
        "selected": true
    },
    "Amersfoort, Netherlands": {
        "name": "Amersfoort, Netherlands",
        "coordinates": {
            "lat": 52.156593322753906,
            "lon": 5.3889241218566895
        },
        "selected": true
    },
    "Zaanstad, Netherlands": {
        "name": "Zaanstad, Netherlands",
        "coordinates": {
            "lat": 52.463279724121094,
            "lon": 4.773376941680908
        },
        "selected": true
    },
    "Haarlemmermeer, Netherlands": {
        "name": "Haarlemmermeer, Netherlands",
        "coordinates": {
            "lat": 52.30058288574219,
            "lon": 4.6879191398620605
        },
        "selected": true
    },
    "’s-Hertogenbosch, Netherlands": {
        "name": "’s-Hertogenbosch, Netherlands",
        "coordinates": {
            "lat": 51.69009017944336,
            "lon": 5.303689956665039
        },
        "selected": true
    },
    "Zwolle, Netherlands": {
        "name": "Zwolle, Netherlands",
        "coordinates": {
            "lat": 52.512794494628906,
            "lon": 6.091538906097412
        },
        "selected": true
    },
    "Zoetermeer, Netherlands": {
        "name": "Zoetermeer, Netherlands",
        "coordinates": {
            "lat": 52.06052017211914,
            "lon": 4.493261814117432
        },
        "selected": true
    },
    "Leiden, Netherlands": {
        "name": "Leiden, Netherlands",
        "coordinates": {
            "lat": 52.16108703613281,
            "lon": 4.490152835845947
        },
        "selected": true
    },
    "Leeuwarden, Netherlands": {
        "name": "Leeuwarden, Netherlands",
        "coordinates": {
            "lat": 53.203407287597656,
            "lon": 5.791306972503662
        },
        "selected": true
    },
    "Maastricht, Netherlands": {
        "name": "Maastricht, Netherlands",
        "coordinates": {
            "lat": 50.84984588623047,
            "lon": 5.687259197235107
        },
        "selected": true
    },
    "Dordrecht, Netherlands": {
        "name": "Dordrecht, Netherlands",
        "coordinates": {
            "lat": 51.81155014038086,
            "lon": 4.666360855102539
        },
        "selected": true
    },
    "Ede, Netherlands": {
        "name": "Ede, Netherlands",
        "coordinates": {
            "lat": 52.041664123535156,
            "lon": 5.668811798095703
        },
        "selected": true
    },
    "Alphen aan den Rijn, Netherlands": {
        "name": "Alphen aan den Rijn, Netherlands",
        "coordinates": {
            "lat": 52.12836837768555,
            "lon": 4.65696907043457
        },
        "selected": true
    },
    "Westland": {
        "name": "Westland",
        "coordinates": {
            "lat": 51.992488861083984,
            "lon": 4.207634925842285
        },
        "selected": true
    },
    "Alkmaar, Netherlands": {
        "name": "Alkmaar, Netherlands",
        "coordinates": {
            "lat": 52.632354736328125,
            "lon": 4.750678062438965
        },
        "selected": true
    },
    "Emmen, Netherlands": {
        "name": "Emmen, Netherlands",
        "coordinates": {
            "lat": 52.78770065307617,
            "lon": 6.894813060760498
        },
        "selected": true
    },
    "Delft, Netherlands": {
        "name": "Delft, Netherlands",
        "coordinates": {
            "lat": 52.011898040771484,
            "lon": 4.360257148742676
        },
        "selected": true
    },
    "Venlo, Netherlands": {
        "name": "Venlo, Netherlands",
        "coordinates": {
            "lat": 51.373329162597656,
            "lon": 6.173336982727051
        },
        "selected": true
    },
    "Deventer, Netherlands": {
        "name": "Deventer, Netherlands",
        "coordinates": {
            "lat": 52.25588607788086,
            "lon": 6.161369800567627
        },
        "selected": true
    },
    "Sittard-Geleen": {
        "name": "Sittard-Geleen",
        "coordinates": {
            "lat": 50.998294830322266,
            "lon": 5.8629150390625
        },
        "selected": true
    },
    "Helmond, Netherlands": {
        "name": "Helmond, Netherlands",
        "coordinates": {
            "lat": 51.480587005615234,
            "lon": 5.653771877288818
        },
        "selected": true
    },
    "Oss, Netherlands": {
        "name": "Oss, Netherlands",
        "coordinates": {
            "lat": 51.76607131958008,
            "lon": 5.526371002197266
        },
        "selected": true
    },
    "Amstelveen, Netherlands": {
        "name": "Amstelveen, Netherlands",
        "coordinates": {
            "lat": 52.305694580078125,
            "lon": 4.862514019012451
        },
        "selected": true
    },
    "Hilversum, Netherlands": {
        "name": "Hilversum, Netherlands",
        "coordinates": {
            "lat": 52.223968505859375,
            "lon": 5.170921802520752
        },
        "selected": true
    },
    "Súdwest-Fryslân": {
        "name": "Súdwest-Fryslân",
        "coordinates": {
            "lat": 53.03371810913086,
            "lon": 5.661133766174316
        },
        "selected": true
    },
    "Hoekse Waard, Netherlands": {
        "name": "Hoekse Waard, Netherlands",
        "coordinates": {
            "lat": 51.76970672607422,
            "lon": 4.461856842041016
        },
        "selected": true
    },
    "Heerlen, Netherlands": {
        "name": "Heerlen, Netherlands",
        "coordinates": {
            "lat": 50.88304138183594,
            "lon": 5.980935096740723
        },
        "selected": true
    },
    "Nissewaard, Netherlands": {
        "name": "Nissewaard, Netherlands",
        "coordinates": {
            "lat": 51.82830047607422,
            "lon": 4.279200077056885
        },
        "selected": true
    },
    "Purmerend, Netherlands": {
        "name": "Purmerend, Netherlands",
        "coordinates": {
            "lat": 52.50993347167969,
            "lon": 4.9450178146362305
        },
        "selected": true
    },
    "Meierijstad, Netherlands": {
        "name": "Meierijstad, Netherlands",
        "coordinates": {
            "lat": 51.58300018310547,
            "lon": 5.482999801635742
        },
        "selected": true
    },
    "Hengelo, Netherlands": {
        "name": "Hengelo, Netherlands",
        "coordinates": {
            "lat": 52.262603759765625,
            "lon": 6.791079998016357
        },
        "selected": true
    },
    "Schiedam, Netherlands": {
        "name": "Schiedam, Netherlands",
        "coordinates": {
            "lat": 51.91789627075195,
            "lon": 4.400252819061279
        },
        "selected": true
    },
    "Lelystad, Netherlands": {
        "name": "Lelystad, Netherlands",
        "coordinates": {
            "lat": 52.510005950927734,
            "lon": 5.477643013000488
        },
        "selected": true
    },
    "Roosendaal, Netherlands": {
        "name": "Roosendaal, Netherlands",
        "coordinates": {
            "lat": 51.53157043457031,
            "lon": 4.459847927093506
        },
        "selected": true
    },
    "Leidschendam-Voorburg": {
        "name": "Leidschendam-Voorburg",
        "coordinates": {
            "lat": 52.07887649536133,
            "lon": 4.400313854217529
        },
        "selected": true
    },
    "Gouda, Netherlands": {
        "name": "Gouda, Netherlands",
        "coordinates": {
            "lat": 52.01026916503906,
            "lon": 4.709833145141602
        },
        "selected": true
    },
    "Vlaardingen, Netherlands": {
        "name": "Vlaardingen, Netherlands",
        "coordinates": {
            "lat": 51.909873962402344,
            "lon": 4.341996192932129
        },
        "selected": true
    },
    "Hoorn, Netherlands": {
        "name": "Hoorn, Netherlands",
        "coordinates": {
            "lat": 52.641456604003906,
            "lon": 5.056807041168213
        },
        "selected": true
    }
}

//Load table of all cities currently int he sellection
function loadTable() {

    let rows = ''
    for (const element in cities) {
        rows += `<tr><td><div class="form-check">
        <input class="form-check-input" type="checkbox" ${cities[element].selected == true ? 'checked' : ''} value="" onchange="addLocation('${element}')">
        
      </div></td><td>${cities[element].name}</td></tr>`
    };
    document.querySelector('#table-content').innerHTML = rows
}

//Create an instance of Bing Maps and add mount this to the page
function GetMap() {
    map = new Microsoft.Maps.Map('#bing-map', {
        center: new Microsoft.Maps.Location(52.370216, 4.895168),
        zoom: 7
    });

    //This adds all the selected places to the map and updates the table
    rerenderAll()

}

//Add all the selected places to the map and refresh the table
function rerenderAll() {
    loadTable()
    renderPints()
    updateTotalLocationsAndPossibleRoutes()
}

//Add a loction the selected cities
function addLocation(cityName) {
    if (cities[cityName].selected) {
        cities[cityName].selected = false
    } else {
        cities[cityName].selected = true
    }
    rerenderAll()
}

//Add the pre set list of cities to the selected places
function addAllCities() {
    for (const element in citiesJson) {
        cities[element] = citiesJson[element]
    }
    rerenderAll()
}

//Calcutate how many different routes woulbe be possible
//Display the result an the table
function updateTotalLocationsAndPossibleRoutes() {
    let tmpCounter = 0;
    for (element in cities) {
        if (cities[element].selected) {
            tmpCounter++
        }
    }
    document.getElementById('total-points').innerHTML = tmpCounter
    let possibleRoutes = math.factorial(tmpCounter - 1) / 2

    document.getElementById('possible-routes').innerHTML = possibleRoutes
}

//Place all selected locations on the table
function renderPints() {

    map.entities.clear()

    for (const cityname in cities) {
        if (cities[cityname].selected) {
            let location = new Microsoft.Maps.Location(cities[cityname].coordinates.lat, cities[cityname].coordinates.lon)

            let pin = new Microsoft.Maps.Pushpin(location, {
                title: cityname,
            });
            //Add the pushpin to the map
            map.entities.push(pin);
        }
    };
}

//Plots a route between all points.
//If there are more then 25 points we use 2 instances of directionsManager, because the is a limit of 25 points when calculating a route
//locations format:
// {
//     "0": "Amsterdam, Netherlands",
//     "1": "Maastricht, Netherlands",
//     "2": "Groningen, Netherlands",
// }
function plotRoute(locations) {
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
        //Create an instance of the directions manager.
        if (directionsManager && directionsManager2) {
            //If there is a route on the map remove it first
            directionsManager.clearAll()
            directionsManager2.clearAll()
        } else {
            directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
            directionsManager2 = new Microsoft.Maps.Directions.DirectionsManager(map);
        }
        let index = 0
        for (element in locations) {
            var seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ name: `${index}`, location: new Microsoft.Maps.Location(cities[locations[element]].coordinates.lat, cities[locations[element]].coordinates.lon) });
            if (index <= 24) {//plot first 25 points
                directionsManager.addWaypoint(seattleWaypoint);
            } else if (index >= 25) {//plot second 25 points
                directionsManager2.addWaypoint(seattleWaypoint);
            }
            index++
        }
        //Calculate directions.
        directionsManager.calculateDirections()
        directionsManager2.calculateDirections()
    });
}

//Fetch the solver settings and create a body to send to the solver server
function createPostBody() {
    let body = { "locations": [] }
    for (city in cities) {
        if (cities[city].selected) {
            body.locations.push({
                name: cities[city].name,
                coordinates: cities[city].coordinates
            })
        }
    }
    body["BingSettings"] = {
        "travelMode": "driving",
        "optimize": "distance"
    }

    body["solver"] = {}

    let userHardwareElement = document.getElementById("hardware-select")
    let userHardwareValue = userHardwareElement.options[userHardwareElement.selectedIndex].value

    let userSolverElement = document.getElementById("solver-select")
    let userSolverValue = userSolverElement.options[userSolverElement.selectedIndex].value

    let userTimeoutElement = document.getElementById("timeout-select")
    let userTimeoutValue = userTimeoutElement.options[userTimeoutElement.selectedIndex].value



    //Set user timeout default is 10 sec 
    try {
        if (userTimeoutValue != 'Select timeout in sec') {
            body.solver.Timeout = parseInt(userTimeoutValue)
        } else {
            body.solver.Timeout = 10
        }
    } catch (err) {
        body.solver.Timeout = 10
    }

    //Set solver type default is Simulated annealing 
    try {
        if (userSolverValue != 'Select solver type') {
            body.solver.SolverName = userSolverValue
        } else {
            body.solver.SolverName = "simulated annealing"
        }
    } catch (err) {
        body.solver.SolverName = "simulated annealing"
    }

    //Set selected hardware
    try {
        if (userHardwareValue != 'Select hardware type') {
            if (userHardwareValue == "fpga" && body.solver.SolverName == "simulated annealing") {
                body.solver.Hardware = "fpga"
            } else {
                body.solver.Hardware = "cpu"
            }
        } else {
            body.solver.Hardware = "cpu"
        }
    } catch (err) {
        body.solver.Hardware = "cpu"
    }

    body.password = localStorage.getItem('apiPassword')

    return body
}

function setButtonState(buttonId, state) {
    if (state == false) {
        document.getElementById(buttonId).setAttribute("disabled", "true")
        document.getElementById('calc-route-text').style.display = 'block'
    } else {
        document.getElementById(buttonId).removeAttribute("disabled")
        document.getElementById('calc-route-text').style.display = 'none'
    }

}

//Send current locatiosn and settings to solver to solve
function calcuateRoute() {
    let body = createPostBody()
    setButtonState('calc-route-button', false)
    fetch("./api/v1/solve", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(function (response) {
        if (response.status == 403) {
            localStorage.removeItem('apiPassword')
            fetchStoredPassword()
            throw new Error("Api key was not good")
        }
        return response.json();
    })
        .then(body => {
            //This will check every 3 seconds if the job is complete
            if (body.jobid) {
                startResultPolling(body.jobid)
            } else {
                try {
                    alert(body.detail)
                } catch (err) {
                    alert("Could not send this request to the solver, please try again.")
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
}

//This will check every 3 second if the job is complete.
//If it is complete the result will be displayed
function startResultPolling(jobId) {
    let pollingJob = setInterval(() => { // Every 3 sec check if there if the job is complete
        fetch(`./api/v1/status?id=${jobId}`)
            .then(response => response.json())
            .then(body => {
                if (body.detail) { // error occurred
                    clearInterval(pollingJob)
                    alert(body.detail)
                    setButtonState('calc-route-button', true)
                }
                else if (body.completed == true) {
                    clearInterval(pollingJob)
                    processStatusResults(body)
                    setButtonState('calc-route-button', true)
                } else {
                    document.getElementById('sovler-status').innerHTML = body.status
                }
            }).catch(err => {
                clearInterval(pollingJob)
                alert("Failed to fetch status please refresh and try again.")
            })
    }, 3000);
}

//Display the solver result on the page
function processStatusResults(result) {
    document.getElementById('total-cost').innerHTML = result.results.RouteCost.Cost
    document.getElementById('total-cost-unit').innerHTML = `Total ${result.results.RouteCost.Unit}`

    let tmpHTML = ''
    for (point in result.results.Route) {
        tmpHTML = `${tmpHTML}<li>${result.results.Route[point]}</li>`
    }
    document.getElementById('result-list').innerHTML = tmpHTML

    document.getElementById('list-stops-button').style.display = 'block'

    plotRoute(result.results.Route)
}

function searchLocation() {
    geocodeQuery(document.getElementById('search-input').value)
    document.getElementById('search-input').value = ''

}

//Search for a location and add the result to all the cities
function geocodeQuery(query) {
    //If search manager is not defined, load the search module.
    if (!searchManager) {
        //Create an instance of the search manager and call the geocodeQuery function again.
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            searchManager = new Microsoft.Maps.Search.SearchManager(map);
            geocodeQuery(query);
        });
    } else {
        var searchRequest = {
            where: query,
            callback: function (r) {

                //Add the first result to the map and zoom into it.
                if (r && r.results && r.results.length > 0) {
                    var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
                    map.entities.push(pin);

                    // map.setView({ bounds: r.results[0].bestView });
                }
                //add it to the list of locations
                try {
                    let tmpLocation = r.results[0].location
                    cities[tmpLocation.name] = {
                        name: tmpLocation.name,
                        coordinates: {
                            lat: tmpLocation.latitude,
                            lon: tmpLocation.longitude
                        },
                        selected: true
                    }
                    rerenderAll()
                } catch (err) {
                    console.log(err)
                }

            },
            errorCallback: function (e) {
                //If there is an error, alert the user about it.
                alert("No results found.");
            }
        };

        //Make the geocode request.
        searchManager.geocode(searchRequest);
    }
}

function fetchStoredPassword() {
    apiPassword = localStorage.getItem('apiPassword')
    if (!apiPassword) {
        let modalEl = document.getElementById('password-modal')
        let modal = new bootstrap.Modal(modalEl)
        modal.show()

        modalEl.addEventListener('hide.bs.modal', function (event) {
            let newPassword = document.getElementById('input-password').value
            if (newPassword) {
                localStorage.setItem('apiPassword', newPassword)
                document.getElementById('input-password').value = ''
            } else {
                console.log(`empty pass ${newPassword}`)
                setTimeout(() => {
                    modal.show()
                }, 500)

            }

        })
    }
}
fetchStoredPassword()