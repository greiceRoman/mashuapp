var map;

function carregarPontos() {
 
    $.getJSON('js/pontos.json', function(pontos) {
 
        $.each(pontos, function(index, ponto) {
 
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(ponto.Latitude, ponto.Longitude),
                title: "Meu ponto personalizado! :-D",
                map: map,
                icon: 'img/marker.png'
            });
 
        });
 
    });
 
}
 
carregarPontos();