		var oModel_Stores = new sap.ui.model.json.JSONModel();


var Tabla_Stores = new sap.ui.table.Table({title:"Points of interest",
		SelectionMode:sap.ui.table.SelectionMode.Single,
		navigationMode:sap.ui.table.NavigationMode.Paginator,
		visibleRowCount:4
	});

	

	
	var Columna_Field = new sap.ui.table.Column({
        label: new sap.ui.commons.Label({text: ""}),
        template: new sap.ui.commons.TextView().bindText("FIELD"),
        width:"20%"
	});
	
	Tabla_Stores.addColumn(Columna_Field);
	
	var Columna_Value = new sap.ui.table.Column({
        label: new sap.ui.commons.Label({text: ""}),
        template: new sap.ui.commons.TextView().bindText("VALUE"),
        width:"20%"
	});
	
	Tabla_Stores.addColumn(Columna_Value);
	
	
	Tabla_Stores.setModel(oModel_Stores);
	Tabla_Stores.bindRows("/");
	
	var Bar_Stores = new sap.viz.ui5.Bar({
		width : "400px",
		height : "200px",
		plotArea : {
		},
		title : {
			visible : true,
			text : 'Aggregations from selected stores'
		},
		dataset :  new sap.viz.ui5.data.FlattenedDataset({

			dimensions : [ 
				{
					axis : 1, 
					name : 'Field', 
					value : "{FIELD}"
				} 
			],

			measures : [ 
				{
					name : 'Value', 
					value : '{VALUE_NUM}'  
				}
			],
			
			data : {
				path : "/"
			}
			
		})
	});

	Bar_Stores.setModel(oModel_Stores);
	Bar_Stores.getXAxis().setVisible(false);
	Bar_Stores.getLegend().setVisible(false);
	Bar_Stores.getDataLabel().setFormatString([["$#.##"]]);
	Bar_Stores.getDataLabel().setVisible(true);
	Bar_Stores.getToolTip().setFormatString([["$#.##"]]);
	
	
	
	//CHECKBOXES
	
	
	
	//CHECKBOXES
	
		var oVLayout = new sap.ui.commons.layout.VerticalLayout("hLayout1",{width:'100%',height:'100%'});

		var oParentCheckBox = new sap.ui.commons.TriStateCheckBox("pcb1", {text: "select / deselect all",selectionState:sap.ui.commons.TriStateCheckBoxState.Checked });
		oVLayout.addContent(oParentCheckBox);
		oVLayout.addContent(new sap.ui.commons.HorizontalDivider({height: sap.ui.commons.HorizontalDividerHeight.Small}));
		
		
	
		$.ajax({url:"/mexbalia/Geo_Agg/UI/Services.xsodata/categories",data:{'$format':'json','$orderby':'ID asc'},async:false,success:function(respuesta){
			response = respuesta.d.results;
			aChildren = [];
			for (i in response){

				var newcheck=new sap.ui.commons.CheckBox("ccb"+i.toString(), {text: response[i].CATEGORY,tooltip:response[i].DESCRIPTION,checked:true});
				newcheck.attachChange(function(){categorias_selecc();update_table();});
		aChildren.push(newcheck);	
			
			}
			
			     		for (i = 0; i < aChildren.length; i++){
			     			oVLayout.addContent(aChildren[i]);
			     		}		
			     		registerChildren(aChildren, oParentCheckBox);
			     		categorias_selecc();


		}});
		
		oVPanel = new sap.ui.commons.Panel('PanelCat',{collapsed:true,height:'auto',width:'auto',title:new sap.ui.commons.Title({text:'Select the categories to aggregate'})});
		oVPanel.addContent(oVLayout);
		function panelsize() { 
		oVPanel.setHeight((($('#'+Bar_Stores.getId()).height()).toString()+'px'));
		oVPanel.setWidth(($('#panel_info').width().toString()+'px'));
		Bar_Stores.setWidth(($('#panel_info').width().toString()+'px'));
		if(oVPanel.getCollapsed()){		oVPanel.setCollapsed(true);
}
		};
		$(document).ready(function(){panelsize();
		oVPanel.setCollapsed(true);
		});
		window.onresize=panelsize;


 
	
	//CHECKBOXES
	
	var Table_Layout = new sap.ui.commons.layout.VerticalLayout("Layout1", {
        content: [Bar_Stores,oVPanel]
});
	
	
Table_Layout.placeAt('panel_info');
