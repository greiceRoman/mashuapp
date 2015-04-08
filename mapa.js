var geocoder;
var map;
var marker;
var infowindow;

var dataUrl = "http://pipes.yahoo.com/pipes/pipe.run?_id=ee2d949b89cf1b7c10739b6bda534f73&_render=json&_callback=dataLoaded&city=";

var selecao = null;

function initialize() {
	var latlng = new google.maps.LatLng(-30.0346316, -51.21769860000006);
	var options = {
		zoom: 6,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById("mapa"), options);
	
	geocoder = new google.maps.Geocoder();
	
	marker = new google.maps.Marker({
		map: map
	});

	infowindow = new google.maps.InfoWindow(), marker;

    google.maps.event.addListener(map, 'click', function(event) {
        carregarPonto(event.latLng);
    });
  
}

function carregarPonto(location) {
     geocoder.geocode({'latLng': location}, pontoCarregado);
}

function dataLoaded(data) {
    var html = "<div id='nomeCidade'>" + selecao.cidade + ", 2010</div>";
    html += "<table id='tabelaDados'>";
    html += "<thead><td width='20%'><td width='60%'><td width='20%'></thead>";
    if (items.length == 0) {
        html = "<div class='semDados'>No data for this city.<br>Please, select a city in Rio Grande do Sul</div>";
    } else {
        html += "<tbody><tr><th align='left'>Month</th><th align='left'>Type</th><th align='right'>Count</th></tr>";
        var items = data.value.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            html += "<tr>"
                + "<td align='left'>" + item.month + "</td>"
                + "<td align='left'>" + item.type + "</td>"
                + "<td align='right'>" + item.count + "</td>"
                + "</tr>";
        }
        html += "</tbody></table>";
    }
    $("#dados").html(html);
}

function pontoCarregado(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
	    var result = results[0];
		if (result) {
		    var location = result.geometry.location;
			var index = result.address_components.length - 4;
            selecao = {
                endereco: result.formatted_address,
                cidade: result.address_components[index].long_name,
                location: location
            };

			carregaDados();
		}
	}
}

function carregaDados() {
	marker.setPosition(selecao.location);
	map.setCenter(selecao.location);
	map.setZoom(6);

    $("#dados").html("<div id='nomeCidade'>Loading data for " + selecao.cidade + "</div>");

    $.ajax({
        type: 'GET',
        url: dataUrl + removeDiacritics(selecao.cidade),
        jsonpCallback: 'dataLoaded',
        contentType: "application/json",
        dataType: 'jsonp',
        error: function(e) {
            alert("Error! " + e);
        }
    });
}

$(document).ready(function () {

	initialize();
	
	function carregarNoMapa(endereco) {
		geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, pontoCarregado);
	}
	
	$("#btnEndereco").click(function() {
		if($(this).val() != "")
			carregarNoMapa($("#txtEndereco").val());
	})

	$("#txtEndereco").autocomplete({
		source: function (request, response) {
			geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
				response($.map(results, function (item) {
					return {
						label: item.formatted_address,
						value: item.formatted_address,
						cidade: item.address_components[0].long_name,
						location: item.geometry.location
					}
				}));
			})
		},
		select: function (event, ui) {
		    selecao = ui.item;
            carregaDados();
		}
	});
	
});


