var geocoder;
var map;
var marker;
var infowindow;

var dataUrl = "http://pipes.yahoo.com/pipes/pipe.run?_id=ee2d949b89cf1b7c10739b6bda534f73&_render=json&_callback=dataLoaded&city=";

function initialize() {
	var latlng = new google.maps.LatLng(-30.0346316, -51.21769860000006);
	var options = {
		zoom: 5,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById("mapa"), options);
	
	geocoder = new google.maps.Geocoder();
	
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
	});
	marker.setPosition(latlng);

	infowindow = new google.maps.InfoWindow(), marker;

	google.maps.event.addListener(marker, 'click', (function(marker, i) {
	return function() {
	    infowindow.setContent("Marker content.");
	    infowindow.open(map, marker);
	}
	})(marker))
}

function dataLoaded(data) {
    var html = "<div id='nomeCidade'>" + $("#txtCidade").val() + ", 2010</div>";
    html += "<table id='tabelaDados'>";
    html += "<thead><td width='25%'><td width='50%'><td width='25%'></thead>";
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
    $("#dados").html(html);
}

$(document).ready(function () {

	initialize();
	
	function carregarNoMapa(endereco) {
		geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
			    var result = results[0];
				if (result) {
					var latitude = result.geometry.location.lat();
					var longitude = result.geometry.location.lng();
		
					$('#txtEndereco').val(result.formatted_address);
					$('#txtCidade').val(result.address_components[0].long_name);
					$('#txtLatitude').val(latitude);
                   	$('#txtLongitude').val(longitude);
		
					var location = new google.maps.LatLng(latitude, longitude);
					marker.setPosition(location);
					map.setCenter(location);
					map.setZoom(16);
				}
			}
		})
	}
	
	$("#btnEndereco").click(function() {
		if($(this).val() != "")
			carregarNoMapa($("#txtEndereco").val());
	})
	
	$("#txtEndereco").blur(function() {
		if($(this).val() != "")
			carregarNoMapa($(this).val());
	})
	
	google.maps.event.addListener(marker, 'drag', function () {
		geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {  
					$('#txtEndereco').val(results[0].formatted_address);
					$('#txtLatitude').val(marker.getPosition().lat());
					$('#txtLongitude').val(marker.getPosition().lng());
				}
			}
		});
	});
	
	$("#txtEndereco").autocomplete({
		source: function (request, response) {
			geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
				response($.map(results, function (item) {
					return {
						label: item.formatted_address,
						value: item.formatted_address,
						latitude: item.geometry.location.lat(),
          				longitude: item.geometry.location.lng()
					}
				}));
			})
		},
		select: function (event, ui) {
			$("#txtLatitude").val(ui.item.latitude);
    		$("#txtLongitude").val(ui.item.longitude);
			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			marker.setPosition(location);
			map.setCenter(location);
			map.setZoom(16);
		}
	});
	
	$("form").submit(function(event) {
		event.preventDefault();
		
		var endereco = $("#txtEndereco").val();
		var cidade = $("#txtCidade").val();
		var latitude = $("#txtLatitude").val();
		var longitude = $("#txtLongitude").val();
				
		if (cidade == null || cidade.length == 0) {
		    return;
		}

        $("#dados").html("<div id='nomeCidade'>Loading...</div>");
    
        $.ajax({
           type: 'GET',
            url: dataUrl + removeDiacritics(cidade),
            jsonpCallback: 'dataLoaded',
            contentType: "application/json",
            dataType: 'jsonp',
            error: function(e) {
               alert("Error! " + e);
            }
        });

	});
});


