var polygon = $.request.parameters.get("polygon");
var categories = $.request.parameters.get("categories"); 
if (categories=='()'){categories = '(0)';}
if(/^[0-9,()]+$/.test(categories)){
	
	var connection = $.db.getConnection("mexbalia.Geo_Agg.UI::Anonymous_Access");
	var GetNODEs = connection.prepareStatement( "SELECT * FROM \"GEO_AGG\".\"mexbalia.Geo_Agg.DB::Geo_Nodes\" WHERE NEW ST_Polygon(?) .ST_Contains( location )=1" );
	
	GetNODEs.setString(1,polygon);
	
	var ResultRow =GetNODEs.executeQuery();
	
	var NODEsResponse=[];
	
	var current_object={};
	var NODEsList = [];
	while(ResultRow.next()){
		var NODEID = ResultRow.getString(1);
	current_object={"ID":NODEID,"STATE":ResultRow.getString(2),"LOCATION":ResultRow.getString(6)};
	NODEsList.push(NODEID);
	NODEsResponse.push(current_object);
	}
	var NODEsList_str = '('+NODEsList.toString()+')';
	if (NODEsList.length == 0){NODEsList_str='(0)';}
	var AggregationsResponse=[];
	
	var GetAggregations=connection.prepareStatement("select sum(Sales.volume) as volume,sum(TO_BIGINT(Sales.units)) as units,sum(Sales.promos) as promos,sum(Sales.prediction) as prediction "+
			"from \"GEO_AGG\".\"mexbalia.Geo_Agg.DB::Aggregations\" as Sales where Sales.NODE in "+NODEsList_str+" and Sales.category in "+categories);
	
	
	
	var ResultRow =GetAggregations.executeQuery();
	
	var current_object={};
	$.response.contentType = "json";
	while(ResultRow.next()){
	current_object={"VOLUME":ResultRow.getString(1),"UNITS":ResultRow.getString(2),"PROMOS":ResultRow.getString(3),"PREDICTION":ResultRow.getString(4)};
	
	AggregationsResponse.push(current_object);
	}
	var respuesta = {map:NODEsResponse,table:AggregationsResponse};
	
	$.response.setBody(JSON.stringify(respuesta));
	
	ResultRow.close();
	GetNODEs.close();
	connection.close();

}
else{$.response.contentType = "text";
$.response.setBody('Invalid Categories List');

}