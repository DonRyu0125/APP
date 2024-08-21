function getRoot( connectionString, cb ) {
    return axios.get(connectionString).then(function (response) {
        // 1.)Grab raw XML Data
        var xmlData = response.data;
        //console.log(xmlData);
        // 2.) Parse XML
        parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlData, "text/xml");
        cb(xmlDoc);
    });
}

function getChildren( connectionString, cb ) {
    axios.get(connectionString).then(function (response) {
        var xmlData = response.data;
        parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlData, "text/xml");
        cb(xmlDoc);
    });
}


function getStart( connectionString ) {
    axios.get(connectionString).then(function (response) {
        console.log(response.data);
    });
}