var polygon = $.request.parameters.get("polygon");
var categories = $.request.parameters.get("categories"); 
if (categories=='()'){categories = '(0)';}
if(/^[0-9,()]+$/.test(categories)){
	
	var connection = $.db.getConnection("mexbalia.Geo_Agg.UI::Anonymous_Access");
	var GetStores = connection.prepareStatement( "SELECT * FROM \"GEO_AGG\".\"mexbalia.Geo_Agg.DB::Geo_Stores\" WHERE NEW ST_Polygon(?) .ST_Contains( location )=1" );
	
	GetStores.setString(1,polygon);
	
	var ResultRow =GetStores.executeQuery();
	
	var StoresResponse=[];
	
	var current_object={};
	var StoresList = [];
	while(ResultRow.next()){
		var StoreID = ResultRow.getString(1);
	current_object={"ID":StoreID,"STATE":ResultRow.getString(2),"LOCATION":ResultRow.getString(6)};
	StoresList.push(StoreID);
	StoresResponse.push(current_object);
	}
	var StoresList_str = '('+StoresList.toString()+')';
	if (StoresList.length == 0){StoresList_str='(0)';}
	var AggregationsResponse=[];
	
	var GetAggregations=connection.prepareStatement("select sum(Sales.volume) as volume,sum(TO_BIGINT(Sales.units)) as units,sum(Sales.promos) as promos,sum(Sales.prediction) as prediction "+
			"from \"GEO_AGG\".\"mexbalia.Geo_Agg.DB::Aggregations\" as Sales where Sales.store in "+StoresList_str+" and Sales.category in "+categories);
	
	
	
	var ResultRow =GetAggregations.executeQuery();
	
	var current_object={};
	$.response.contentType = "json";
	while(ResultRow.next()){
	current_object={"VOLUME":ResultRow.getString(1),"UNITS":ResultRow.getString(2),"PROMOS":ResultRow.getString(3),"PREDICTION":ResultRow.getString(4)};
	
	AggregationsResponse.push(current_object);
	}
	var respuesta = {map:StoresResponse,table:AggregationsResponse};
	
	$.response.setBody(JSON.stringify(respuesta));
	
	ResultRow.close();
	GetStores.close();
	connection.close();

}
else{$.response.contentType = "text";
$.response.setBody('Invalid Categories List');

}