var map;
var idInfoBoxAberto;
var infoBox = [];
 
function initialize() {
    var latlng = new google.maps.LatLng(-30.0346316, -51.21769860000006);
 
    var options = {
        zoom: 6,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    map = new google.maps.Map(document.getElementById("mapa"), options);
}
 
initialize();

 
function abrirInfoBox(id, marker) {

    if (typeof(idInfoBoxAberto) == 'number' && typeof(infoBox[idInfoBoxAberto]) == 'object') {
        infoBox[idInfoBoxAberto].close();
    }
 
    infoBox[id].open(map, marker);
    idInfoBoxAberto = id;
}

function carregarPontos() {

    $.getJSON('js/pontos.json', function(pontos) {

        $.each(pontos, function(index, ponto) {

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(ponto.Latitude, ponto.Longitude),
                title: "Meu ponto personalizado! :-D",
                map: map,
                icon: 'img/marker.png'
            

            });
           
           var infowindow = new google.maps.InfoWindow(), marker;
 
google.maps.event.addListener(marker, 'click', (function(marker, i) {
    return function() {
        infowindow.setContent("Conteúdo do marcador.");
        infowindow.open(map, marker);
    }
})(marker))

        });

    });
    

}

carregarPontos(); 

