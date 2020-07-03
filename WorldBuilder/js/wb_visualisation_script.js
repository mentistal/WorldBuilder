// JavaScript Document

$(function(){
    d3.select("body").on("touchstart", nozoom).on("touchmove", nozoom);
    
    $('#system_menu_visualisation').click(function(){
        update_Vis_Graph();        
    });
});

function nozoom() {
    d3.event.preventDefault();
}

function clicked(d, i) {
    if (d3.event.defaultPrevented) return; // dragged
    //click to show or hide the extend node
    var style = d3.select(this).select('.extent_world').attr('style');
    if (style==='display:none'){d3.select(this).select('.extent_world').attr('style','display:block');}
    if (style==='display:block'){d3.select(this).select('.extent_world').attr('style','display:none');}
    
}

var initial_size = 100;//the size of the world nodes

function draw_arrows(){
    //clear the old lines first
    $('line').remove();
    $('defs').remove();
    var svgContainer = d3.select("#vis_area");
    //Define arrowhead
    //Discourse arrow (black)
    var d_colour='black';
    svgContainer.append('defs').append('marker')
        .attr('id','black_arrow')
        .attr('markerWidth',10).attr('markerHeight',10)
        .attr('refX',22).attr('refY',2)
        .attr('orient','auto')
        .attr('markerUnits','strokeWidth')
        .append('path').attr('d',"M0,0 L0,4 L6,2 z").attr('fill',d_colour);
    //Spatial arrow (blue)
    var s_colour='#aaaaaa';
    svgContainer.append('defs').append('marker')
        .attr('id','blue_arrow')
        .attr('markerWidth',10).attr('markerHeight',10)
        .attr('refX',22).attr('refY',2)
        .attr('orient','auto')
        .attr('markerUnits','strokeWidth')
        .append('path').attr('d',"M0,0 L0,4 L6,2 z").attr('fill',s_colour);
    //temporal arrow (green)
    var t_colour='#444444'
    svgContainer.append('defs').append('marker')
        .attr('id','green_arrow')
        .attr('markerWidth',10).attr('markerHeight',10)
        .attr('refX',22).attr('refY',2)
        .attr('orient','auto')
        .attr('markerUnits','strokeWidth')
        .append('path').attr('d',"M0,0 L0,4 L6,2 z").attr('fill',t_colour);
    //Epistemic arrow (red)
     var e_colour='#1a66ff'
    svgContainer.append('defs').append('marker')
        .attr('id','red_arrow')
        .attr('markerWidth',10).attr('markerHeight',10)
        .attr('refX',22).attr('refY',2)
        .attr('orient','auto')
        .attr('markerUnits','strokeWidth')
        .append('path').attr('d',"M0,0 L0,4 L6,2 z").attr('fill',e_colour);
    //Attitudinal arrow (pink)
     var a_colour='#99bbff'
    svgContainer.append('defs').append('marker')
        .attr('id','pink_arrow')
        .attr('markerWidth',10).attr('markerHeight',10)
        .attr('refX',22).attr('refY',2)
        .attr('orient','auto')
        .attr('markerUnits','strokeWidth')
        .append('path').attr('d',"M0,0 L0,4 L6,2 z").attr('fill',a_colour);
    
    //Get WS inforomation
    //Always start from discouser World
    var cx1=$('#w0').attr('cx');
    var cy1=$('#w0').attr('cy');
    var cx2=$('#w1').attr('cx');
    var cy2=$('#w1').attr('cy');
    svgContainer.insert("line",":first-child").attr('x1',cx1).attr('y1',cy1).attr('x2',cx2).attr('y2',cy2).attr('stroke',d_colour).attr('stroke-width',3).attr('marker-end','url(#black_arrow)');
    
    
    //Draw text world arrows
    var counter=0;//count how many WSs are defined from world A to B, especially for spatial and temporal WS
    $('[fromWorldID]').each(function(){
        //Get WS inforomation
        var ws_from=$(this).attr('fromWorldID');
        var ws_to=$(this).parent().children(':last-child').attr('toWorldID');
        var ws_type= [''];
        if ($(this).parent().children().hasClass('WS_1')){counter++;ws_type.push('#blue_arrow');}            
        if ($(this).parent().children().hasClass('WS_2')){counter++;ws_type.push('#green_arrow');}
        if ($(this).parent().children().hasClass('WS_3')){counter++;ws_type.push('#red_arrow');}
        if ($(this).parent().children().hasClass('WS_4')){counter++;ws_type.push('#pink_arrow');}
    
        cx1=Number($('#w'+ws_from+'').attr('cx'));
        cy1=Number($('#w'+ws_from+'').attr('cy'));
        var xlength=(Number($('#w'+ws_to+'').attr('cx'))-Number($('#w'+ws_from+'').attr('cx')))/counter;
        var ylength=(Number($('#w'+ws_to+'').attr('cy'))-Number($('#w'+ws_from+'').attr('cy')))/counter;
        cx2=cx1+xlength;
        cy2=cy1+ylength;
        if ((cx1===cx2)&&(cy1===cy2)){}
        else{
            for (var i=1; i<=counter; i++)
                {
                    if (ws_type[i]==='#blue_arrow'){
                        svgContainer.insert("line",":first-child").attr('x1',cx1).attr('y1',cy1).attr('x2',cx2).attr('y2',cy2).attr('stroke',s_colour).attr('stroke-width',3).attr('marker-end','url('+ws_type[i]+')');                    
                    }
                    if (ws_type[i]==='#green_arrow'){
                        svgContainer.insert("line",":first-child").attr('x1',cx1).attr('y1',cy1).attr('x2',cx2).attr('y2',cy2).attr('stroke',t_colour).attr('stroke-width',3).attr('marker-end','url('+ws_type[i]+')');                    
                    }
                    if (ws_type[i]==='#red_arrow'){
                        svgContainer.insert("line",":first-child").attr('x1',cx1).attr('y1',cy1).attr('x2',cx2).attr('y2',cy2).attr('stroke',e_colour).attr('stroke-width',3).attr('marker-end','url('+ws_type[i]+')');                    
                    }
                    if (ws_type[i]==='#pink_arrow'){
                        svgContainer.insert("line",":first-child").attr('x1',cx1).attr('y1',cy1).attr('x2',cx2).attr('y2',cy2).attr('stroke',a_colour).attr('stroke-width',3).attr('marker-end','url('+ws_type[i]+')');                    
                    }
                    cx1=cx2;
                    cy1=cy2;
                    cx2=cx1+xlength;
                    cy2=cy1+ylength;

                }            
        }
        
        counter=0;//reset counter for the next step
    });
    
    
    
}

function update_Vis_Graph(){   
    var svgContainer = d3.select("#vis_area");
    
    //Setup drag behavior for the object
    var transX=0;
    var transY=0;
    var cx=0;
    var drag = d3.behavior.drag()
    .on("dragstart", function() {
        transX=0+Number(d3.select(this).attr('memo_transX'));
        transY=0+Number(d3.select(this).attr('memo_transY'));
        cx = Number(d3.select(this).attr('cx'));
        cy = Number(d3.select(this).attr('cy'));
    })
    .on("drag",function(){        
        transX=transX+d3.event.dx;
        transY=transY+d3.event.dy; 
        cx=cx+d3.event.dx;
        cy=cy+d3.event.dy;
        d3.select(this).attr("transform", function(d,i){return "translate(" + [transX,transY] + ")"})
                       .attr('cx',cx).attr('cy',cy);
        
        //Renew arrows        
        draw_arrows();
    })
    .on("dragend",function(){
        d3.select(this).attr('memo_transX',''+transX+'');
        d3.select(this).attr('memo_transY',''+transY+'');
    });
    
    //clear the drawing history
    $('#vis_area').html('');    
    
    //Build up initial graph
    var worldNum =  $('#sorted_WN .world_node').length;
    $('#sorted_WN .world_node').each(function(){
        var currentWorld=$(this);
        var world_type='';
        var label='';
       
        label=currentWorld.next().text();
        if (label!=='Discourse World'){
            label=label.substr(label.indexOf(' ')+1);
            label=' Sentence #'+label
            label='TW #'+currentWorld.attr('worldID')+label;
        }
        //add world attrbute
        if (currentWorld.attr('worldType')==='1'){world_type="discourse";}
        if (currentWorld.attr('textWorldType')==='1'){world_type="physical";}
        if (currentWorld.attr('textWorldType')==='2'){world_type="mental";}
        
        
        var currentforeignObject = svgContainer.append('svg:foreignObject')
            .attr('class','dragable')
            .attr('id','w'+currentWorld.attr('worldID')+'')
            .attr('x',0).attr('y',0).attr('cx',0).attr('cy',0)
            .attr('width',initial_size).attr('height',initial_size)
            .on("click", clicked);
        currentforeignObject.append('xhtml:div').attr('class','initial_world i_'+world_type+'')
            .attr('style','width:'+(initial_size*0.8)+'px; height:'+(initial_size*0.8)+'px; border-radius:'+initial_size+'px;')
            .text(label);
        
        //Build extent world list
        //get list information
        var list_items_html_script='';
        $('.list_TWT_node [worldID='+currentWorld.attr('worldID')+']:not(.world_node)').each(function(){
            list_items_html_script=list_items_html_script+'<div class="vis_list_item">'+$(this).parent().html()+'</div>';
        });
        
        currentforeignObject.append('xhtml:div')
            .attr('class','extent_world e_'+world_type+'')
            .attr('style','display:none')
            .text(label)
            .append('xhtml:div').attr('class','vis_list_container')
            .html(list_items_html_script);
        
    });   
    //Build up initial location for each node
    var working_space_height_str = $("#visualisation_area").css("height");
    var working_space_height = Number(working_space_height_str.substring(0,working_space_height_str.indexOf("px")));
    var working_space_width_str = $("#visualisation_area").css("width");
    var working_space_width = Number(working_space_width_str.substring(0,working_space_width_str.indexOf("px")));
    //take the smaller page size parameters as the length of R
    var R = 0;
    if (working_space_height>=working_space_width){R=working_space_width/2;}
    else {R=working_space_height/2;}
    //margin for R (or check CSS width of the .world_initial)
    var R_margin = initial_size;
    R = R-R_margin;
    var unitAngle=(2*Math.PI)/worldNum;
    for (var i=0; i<worldNum; i++){
        var x0=Math.cos(unitAngle*i+Math.PI)*R;
        var y0=Math.sin(unitAngle*i+Math.PI)*R;
        var x=x0+(working_space_width/2)-(initial_size/2);
        var y=y0+(working_space_height/2)-(initial_size/2);
        $('#w'+i+'').attr('x',x).attr('y',y).attr('cx',(5+x+initial_size/2)).attr('cy',(5+y+initial_size/2));//add 5 just because text has 10px padding
               
    }   
    
    //Apply drag event
    d3.selectAll('.dragable').call(drag); 
    //Draw initial arraws
    draw_arrows();
}
