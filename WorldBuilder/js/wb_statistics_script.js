// JavaScript Document
$(function(){
    //If user choose event option, statistics charts will be renewed (as a whole)
    $('select[name="event_options"]').change(function(){
        //format the option and clear privious options
        update_Sta_Graph();
    })
    
});
    
function update_Sta_Graph(){
    //Summary
    //Total words is the number of .claws7_text (or .claws7_pos) excluding punctuations.
    var totalWords=$('.claws7_pos[punctuation="FALSE"]').length;
    $('#total_words').text(totalWords);
    //Total sentences
    var totalSen=$('.sentenceDiv').length;
    $('#total_sentences').text(totalSen);
    //Average sentence length
    var aveSen=(totalWords/totalSen).toFixed(2);
    $('#average_sentences').text(aveSen);        

    //World
    var phyWorldNum=$('#sorted_WN .list_TWT_node').children('*:nth-child(2)[textWorldType="1"]').length;
    var menWorldNum=$('#sorted_WN .list_TWT_node').children('*:nth-child(2)[textWorldType="2"]').length;

    var world_chart = $("#world_type_gra");
    var data = {
        labels: ["physical/actualized", "mental/modalized"],
        datasets: [{
            label:"Number",
            backgroundColor: ["rgba(153, 255, 153,0.4)", "rgba(26, 102, 255,0.4)"],
            borderColor: ["rgba(153, 255, 153,1)","rgba(26, 102, 255,1)"],
            borderWidth: 1,
            hoverBackgroundColor: ["rgba(153, 255, 153,0.7)","rgba(26, 102, 255,0.7)"],
            hoverBorderColor: ["rgba(153, 255, 153,1)","rgba(26, 102, 255,1)"],
            //data: [phyWorldNum,menWorldNum]
            data: [phyWorldNum,menWorldNum]
            }]   
        };
    var options = {
        maintainAspectRatio: true,
        responsive:false,
        scales: {
            yAxes: [{ticks:{beginAtZero:true}}],
            xAxes: [{barPercentage: 0.5}],
            },
        legend: {display: false},
        title:{
            display:true,
            position:'bottom',
            text:'Type of text-worlds',
            fontSize:16
        }
        };
    var myChart = new Chart(world_chart, {
        type: 'bar',
        data: data,
        options: options
    });
    
    //WS
    var ws_sNum=$('.WS_1').length;
    var ws_tNum=$('.WS_2').length;
    var ws_eNum=$('.WS_3').length;
    var ws_aNum=$('.WS_4').length; 

    var ws_chart = $('#world_switch_type_gra');
    var data = {
        labels: ["Spatial", "Temporal", "Epistemic", "Attitudinal"],
        datasets: [{
            label:"Number",
            backgroundColor: ["rgba(170, 170, 170,0.4)", "rgba(68, 68, 68,0.4)" , "rgba(26, 102, 255,0.4)", "rgba(153, 187, 255,0.4)"],
            borderColor: ["rgba(170, 170, 170,1)", "rgba(68, 68, 68,1)", "rgba(26, 102, 255,1)", "rgba(153, 187, 255,1)"],
            borderWidth: 1,
            hoverBackgroundColor: ["rgba(170, 170, 170,0.7)","rgba(68, 68, 68,0.7)","rgba(26, 102, 255,0.7)","rgba(153, 187, 255,0.7)"],
            hoverBorderColor: ["rgba(170, 170, 170,1)","rgba(68, 68, 68,1)","rgba(26, 102, 255,1)","rgba(153, 187, 255,1)"],
            //data: [ws_sNum,ws_tNum,ws_eNum,ws_aNum]
            data: [ws_sNum,ws_tNum,ws_eNum,ws_aNum]
            }]   
        };
    var options = {
        maintainAspectRatio: true,
        responsive:false,
        scales: {
            yAxes: [{ticks:{beginAtZero:true}}],
            xAxes: [{barPercentage: 0.5}],
            },
        legend: {display: false},
        title:{
            display:true,
            position:'bottom',
            text:'Type of world-switches',
            fontSize:16
        }
        };
    var myChart = new Chart(ws_chart, {
        type: 'bar',
        data: data,
        options: options
    });
    
    
    
    //Event
    var title='';
    var event1=0;
    var event2=0;
    var event3=0;
    var event4=0;
    //update world index number in the menu

    //Option 1
    //<span class="event_node" worldid="-1" eventid="1" event_type="1" event_tense="1" eventcomments="" startsenid="4" endsenid="4" startwordid="81" endwordid="83"><img src="icons/annotation_list_event_1.png" alt="event node"></span>
    //<span class="world_node" worldid="2" worldtype="2" textworldtype="1" worldcomments="" startsenid="2" endsenid="2" startwordid="31" endwordid="37">2</span>
    if($('select[name="event_options"]').val()==='1'){
        title='(Event) process types in the whole text';
        event1=$('.event_node[event_type="1"]:not([worldid="-1"])').length;
        event2=$('.event_node[event_type="2"]:not([worldid="-1"])').length;
        event3=$('.event_node[event_type="3"]:not([worldid="-1"])').length;
        event4=$('.event_node[event_type="4"]:not([worldid="-1"])').length;
    }
    if($('select[name="event_options"]').val()==='2'){
        title='(Event) process types embedded within TW-physical';
        //get physical world IDs and use it to target the event under physical world
        $('#sorted_WN .list_TWT_node').children('*:nth-child(2)[textWorldType="1"]').each(function(){
            var phyID=$(this).attr('worldID');
            event1=event1+$('.event_node[event_type="1"]').filter('[worldID="'+phyID+'"]').length;
            event2=event2+$('.event_node[event_type="2"]').filter('[worldID="'+phyID+'"]').length;
            event3=event3+$('.event_node[event_type="3"]').filter('[worldID="'+phyID+'"]').length;
            event4=event4+$('.event_node[event_type="4"]').filter('[worldID="'+phyID+'"]').length;
        });
    }
    if($('select[name="event_options"]').val()==='3'){
        title='(Event) process types embedded within TW-mental';
        $('#sorted_WN .list_TWT_node').children('*:nth-child(2)[textWorldType="2"]').each(function(){
            var menID=$(this).attr('worldID');
            event1=event1+$('.event_node[event_type="1"]').filter('[worldID="'+menID+'"]').length;
            event2=event2+$('.event_node[event_type="2"]').filter('[worldID="'+menID+'"]').length;
            event3=event3+$('.event_node[event_type="3"]').filter('[worldID="'+menID+'"]').length;
            event4=event4+$('.event_node[event_type="4"]').filter('[worldID="'+menID+'"]').length;
        });
    }
    if(Number($('select[name="event_options"]').val())>3){
        var w_index=Number($('select[name="event_options"]').val())-3;
        title='(Event) process types embedded within TW #'+w_index;
        event1=$('.event_node[event_type="1"]').filter('[worldID="'+w_index+'"]').length;
        event2=$('.event_node[event_type="2"]').filter('[worldID="'+w_index+'"]').length;
        event3=$('.event_node[event_type="3"]').filter('[worldID="'+w_index+'"]').length;
        event4=$('.event_node[event_type="4"]').filter('[worldID="'+w_index+'"]').length;
    }



    var w_e_chart = $('#world_event_type_gra');
    var data = {
        labels: ["Material", "Relational", "Verbal", "Mental"],
        datasets: [{
            label:"Number",
            backgroundColor: ["rgba(153, 255, 153,0.4)" , "rgba(255, 128, 128,0.4)", "rgba(255, 194, 102,0.4)","rgba(26, 102, 255,0.4)"],
            borderColor: ["rgba(153, 255, 153,1)", "rgba(255, 128, 128,1)", "rgba(255, 194, 102,1)", "rgba(26, 102, 255,1)"],
            borderWidth: 1,
            hoverBackgroundColor: ["rgba(153, 255, 153,0.7)","rgba(255, 128, 128,0.7)","rgba(255, 194, 102,0.7)","rgba(26, 102, 255,0.7)"],
            hoverBorderColor: ["rgba(153, 255, 153,1)","rgba(255, 128, 128,1)","rgba(255, 194, 102,1)", "rgba(26, 102, 255,1)"],
            //data: [ws_sNum,ws_tNum,ws_eNum,ws_aNum]
            data: [event1,event2,event3,event4]
            }]   
        };
    var options = {
        maintainAspectRatio: true,
        responsive:false,
        scales: {
            yAxes: [{ticks:{beginAtZero:true}}],
            xAxes: [{barPercentage: 0.5}],
            },
        legend: {display: false},
        title:{
            display:true,
            position:'bottom',
            text: title,
            fontSize:16
        }
        };
    var myChart = new Chart(w_e_chart, {
        type: 'bar',
        data: data,
        options: options
    });


    }
