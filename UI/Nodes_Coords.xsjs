var polygon = $.request.parameters.get("polygon");
var categories = $.request.parameters.get("categories"); 
if (categories=='()'){categories = '(0)';}
if(/^[0-9,()]+$/.test(categories)){
	
	var connection = $.db.getConnection("mexbalia.Geo_Agg.UI::Anonymous_Access");
	
	
	var Confdestination_package = "mexbalia.Geo_Agg.UI";
	var Confdestination_name = "Conf"; 

	       var Confdest = $.net.http.readDestination(Confdestination_package, Confdestination_name);
	       var Confclient = new $.net.http.Client();
	       var Confreq = new $.web.WebRequest($.net.http.GET," "); 
	       Confclient.request(Confreq, Confdest);
	       var Confresponse = Confclient.getResponse(); 
	       var Conf = JSON.parse(Confresponse.body.asString());
	
	
	
	
//	var Conf = {Nodes:{Table:"\"GEO_AGG\".\"mexbalia.Geo_Agg.DB::Geo_Nodes\"", GField:'location'},
//			Aggregations:{Table:"\"GEO_AGG\".\"mexbalia.Geo_Agg.DB::Aggregations\"",
//				Columns:[{Name:"VOLUME",Alias:"Volume"},
//				         {Name:"UNITS",Alias:"Volume"},
//				         {Name:"PROMOS",Alias:"Volume"},
//				         {Name:"PREDICTION",Alias:"Volume"}],
//				GeoColumn:'Node',
//				CategoryColumn:'Category'
//				}};
	var GetNodes = connection.prepareStatement( "SELECT * FROM " + Conf.Nodes.Table +" WHERE NEW ST_Polygon(?) .ST_Contains( " + Conf.Nodes.GField + " )=1" );
	
	GetNodes.setString(1,polygon);
	
	var ResultRow =GetNodes.executeQuery();
	
	var NodesResponse=[];
	
	var current_object={};
	var NodesList = [];
	while(ResultRow.next()){
		var NODEID = ResultRow.getString(1);
	current_object={"ID":NODEID,"STATE":ResultRow.getString(2),"LOCATION":ResultRow.getString(6)};
	NodesList.push(NODEID);
	NodesResponse.push(current_object);
	}
	var NodesList_str = '('+NodesList.toString()+')';
	if (NodesList.length == 0){NodesList_str='(0)';}
	var AggregationsResponse=[];
	var preQueryColumns = "";
	var i = 0;
	for (i=0;i<Conf.Aggregations.Columns.length;i++){
		preQueryColumns = preQueryColumns + ' sum("' +Conf.Aggregations.Columns[i].Name+'") as "'+Conf.Aggregations.Columns[i].Alias+'" ';
		if (i < Conf.Aggregations.Columns.length -1){
			preQueryColumns = preQueryColumns + ',';
		}
	}
	var GetAggregations=connection.prepareStatement("select "+preQueryColumns +
			"from " + Conf.Aggregations.Table +" as Sales where Sales."+Conf.Aggregations.GeoColumn+" in "+NodesList_str+" and Sales."+Conf.Aggregations.CategoryColumn+" in "+categories);

	
	
	
//	var GetAggregations=connection.prepareStatement("select sum(Sales.volume) as volume,sum(Sales.units) as units,sum(Sales.promos) as promos,sum(Sales.prediction) as prediction "+
//			"from " + AggregationsConf.Table +" as Sales where Sales.NODE in "+NodesList_str+" and Sales.category in "+categories);
	
	
	
	var ResultRow =GetAggregations.executeQuery();
	
	var current_object={};
	$.response.contentType = "json";
	while(ResultRow.next()){
//	current_object={"VOLUME":ResultRow.getString(1),"UNITS":ResultRow.getString(2),"PROMOS":ResultRow.getString(3),"PREDICTION":ResultRow.getString(4)};
	current_object = {};
	for (i=0;i<Conf.Aggregations.Columns.length;i++){
		current_object[Conf.Aggregations.Columns[i].Name] = {Value:ResultRow.getString(i+1),Alias:Conf.Aggregations.Columns[i].Alias};
		//current_object[Conf.Aggregations.Columns[i].Name] = ResultRow.getString(i+1);
	}
	AggregationsResponse.push(current_object);
	}
	var respuesta = {map:NodesResponse,table:AggregationsResponse};
	
	$.response.setBody(JSON.stringify(respuesta));
	
	ResultRow.close();
	GetNodes.close();
	connection.close();

}
else{$.response.contentType = "text";
$.response.setBody('Invalid Categories List');

}