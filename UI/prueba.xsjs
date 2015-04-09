var dest = $.net.http.readDestination("mexbalia.Geo_Agg.UI", "prueba");
var client = new $.net.http.Client();
var req = new $.web.WebRequest($.net.http.GET, "mexbalia/mapa");
client.request(req, dest);
var response = client.getResponse();
$.response.setBody(response.length);