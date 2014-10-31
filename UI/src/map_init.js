var map, pointarray, heatmap;


	var marker=[], markersArray=[], markersArray_store=[];
	var pointArray=[];
	var pal_poligono =[];
	var wkt_conv = new Wkt.Wkt();
	var cadena_cat = "()";

	function get_polygon(){
		wkt_conv.fromObject(poligono);
		return wkt_conv.write();
		
	};

	var num_markers = 0;
	
	function update_table_pol_change(){
		poligono.setPath(pal_poligono);
		$.ajax({url:"/mexbalia/Geo_Agg/UI/Nodes_Coords.xsjs",data:{polygon:get_polygon(),categories:cadena_cat},success:function(respuesta){
			delete_MarkersArray_store();
			var response = respuesta.map;
			insert_data(respuesta);
			for (i in response){
				wkt_conv.read(response[i].LOCATION);
				placeMarker_store(wkt_conv.toObject().position,response[i].ID);
			}
		
		}});
	};
	
	
	function update_table(){

		if((markersArray_store.length!=0)&&(markersArray.length==0)){
			var lat_1 = map.getBounds().getSouthWest().lat();
			var lon_1 = map.getBounds().getSouthWest().lng();
			var lat_2 = map.getBounds().getNorthEast().lat();
			var lon_2 = map.getBounds().getNorthEast().lng();
	poligono.setPath([new google.maps.LatLng(lat_1,lon_1),
	                  new google.maps.LatLng(lat_2,lon_1),
	                  new google.maps.LatLng(lat_2,lon_2),
	                  new google.maps.LatLng(lat_1,lon_2),
	                  new google.maps.LatLng(lat_1,lon_1)]);
	var poligono_2 = get_polygon();
	poligono.setPath([]);
		}
		else{		var poligono_2 = get_polygon();

			
			
		}
		
		if(markersArray_store.length!=0){
		$.ajax({url:"/mexbalia/Geo_Agg/UI/Nodes_Coords.xsjs",data:{polygon:poligono_2,categories:cadena_cat},success:function(respuesta){
			var response = respuesta.map;
			insert_data(respuesta);
		
		}})}
	};
	function insert_data(response){
		var rows = Object.keys(response.table[0]);
		var data =[];
		var i = 0;
		for (i=0;i<rows.length;i++){
			var name = response.table[0][rows[i]].Alias;
			data.push({FIELD:name,VALUE:to_mxn(response.table[0][rows[i]].Value),VALUE_NUM:parseFloat(response.table[0][rows[i]].Value)});
		}
//		var data=[{FIELD:"Volume",VALUE:to_mxn(response.table[0].VOLUME),VALUE_NUM:parseFloat(response.table[0].VOLUME)},
//		          {FIELD:"Units",VALUE:parseInt(response.table[0].UNITS).toLocaleString().replace(/\./g,','),VALUE_NUM:parseFloat(response.table[0].UNITS)},
//		          {FIELD:"Promos",VALUE:to_mxn(response.table[0].PROMOS),VALUE_NUM:parseFloat(response.table[0].PROMOS)},
//		          {FIELD:"Prediction",VALUE:to_mxn(response.table[0]["PREDICTION"]),VALUE_NUM:parseFloat(response.table[0]["PREDICTION"])}];
		oModel_Stores.setData(data);
	};
	
	function placeMarker(location) {
	    var marker = new google.maps.Marker({
	        position: location,
	        map: map,
	        draggable:true,
	        animation:google.maps.Animation.DROP
	    });
        
            var my_index = pal_poligono.length-1;

		google.maps.event.addListener(marker, 'click', function(event) {
			var last_mark = pal_poligono.length-1
			var last_mar_lat = pal_poligono[last_mark].lat();
			var last_mar_long = pal_poligono[last_mark].lng();
			var first_mar_lat = pal_poligono[0].lat();
			var first_mar_long = pal_poligono[0].lng();
			if((event.latLng.lng() == first_mar_long)&&(event.latLng.lat() == first_mar_lat)&&(last_mark!=0)&&(poligono.getPath().length==0)){
				update_table_pol_change();
				
				
			}
			else if(((event.latLng.lng() == last_mar_long)&&(event.latLng.lat() == last_mar_lat))||last_mark==0){
				markersArray[last_mark].setMap(null);
				markersArray.pop();
				pal_poligono.pop();
				polilinea.setPath(pal_poligono);
				poligono.setPath([]);
				delete_MarkersArray_store();
				oModel_Stores.setData([]);
			}

	 });
	    markersArray.push(marker);
	    if(poligono.getPath().length==0){
	    	delete_MarkersArray_store();
	    }
		
		
		google.maps.event.addListener(marker, 'dragend', function(event) {
            pal_poligono[my_index]=event.latLng;
            polilinea.setPath(pal_poligono);
            
            if(poligono.getPath().length!=0){
                update_table_pol_change();
                
            }
		
		}
		);

	    

	};
	
	function delete_MarkersArray_store(){
		for (i in markersArray_store){
			markersArray_store[i].setMap(null);
		}
		markersArray_store=[];
	};
	function placeMarker_store(location,mTitle) {
	    var marker = new google.maps.Marker({
	        position: location,
	        map: map,
	        title:mTitle,
	        icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	    });

	    
	    markersArray_store.push(marker);
	};
	
	function cleanMap(){
		
		for (i in markersArray){
			
			markersArray[i].setMap(null);
			pal_poligono.pop();
			polilinea.setPath(pal_poligono);
			poligono.setPath([]);
			oModel_Stores.setData([]);
		}		
		delete_MarkersArray_store();
		oModel_Stores.setData([]);
		pal_poligono=[];
		markersArray=[];
	//	first_frame();
	};
	
	
	function dfArea(){
		map.setZoom(11);
		map.panTo({lat:19.423364,lng:-99.133895});
		cleanMap();
		first_frame();
	};
	


function initialize() {
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(19.350449,-99.144291),
    center: new google.maps.LatLng(22.804899, -102.488591),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
polilinea = new google.maps.Polyline({
paths: pal_poligono,
strokeColor: '#FF0000',
strokeOpacity: 0.8,
strokeWeight: 2,
fillColor: '#FF0000',
fillOpacity: 0.35,
map:map
});

poligono = new google.maps.Polygon({
	paths: pal_poligono,
	strokeColor: '#FF0000',
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: '#FF0000',
	fillOpacity: 0.15,
	map:map
	});
	
	poligono.setPath([]);
	google.maps.event.addListener(map, 'click', function(event) {
        pal_poligono.push(event.latLng);
        polilinea.setPath(pal_poligono);
        placeMarker(event.latLng);
    });

	google.maps.event.addListenerOnce(map, 'idle', function(){


		first_frame();
		oParentCheckBox.fireChange();
	
	});	

	
}

function first_frame(){	
	delete_MarkersArray_store();
	var lat_1 = map.getBounds().getSouthWest().lat();
	var lon_1 = map.getBounds().getSouthWest().lng();
	var lat_2 = map.getBounds().getNorthEast().lat();
	var lon_2 = map.getBounds().getNorthEast().lng();
poligono.setPath([new google.maps.LatLng(lat_1,lon_1),
                  new google.maps.LatLng(lat_2,lon_1),
                  new google.maps.LatLng(lat_2,lon_2),
                  new google.maps.LatLng(lat_1,lon_2),
                  new google.maps.LatLng(lat_1,lon_1)]);
$.ajax({url:"/mexbalia/Geo_Agg/UI/Nodes_Coords.xsjs",data:{polygon:get_polygon(),categories:cadena_cat},
	success:function(respuesta){
	var response = respuesta.map;
	insert_data(respuesta);

	for (i in response){
		wkt_conv.read(response[i].LOCATION);
		placeMarker_store(wkt_conv.toObject().position,response[i].ID);
	}

	poligono.setPath([]);

}})};

function to_mxn(cadena){
	if (cadena!=null){
		var mitad_1 = parseInt(cadena).toLocaleString().replace(/\./g,',');
		var mitad_2 = parseFloat(cadena).toFixed(2).substr(-3);
		return '$'+mitad_1+mitad_2;
		}
	else{
		return cadena;
	}
};

function categorias_selecc(){
	var l=[];
	for (i in aChildren){if (aChildren[i].getChecked()){l.push(parseInt(i)+1)}}
	cadena_cat = '('+l.toString()+')';
};

function registerChildren(allChildren, oParent){
		var nSelectedChildren = 0;
   		for (var i = 0; i < allChildren.length; i++) {
	   		allChildren[i].attachChange(function(){
	   				this.getChecked() ? nSelectedChildren+=1 : nSelectedChildren-=1;
	   				if(nSelectedChildren === 0){
	   					oParent.toggle("Unchecked");
	   				}
	   				else if(nSelectedChildren === allChildren.length){
	   					oParent.toggle("Checked");
	   				}
	   				else{
	   					oParent.toggle("Mixed");
	   				}
	   			}
	   		);
   		}
   		oParent.attachChange(function(){
     		if (this.getSelectionState() === "Checked"){
     			for (var i = 0; i < allChildren.length; i++) {
  	     			allChildren[i].setChecked(true);
  	     			nSelectedChildren = allChildren.length;
     			}
     		}
     		else {
     			for (var i = 0; i < allChildren.length; i++) {
     				allChildren[i].setChecked(false);
	     				nSelectedChildren = 0;
   				}
   			}
     		
     		categorias_selecc();
     		update_table();
     	});
	};


google.maps.event.addDomListener(window, 'load', initialize);




