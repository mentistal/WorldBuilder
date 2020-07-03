// JavaScript Document
$(function(){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      //do your stuff!
    } else {
      alert('The File APIs are not fully supported by your browser.');
    }
    
    //////////////////////////////////
    //Global varables for annotation//
    //////////////////////////////////
    var twt_menu_variables = {
        w_type:"0",//world type
        tw_type:"0",//text world type
        w_comments:"",//comments for world type annotation
        p_type:"0",//people type
        p_comments:"",//comments for people annotation
		o_check:false,//object?
		o_comments:"",//comments for object annotation
        l_check:false,//location?
        l_comments:"",//comments for location annotation
        t_type:"0",//time type
        t_value:"0",//time value
        t_comments:"",//comments for time annotation
        e_type:"0",//event type
        e_tense:"0",//event value
        e_comments:"",//comments for event annotation
        ws_from:"0",//world switch "from"
        ws_to:"0",//world switch "to"
        ws_s:false,//spatial world switch?
        ws_t:false,//temporal world switch?
        ws_e:false,//epistemic world switch?
        ws_a:false,//Attitudinal world switch?
        ws_comments:""//comments for world switches 
    }; 
    
    /////////////////////////////////
    //World builder function choose//
    /////////////////////////////////
    $('#system_menu_annotaiton').on('click',function(){
        $(this).addClass('system_menu_choose');
        $('#system_menu_statistics').removeClass('system_menu_choose');
        $('#system_menu_visualisation').removeClass('system_menu_choose');
        $('#annotation_area').css('visibility', 'visible');
        $('#statistics_area').css('visibility', 'hidden');
        $('#visualisation_area').css('visibility', 'hidden');
    });
    $('#system_menu_statistics').on('click',function(){
        $(this).addClass('system_menu_choose');
        $('#system_menu_annotaiton').removeClass('system_menu_choose');
        $('#system_menu_visualisation').removeClass('system_menu_choose');
        $('#annotation_area').css('visibility', 'hidden');
        $('#statistics_area').css('visibility', 'visible');
        $('#visualisation_area').css('visibility', 'hidden');
        update_Sta_Graph();
        
    });
    $('#system_menu_visualisation').on('click',function(){
        $(this).addClass('system_menu_choose');
        $('#system_menu_statistics').removeClass('system_menu_choose');
        $('#system_menu_annotaiton').removeClass('system_menu_choose');
        $('#annotation_area').css('visibility', 'hidden');
        $('#statistics_area').css('visibility', 'hidden');
        $('#visualisation_area').css('visibility', 'visible');
        
    });


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //The full screen interface need to adjust certain contents (especially jQuery UI elements) if resize the window.//
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //SYSTEM PARAMETERS (DO NOT CHANGE)
    var working_space_height_str = $("#working_interface").css("height");
    var working_space_height = Number(working_space_height_str.substring(0,working_space_height_str.indexOf("px"))); 
    var working_space_width_str = $("#working_interface").css("width");
    var working_space_width = Number(working_space_width_str.substring(0,working_space_width_str.indexOf("px"))); 

    //full screen layout initialisation of annotaiton right side list menu 
    //40 is the height of the title bar. since the height of the right hand menu area is 100%, which is actrally the size of the window. the height is 100%-40px.     
    $("#list_box").css("height",working_space_height-40);
    $("#accordion").accordion({heightStyle: "fill"});
    //380 is the width sum of all menu area. since the width of the menu area is fixed, but the annotaiton area is 100%, but the actral width of the annotation area s 100%-(160+20+200)px. 
    //full screen layout initialisation for annotaton area
    $("#annotation_area").css("height",working_space_height-40).css("width",working_space_width-380);
    $('#statistics_area').css("height",working_space_height-40).css("width",working_space_width-380);
    $('#visualisation_area').css("height",working_space_height-40).css("width",working_space_width-380);

    //full screen adjust of the working area elements, e.g. annotaiton area and right side list menu 
    $(document).ready(function(){
        $(window).resize(function(){
            $("#list_box").css("height","100%");
            $("#annotation_area").css("height","100%").css("width","100%");
            $('#statistics_area').css("height","100%").css("width","100%");
            $('#visualisation_area').css("height","100%").css("width","100%");
            
            working_space_height_str = $("#working_interface").css("height");
            working_space_height = Number(working_space_height_str.substring(0,working_space_height_str.indexOf("px")));
            working_space_width_str = $("#working_interface").css("width");
            working_space_width = Number(working_space_width_str.substring(0,working_space_width_str.indexOf("px"))); 
            //Change the height of the right hand side meun
            $("#list_box").css("height",working_space_height-40);
            $("#accordion").accordion("refresh");
            
            //This area #top_left_corner is used as a indicator for debug
            //$("#top_left_corner").text(working_space_height);
            
            //Chane the height and width of the annotaton area
            $("#annotation_area").css("height",working_space_height-40).css("width",working_space_width-380);
            $('#statistics_area').css("height",working_space_height-40).css("width",working_space_width-380);
            $('#visualisation_area').css("height",working_space_height-40).css("width",working_space_width-380);
            
        });
    });   
    
    //////////////////////////////////////////////
    //Read Text/XML file to the operation window//
    //////////////////////////////////////////////
    var fileDisplay = document.getElementById('annotation_area');
    var raw_text='';
    window.onload = function() {
		var txt_fileInput = document.getElementById('text_files');
        var xml_fileInput = document.getElementById('xml_files');
		txt_fileInput.addEventListener('change', function() {
			var txt_file = txt_fileInput.files[0];
			var textType = /text.*/;
            if (txt_file.type.match(textType)) {
				var txt_reader = new FileReader();
				txt_reader.onload = function () {
                    $('#sorted_WN').children().remove();
                    $('#sorted_WN').append('<div id="list_add_w_button"><a href="#"><img src="icons/annotation_list_add_world.png" alt="World"/><span class="popup_content_text" style="left:0px">Add Discourse World Node</span></a></div>');
                    $('#sorted_WS').children().remove();
                    $('#sorted_WS').append('<div id="list_add_ws_button"><a href="#"><img src="icons/annotation_list_add_ws.png" alt="World Switch"/><span class="popup_content_text">Add World Switch</span></a></div>');
                    $('#annotation_area').children().remove();
				    raw_text = txt_reader.result;
				    fileDisplay.innerHTML = ('<div id=annotation_text>' + raw_text + '</div>');
                    claws7_style(); //Stylish the text
                    $('#annotation_text').remove(); //remove raw_text form interface.
                    $('.sentenceDiv:odd').css('background-color','#F5F5F5');//use alternative colour to distinguish sentences
                    $('#pos_filter_options').trigger('click');//In case user choose pos filter before open the file. The filter will be fouced to run when load the file
					};
                txt_reader.readAsText(txt_file);               
            }            	
			else {
				alert("File is not supported!");
			}
		});
        xml_fileInput.addEventListener('change',function(){
            var xml_file = xml_fileInput.files[0];
            var xmlType = /xml.*/;
            if (xml_file.type.match(xmlType)){
                var xml_reader = new FileReader();
                xml_reader.onload = function(){
                    raw_text = xml_reader.result;
                    //Put TWT nodes into #sortedWN
                    $('#sorted_WN').children().remove();
                    $('#sorted_WN').append('<div id="list_add_w_button"><a href="#"><img src="icons/annotation_list_add_world.png" alt="World"/><span class="popup_content_text" style="left:0px">Add Discourse World Node</span></a></div>');
                    var text_segment_start=raw_text.indexOf('<div class="list_TWT_node">');
                    var text_segment_end=raw_text.indexOf('</w_code>');
                    var twt_node_code=''
                    if (text_segment_start!==-1){twt_node_code=raw_text.substr(text_segment_start,(text_segment_end-text_segment_start));}
                    $('#sorted_WN').append(twt_node_code);                    
                    
                    //Put WS nodes into #sortedWS
                    $('#sorted_WS').children().remove();
                    $('#sorted_WS').append('<div id="list_add_ws_button"><a href="#"><img src="icons/annotation_list_add_ws.png" alt="World Switch"/><span class="popup_content_text">Add World Switch</span></a></div>');
                    text_segment_start=raw_text.indexOf('<div class="list_TWT_WS">');
                    text_segment_end=raw_text.indexOf('</ws_code><text>');
                    var twt_ws_code='';
                    if (text_segment_start!==-1){twt_ws_code = raw_text.substr(text_segment_start,(text_segment_end-text_segment_start));}                    
                    $('#sorted_WS').append(twt_ws_code);
                    
                    //Put annotation text into #annotation_area
                     $('#annotation_area').children().remove();
                    text_segment_start=raw_text.indexOf('<div class="sentenceDiv');
                    text_segment_end=raw_text.indexOf('</text>');
                    var annotation_text = raw_text.substr(text_segment_start,(text_segment_end-text_segment_start));
                    $('#annotation_area').html(annotation_text);
                    
                    sortNode();
                };
                xml_reader.readAsText(xml_file);
            }
            else{
                alert("File is not supported!");
            }
        });
    };
    
    function claws7_style () {
        $(fileDisplay).append('<div class = "sentenceDiv"><span class = "sentenceNum">1</span><span class = "sentenceTXT"></span></div>');
        var oldID=2; //use to distingush the end of one sentence
        var wordID = 1;//use to identify the index number of each word
        $('w').each(function(){
            var senID = Number($(this).attr('id').substr(0,$(this).attr('id').indexOf('.')));
			var pos = $(this).attr('pos');
            //Put each sentence into differet sentenceDiV. Each word (claws7_text) has the claws 7 tags (claws7_pos) above. The pair of a tag and the word is used to build a clasw_unit.  
            //using CSS class UP_* to style different claws7 by using the first character of POS, We use two level of Claws 7 infomation. 
            //POS1_X is the major category, POS2_XX is the more specified categroy. 
            
            //It is a new sentence
            if (oldID!==senID) {
                //Since claws7_unit is used for sensing the selected words (the fired area for mouseup event). But at the end of a sentence, based on users habit, such as keep drag mouse even it is  the end of the sentence, the fire area is not long enough to get the users moouseup event. In this case, at end of each sentence, a longer claws7_unit is added.
                $('.claws7_unit:last').attr('endOfSen','TRUE');                
                
                //It is a new sentence
                $(fileDisplay).append('<div class = "sentenceDiv"><span class = "sentenceNum">'+(senID-1)+'</span><span class = "sentenceTXT"></span></div>');
            }
            oldID=senID;
            
            $('.sentenceTXT:last').append('<div class="claws7_unit"  senID="'+(senID-1)+'" wordID="'+wordID+'" endOfSen="FALSE"><div class="claws7_pos POS1_'+pos.substr(0,1)+' POS2_'+pos.substr(0,2)+'" punctuation="FALSE">'+pos+'</div><div  class="claws7_text"  >'+$(this).text()+'</div></div>');
            wordID++;
          
            //The current pos is a punctuation
            //Claws7 doesn't mark any punctuation. In this case the POS1_X equal to POS2_X.
            //Use CSS to hide punctuation
            if (pos.substr(0,1)===pos.substr(0,2)){
                $('.claws7_pos:last').attr('punctuation','TRUE');
            }                       
        });
        $('.claws7_unit:last').attr('endOfSen','TRUE'); //Since the very last endOfSen flag cannot be added in the loop. It is added manually here
    }
    
    //////////////////////////////////////////
    //POS filtering function for annotation //
    //////////////////////////////////////////   
    $('#pos_filter_options').click(function(){
        //check clickboxes value
        var filter_n = $('#filter_n').prop('checked');
        var filter_v = $('#filter_v').prop('checked');
        var filter_p = $('#filter_p').prop('checked');
        var filter_m = $('#filter_m').prop('checked');
        var filter_other = $('#filter_other').prop('checked');
        //Change annotaion interface: show or hide the pos
        pos_visual_filter (filter_n,filter_v,filter_p,filter_m,filter_other);
    });
    
    function pos_visual_filter (filter_n,filter_v,filter_p,filter_m,filter_other){
        //set CSS visibilty to visible or hiddern in order to control the POS interface
        if (filter_n) {$('.POS1_N').css('visibility','visible');}
        else {$('.POS1_N').css('visibility','hidden');}
        
        if (filter_v) {$('.POS1_V').css('visibility','visible');}
        else {$('.POS1_V').css('visibility','hidden');}
        
        if (filter_m) {$('.POS1_M').css('visibility','visible');}
        else {$('.POS1_M').css('visibility','hidden');}
        
        if (filter_p) {
            $('.POS1_P').css('visibility','visible');
            $('.POS2_AP').css('visibility','visible');
        }
        else {
            $('.POS1_P').css('visibility','hidden');
            $('.POS2_AP').css('visibility','hidden');
        }
        
        if(filter_other){$('.claws7_pos:not(.POS1_N, .POS1_V, .POS1_M, .POS1_P, .POS2_PN, [punctuation=TRUE])').css('visibility','visible');}
        else {$('.claws7_pos:not(.POS1_N, .POS1_V, .POS1_M, .POS1_P, .POS2_AP, [punctuation=TRUE])').css('visibility','hidden');}            
    }
    $('#marks_filter_options').click(function(){
        //check clickboxes value
        var filter_world_1 = $('#filter_world_1').prop('checked');
        var filter_world_2 = $('#filter_world_2').prop('checked');
        var filter_location = $('#filter_locaiton').prop('checked');
		var filter_object = $('#filter_object').prop('checked');
        var filter_people = $('#filter_people').prop('checked');
        var filter_time = $('#filter_time').prop('checked');
        var filter_event_1 = $('#filter_event_1').prop('checked');
        var filter_event_2 = $('#filter_event_2').prop('checked');
        var filter_event_3 = $('#filter_event_3').prop('checked');
        var filter_event_4 = $('#filter_event_4').prop('checked');
        //Filter the mark and listed items
        if (filter_world_1){
            $('[class^="sentenceDiv tw_type_1"]').attr('class', 'sentenceDiv tw_type_1');
            $('.world_node[textWorldType="1"]').parent().css('display','block');
        }
        else{
            $('[class^="sentenceDiv tw_type_1"]').attr('class', 'sentenceDiv tw_type_1_hidden');
            $('.world_node[textWorldType="1"]').parent().css('display','none');
        }
        
        if (filter_world_2){
            $('[class^="sentenceDiv tw_type_2"]').attr('class', 'sentenceDiv tw_type_2');
            $('.world_node[textWorldType="2"]').parent().css('display','block');
        }
        else{
            $('[class^="sentenceDiv tw_type_2"]').attr('class', 'sentenceDiv tw_type_2_hidden');
            $('.world_node[textWorldType="2"]').parent().css('display','none');
        }
        
        if(filter_people){
            $('[class^="claws7_unit people_marked"]').attr('class','claws7_unit people_marked');
            $('.people_node').parent().css('display','block');
        }
        else{
            $('[class^="claws7_unit people_marked"]').attr('class','claws7_unit people_marked_hidden');
            $('.people_node').parent().css('display','none');
        }
		
		if(filter_object){
            $('[class^="claws7_unit object_marked"]').attr('class','claws7_unit object_marked');
            $('.object_node').parent().css('display','block');
        }
        else{
            $('[class^="claws7_unit object_marked"]').attr('class','claws7_unit object_marked_hidden');
            $('.object_node').parent().css('display','none');
        }
        
        if(filter_location){
            $('[class^="claws7_unit location_marked"]').attr('class','claws7_unit location_marked');
            $('.location_node').parent().css('display','block');
        }
        else{
            $('[class^="claws7_unit location_marked"]').attr('class','claws7_unit location_marked_hidden');
            $('.location_node').parent().css('display','none');
        }

        
        if(filter_time){
            $('[class^="claws7_unit time_marked"]').attr('class','claws7_unit time_marked');
            $('.time_node').parent().css('display','block');
        }
        else{
            $('[class^="claws7_unit time_marked"]').attr('class','claws7_unit time_marked_hidden');
            $('.time_node').parent().css('display','none');
        }
        
        if(filter_event_1){
            $('[class^="claws7_unit event_marked_1"]').attr('class','claws7_unit event_marked_1');
            $('.event_node[event_type="1"]').parent().css('display','block');
        }
        else{
            $('[class^="claws7_unit event_marked_1"]').attr('class','claws7_unit event_marked_1_hidden');
            $('.event_node[event_type="1"]').parent().css('display','none');
        }
        
        if(filter_event_2){
            $('[class^="claws7_unit event_marked_2"]').attr('class','claws7_unit event_marked_2');
            $('.event_node[event_type="2"]').parent().css('display','block');
        }
        else{
            $('[class^="claws7_unit event_marked_2"]').attr('class','claws7_unit event_marked_2_hidden');
            $('.event_node[event_type="2"]').parent().css('display','none');
        }
        
        if(filter_event_3){
            $('[class^="claws7_unit event_marked_3"]').attr('class','claws7_unit event_marked_3');
            $('.event_node[event_type="3"]').parent().css('display','block');
        }
        else{
            $('[class^="claws7_unit event_marked_3"]').attr('class','claws7_unit event_marked_3_hidden');
            $('.event_node[event_type="3"]').parent().css('display','none');
        }
        
        if(filter_event_4){
            $('[class^="claws7_unit event_marked_4"]').attr('class','claws7_unit event_marked_4');
            $('.event_node[event_type="4"]').parent().css('display','block');
        }
        else{
            $('[class^="claws7_unit event_marked_4"]').attr('class','claws7_unit event_marked_4_hidden');
            $('.event_node[event_type="4"]').parent().css('display','none');
        }
    });
    
    //////////////////////////////////////////
    //Annotation selection with popup menus //
    //////////////////////////////////////////
    //For annotation
    var startSenID=0;
    var startWordID=0;
    var endSenID=0;
    var endWordID=0;
    //For popup meun
    var mouseUpPositionX=0;
    var mouseUpPositionY=0;
    
    var annotation_space_width = working_space_width-380;
    var annotation_space_height = working_space_height-40;
    
    var down_mouseUpPositionX=0;//used for block popup menu if user only click the mouse the position wont change
    var down_mouseUpPositionY=0;//used for block popup menu if user only click the mouse the position wont change
    
    var popupMenuSizeX = Number($('#TWT_annotation_popup_menu_wrap').css('width').substr(0,$('#TWT_annotation_popup_menu_wrap').css('width').indexOf('px')));
    var popupMenuSizeY = Number($('#TWT_annotation_popup_menu_wrap').css('height').substr(0,$('#TWT_annotation_popup_menu_wrap').css('height').indexOf('px')));
    
    //use on funciton to fire events of dynamic generated object
    $('#annotation_area').on('mousedown','.claws7_unit', function(){
        startSenID = Number($(this).attr('senID'));
        startWordID = Number ($(this).attr('wordID'));
        
        //relocate the menu
        $('#root_dl-menu').removeClass('dl-subview');
        $('.dl-subviewopen').removeClass('dl-subviewopen');
        clearTWTAnnotaitonForm();
        kill_popup_menu();
        
        down_mouseUpPositionX=event.pageX;
        down_mouseUpPositionY=event.pageY;
    });

    $('#annotation_area').on('mouseup','.claws7_unit', function(event){
        endSenID = Number($(this).attr('senID'));
        endWordID = Number($(this).attr('wordID'));
                       
        //in case user do not select from smaller position, which makes the start values bigger than end values.
        var temp=0;
        if (startSenID>endSenID) {
            temp=startSenID;
            startSenID=endSenID;
            endSenID=temp;
        }
        if (startWordID>endWordID) {
            temp=startWordID;
            startWordID=endWordID;
            endWordID=temp;
        }
        
        mouseUpPositionX=event.pageX;
        mouseUpPositionY=event.pageY; 
        
        //Only draging the mouse event will fire the popup menu
        if ((mouseUpPositionX!==down_mouseUpPositionX)||(mouseUpPositionY!==down_mouseUpPositionY)){generate_popup_menu(mouseUpPositionX,mouseUpPositionY,'add_node')};

    });
    
    function popup_menu_singlePage(location,mode){
        mouseUpPositionX= working_space_width-popupMenuSizeX;
        mouseUpPositionY=40;
        $('#root_dl-menu').removeClass('dl-subview');
        $('.dl-subviewopen').removeClass('dl-subviewopen');
        clearTWTAnnotaitonForm();
        kill_popup_menu();        
        generate_popup_menu (mouseUpPositionX,mouseUpPositionY,mode);
        popup_menu_locating (location);
        clearTWTAnnotaitonForm();
    }
    
    //Press #list_add_ws_button in the list menu will fire word switch annotiaon popup menu
    $('#sorted_WS').on('click','#list_add_ws_button',function(){
        popup_menu_singlePage ('#ws_popup','add_node');
    });
    
    
    //Press #list_add_w_button in the list meun will fire world annotation popup menu but for discourse world only
    $('#sorted_WN').on('click','#list_add_w_button',function(){
        //the setting means the popup menu is used for generating the discourse wolrd
        startSenID=0;
        startWordID=0;
        endSenID=0;
        endWordID=0;
        generate_popup_menu (working_space_width-popupMenuSizeX,40,'add_node');
    });
    
    // Call dl-menu effects
    $( '#dl-menu' ).dlmenu({animationClasses : { classin : 'dl-animate-in-2', classout : 'dl-animate-out-2' }});
    //Menu is dragable
    $( "#TWT_annotation_popup_menu_wrap" ).draggable();
    
    function generate_popup_menu (mouseUpPositionX,mouseUpPositionY,mode){
        if (mode==='add_node'){
            $('#edit_button').css('display','none');
            $('#confirm_button').css('display','');
        }
        if (mode==='edit_node'){
            $('#edit_button').css('display','');
            $('#confirm_button').css('display','none');
        }
        //generate a new div for the popup menu area
        $('.dl-back').removeClass('dl-back-hidden');
        $('#refresh_button').css('visibility','visible');
        $('#TWT_annotation_popup_menu_wrap').css('visibility','visible');
        //position of the menu need to be renewed. Other CSS styles for the menu are presented in "wb_annotation_interface.css".
        popupMenuPosion(mouseUpPositionX,mouseUpPositionY);        
    }    
    function kill_popup_menu () {
        $('#TWT_annotation_popup_menu_wrap').css('visibility','hidden');
         $('#refresh_button').css('visibility','hidden');
    }    
    function popupMenuPosion(mouseUpPositionX,mouseUpPositionY) {
        var mouseMargin_x = -10;//the position of the menu to the cursor
        var mouseMargin_y = 20;//the position of the menu to the cursor
        
        //var menuPopupOffset_left = 100;//the left boundary to the page that controls the popup location to the cursor
        var menuPopupOffset_right = 100;//the right boundary to the page that controls the popup location to the cursor
        //var menuPopupOffset_top = 100;//the top boundary to the page that controls the popup location to the cursor
        var menuPopupOffset_bottom = annotation_space_height/2;//the bottom boundary to the page that controls the popup location to the cursor

        //By default, the popup location is the bottom right of the cursor
        $('#TWT_annotation_popup_menu_wrap').css('left', (mouseUpPositionX+mouseMargin_x)+'px').css('top', (mouseUpPositionY+mouseMargin_y)+'px');
        
        if (mouseUpPositionX<(annotation_space_width-menuPopupOffset_right) && mouseUpPositionY<(annotation_space_height-menuPopupOffset_bottom)){
            $('#TWT_annotation_popup_menu_wrap').css('left', (mouseUpPositionX+mouseMargin_x)+'px').css('top', (mouseUpPositionY+mouseMargin_y)+'px');
        }
        if (mouseUpPositionX<(annotation_space_width-menuPopupOffset_right) && mouseUpPositionY>(annotation_space_height-menuPopupOffset_bottom)){
            $('#TWT_annotation_popup_menu_wrap').css('left', (mouseUpPositionX+mouseMargin_x)+'px').css('top', (mouseUpPositionY-popupMenuSizeY-mouseMargin_y)+'px');
        }
        if (mouseUpPositionX>(annotation_space_width-menuPopupOffset_right) && mouseUpPositionY>(annotation_space_height-menuPopupOffset_bottom)){
            $('#TWT_annotation_popup_menu_wrap').css('left', (mouseUpPositionX-popupMenuSizeX-mouseMargin_x)+'px').css('top', (mouseUpPositionY-popupMenuSizeY-mouseMargin_y)+'px');
        } 
        if (mouseUpPositionX>(annotation_space_width-menuPopupOffset_right) && mouseUpPositionY<(annotation_space_height-menuPopupOffset_bottom)){
            $('#TWT_annotation_popup_menu_wrap').css('left', (mouseUpPositionX-popupMenuSizeX-mouseMargin_x)+'px').css('top', (mouseUpPositionY+mouseMargin_y)+'px');
        }
    }
    function popup_menu_locating (menu_location){
        
        $(menu_location).parents('li').each(function(){
            $(this).addClass('dl-subview');
        });       
        $('#root_dl-menu').addClass('dl-subview');
        $(menu_location).addClass('dl-subviewopen');
        //Do not allow user to nevagate other part
        $('#refresh_button').css('visibility','hidden');
        $(menu_location+' .dl-back').addClass('dl-back-hidden');
    }
    
    //Press refresh button of the pop menu will reload the menu to the root and clear all the parameters user has put
    $('#refresh_button').on('click',function(){
        $('#root_dl-menu').removeClass('dl-subview');
        $('.dl-subviewopen').removeClass('dl-subviewopen');
        clearTWTAnnotaitonForm();
    });
    //Press cancal button of the popup menu will reload the menu to the root, close the menu and clear all the parameters user has put
    $('#cancel_button').on('click',function(){
        $('#root_dl-menu').removeClass('dl-subview');
        $('.dl-subviewopen').removeClass('dl-subviewopen');
        clearTWTAnnotaitonForm();
        kill_popup_menu();
    });
    
    function clearTWTAnnotaitonForm(){
        $('select[name="w_type"]').val('0');
        $('select[name="tw_type"]').val('0').prop('disabled',true);
        $('textarea[name="w_comments"]').val('');
        $('select[name="p_type"]').val('0');
        $('textarea[name="p_comments"]').val('');
		$('input[id="o_check"]').prop('checked',false);
        $('textarea[name="o_comments"]').val('');
        $('input[id="l_check"]').prop('checked',false);
        $('textarea[name="l_comments"]').val('');
        $('select[name="t_type"]').val('0');
        $('select[name="t_value"]').val('0');
        $('textarea[name="t_comments"]').val('');
        $('select[name="e_type"]').val('0');
        $('select[name="e_tense"]').val('0');
        $('textarea[name="e_comments"]').val('');
        $('select[name="ws_from"]').val('0');
        $('select[name="ws_to"]').val('0');
        $('input[id="ws_s"]').prop('checked',false);
        $('input[id="ws_t"]').prop('checked',false);
        $('input[id="ws_e"]').prop('checked',false);
        $('input[id="ws_a"]').prop('checked',false);
        $('textarea[name="ws_comments"]').val('');
    }
    
    
    //////////////////////////////////////////
    //Add Annotation by using the popup menu//
    //////////////////////////////////////////
    //Enable/disable text world type option in the meun for user
    $('select[name="w_type"]').change(function(){
        if ($('select[name="w_type"]').val()!=='2'){
            //also set text world type to value 0 when it is been disabled
            $('select[name="tw_type"]').val('0');
            $('select[name="tw_type"]').prop('disabled', true);
        }
        else{
            $('select[name="tw_type"]').prop('disabled', false);
        }
    });

    //get annotated text from the users highlights
    //Distinguish annotation content
    //Mark annotated text
    //add annotation nodes in the list 
    
    //Distinguish annotation content:Use flag to indicate which group of the anntation has been added.
    var annotation_flag = {
        w:false,
        p:false,
		o:false,
        l:false,
        t:false,
        e:false,
        ws:false
    }; 
    var annotated_text="";
    $('#confirm_button').on('click',function(){

        //get annotated text, and add space between them
        annotated_text='';//clear the last result
        $('.claws7_text').slice(startWordID-1,endWordID).each(function(){
            annotated_text=annotated_text+$(this).text()+" ";
        });
        
        console.log(annotated_text);
        console.log('choose sentence from ID='+startSenID+' to ID='+endSenID);
        console.log('choose word from ID='+startWordID+' to ID='+endWordID);
        
        //Check the popup menu's values
        popup_menu_to_variable();
        //Distinguish annotation content:Use flag to indicate which group of the anntation has been added.
        which_groups_are_annotated();
        console.log('World?='+annotation_flag.w+' People?='+annotation_flag.p+' Object?='+annotation_flag.o+' Location?='+annotation_flag.l+' Time?='+annotation_flag.t+' Event?='+annotation_flag.e+' WS?='+annotation_flag.ws);
        //Add nodes in the list
        addNode();
        //Add world switches in the list
        addWS();
        //Sort the node order and define the element IDs
        sortNode();
        
        //Then close the menu
        $('#root_dl-menu').removeClass('dl-subview');
        $('.dl-subviewopen').removeClass('dl-subviewopen');
        clearTWTAnnotaitonForm();
        kill_popup_menu();
        
    });
    
    function popup_menu_to_variable(){
        twt_menu_variables.w_type=$('select[name="w_type"]').val();
        twt_menu_variables.tw_type=$('select[name="tw_type"]').val();
        twt_menu_variables.w_comments= $('textarea[name="w_comments"]').val();
        twt_menu_variables.p_type=$('select[name="p_type"]').val();
        twt_menu_variables.p_comments=$('textarea[name="p_comments"]').val();
		twt_menu_variables.o_check=$('input[id="o_check"]').prop('checked');
        twt_menu_variables.o_comments=$('textarea[name="o_comments"]').val();
        twt_menu_variables.l_check=$('input[id="l_check"]').prop('checked');
        twt_menu_variables.l_comments=$('textarea[name="l_comments"]').val();
        twt_menu_variables.t_type=$('select[name="t_type"]').val();
        twt_menu_variables.t_value=$('select[name="t_value"]').val();
        twt_menu_variables.t_comments=$('textarea[name="t_comments"]').val();
        twt_menu_variables.e_type=$('select[name="e_type"]').val();
        twt_menu_variables.e_tense=$('select[name="e_tense"]').val();
        twt_menu_variables.e_comments=$('textarea[name="e_comments"]').val();
        twt_menu_variables.ws_from=$('select[name="ws_from"]').val();
        twt_menu_variables.ws_to=$('select[name="ws_to"]').val();
        twt_menu_variables.ws_s=$('input[id="ws_s"]').prop('checked');
        twt_menu_variables.ws_t=$('input[id="ws_t"]').prop('checked');
        twt_menu_variables.ws_e=$('input[id="ws_e"]').prop('checked');
        twt_menu_variables.ws_a=$('input[id="ws_a"]').prop('checked')
        twt_menu_variables.ws_comments=$('textarea[name="ws_comments"]').val();
    }
    function which_groups_are_annotated(){
        annotation_flag.w = (twt_menu_variables.w_type!=='0')||(twt_menu_variables.tw_type!=='0')||(twt_menu_variables.w_comments!=='');
        annotation_flag.p = (twt_menu_variables.p_type!=='0')||(twt_menu_variables.p_comments!=='');
		annotation_flag.o = (twt_menu_variables.o_check)||(twt_menu_variables.o_comments!=='');
        annotation_flag.l = (twt_menu_variables.l_check)||(twt_menu_variables.l_comments!=='');
        annotation_flag.t = (twt_menu_variables.t_type!=='0')||(twt_menu_variables.t_value!=='0')||(twt_menu_variables.t_comments!=='');
        annotation_flag.e = (twt_menu_variables.e_type!=='0')||(twt_menu_variables.e_tense!=='0')||(twt_menu_variables.e_comments!=='');
        annotation_flag.ws = (twt_menu_variables.ws_from!=='0')||(twt_menu_variables.ws_to!=='0')||(twt_menu_variables.ws_s)||(twt_menu_variables.ws_t)||(twt_menu_variables.ws_e)||(twt_menu_variables.ws_a)||(twt_menu_variables.ws_comments!=='');              
    }
    function addNode() {
        //In addNode funciton, all element ID such as worldID=-1. The ID will be defined after using sorted function, which is easier if user delete one note and the ID should be arragned.
        var addNode_script='';
        var no_error=true;
        //Add world node
        if (annotation_flag.w){
            //Error check
            if (twt_menu_variables.w_type==='0'){
                alert('Please choose a suitable World type');
                no_error=false;
            }
            if ((twt_menu_variables.w_type==='2')&&(twt_menu_variables.tw_type==='0')){
                alert('Please choose a suitable Text-world type');
                no_error=false;
            }
            //If user just choose one sentence, the interface will show the "sentence ID", but if user choose more than one sentence, the interface will show the "start sentence ID - end sentenece ID"
            if (startSenID===endSenID){
                addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete TWT node"/></span><span  class="world_node" worldID="-1" worldType="'+twt_menu_variables.w_type+'" textWorldType="'+twt_menu_variables.tw_type+'" worldComments="'+twt_menu_variables.w_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+'-1'+'</span><span class="list_text">Sentence: '+endSenID+'</span></div>';
            }
            else{
                addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete TWT node"/></span><span  class="world_node" worldID="-1" worldType="'+twt_menu_variables.w_type+'" textWorldType="'+twt_menu_variables.tw_type+'" worldComments="'+twt_menu_variables.w_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+'-1'+'</span><span class="list_text">Sentence: '+startSenID+'-'+endSenID+'</span></div>';
            }
            //add mark in the text area
            if ((twt_menu_variables.tw_type!=='0')&&(no_error)){
                $('.sentenceDiv').slice(startSenID-1,endSenID).addClass('tw_type_'+twt_menu_variables.tw_type);
            }
            $('#accordion').accordion({active: 2});
        }
        
        //Add people node
        if (annotation_flag.p){
            //Error check
            if (twt_menu_variables.p_type==='0'){
                alert('Please choose a suitable People type');
                no_error=false;
            }
            if ((startWordID!==0)&&(endWordID!==0)){
                addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete peolpe node"/></span><span  class="people_node" worldID="-1" peopleID="-1" peopleType="'+twt_menu_variables.p_type+'"  peopleComments="'+twt_menu_variables.p_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_people.png" alt="people node"/></span><span class="list_text">'+annotated_text+'</span></div>';                
            }
            else {
                //for discourse world elements
                addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete peolpe node"/></span><span  class="people_node" worldID="-1" peopleID="-1" peopleType="'+twt_menu_variables.p_type+'"  peopleComments="'+twt_menu_variables.p_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_people.png" alt="people node"/></span><span class="list_text">C:'+twt_menu_variables.p_comments+'</span></div>'; 
            }
            //add mark in the text area
            if (no_error) {
                $('.claws7_unit').slice(startWordID-1,endWordID).addClass('people_marked');
            }
            $('#accordion').accordion({active: 2});
        }
		
		//Add object node
        if (annotation_flag.o){
            //Error check
            if (!(twt_menu_variables.o_check)){
                alert('Please confirm it is a object');
                no_error=false;
            }
            if ((startWordID!==0)&&(endWordID!==0)){
               addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete object node"/></span><span  class="object_node" worldID="-1" objectID="-1" objectComments="'+twt_menu_variables.o_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_object.png" alt="object node"/></span><span class="list_text">'+annotated_text+'</span></div>';
            }
            else{
                addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete object node"/></span><span  class="object_node" worldID="-1" objectID="-1" objectComments="'+twt_menu_variables.o_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_location.png" alt="location node"/></span><span class="list_text">C:'+twt_menu_variables.o_comments+'</span></div>';
            }
            //add mark in the text area
            if (no_error) {
                $('.claws7_unit').slice(startWordID-1,endWordID).addClass('object_marked');
            }
            $('#accordion').accordion({active: 2});
        }
        
        //Add location node
        if (annotation_flag.l){
            //Error check
            if (!(twt_menu_variables.l_check)){
                alert('Please confirm it is a location');
                no_error=false;
            }
            if ((startWordID!==0)&&(endWordID!==0)){
               addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete location node"/></span><span  class="location_node" worldID="-1" locationID="-1" locationComments="'+twt_menu_variables.l_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_location.png" alt="location node"/></span><span class="list_text">'+annotated_text+'</span></div>';
            }
            else{
                addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete location node"/></span><span  class="location_node" worldID="-1" locationID="-1" locationComments="'+twt_menu_variables.l_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_location.png" alt="location node"/></span><span class="list_text">C:'+twt_menu_variables.l_comments+'</span></div>';
            }
            //add mark in the text area
            if (no_error) {
                $('.claws7_unit').slice(startWordID-1,endWordID).addClass('location_marked');
            }
            $('#accordion').accordion({active: 2});
        }
        
        //Add time node
        if (annotation_flag.t){
            //Error check
            if (twt_menu_variables.t_type==='0'){
                alert('Please choose a suitable time type');
                no_error=false;
            }
            if (twt_menu_variables.t_value==='0'){
                alert('Please choose a suitable time value');
                no_error=false;
            }
            if ((startWordID!==0)&&(endWordID!==0)){
                 addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete time node"/></span><span  class="time_node" worldID="-1" timeID="-1" time_type="'+twt_menu_variables.t_type+'" time_value="'+twt_menu_variables.t_value+'" timeComments="'+twt_menu_variables.t_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_time.png" alt="event node"/></span><span class="list_text">'+annotated_text+'</span></div>';                
            }
            else{
                 addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete time node"/></span><span  class="time_node" worldID="-1" timeID="-1" time_type="'+twt_menu_variables.t_type+'" time_value="'+twt_menu_variables.t_value+'" timeComments="'+twt_menu_variables.t_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_time.png" alt="event node"/></span><span class="list_text">C:'+twt_menu_variables.t_comments+'</span></div>';
            }
            //add mark in the text area
            if ((no_error)&&(twt_menu_variables.t_type!=='0')) {
                $('.claws7_unit').slice(startWordID-1,endWordID).addClass('time_marked');
            }
            $('#accordion').accordion({active: 2});
        }
        
        //Add event node
        if(annotation_flag.e){
            //Error check
            if (twt_menu_variables.e_type==='0'){
                alert('Please choose a suitable event type');
                no_error=false;
            }
            if (twt_menu_variables.e_tense==='0'){
                alert('Please choose a suitable event tense');
                no_error=false;
            }
            if ((startWordID!==0)&&(endWordID!==0)){
                addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete event node"/></span><span  class="event_node" worldID="-1" eventID="-1" event_type="'+twt_menu_variables.e_type+'" event_tense="'+twt_menu_variables.e_tense+'" eventComments="'+twt_menu_variables.e_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_event_'+twt_menu_variables.e_type+'.png" alt="event node"/></span><span class="list_text">'+annotated_text+'</span></div>';                
            }
            else{
                addNode_script='<div class="list_TWT_node"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete event node"/></span><span  class="event_node" worldID="-1" eventID="-1" event_type="'+twt_menu_variables.e_type+'" event_tense="'+twt_menu_variables.e_tense+'" eventComments="'+twt_menu_variables.e_comments+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'"><img src="icons/annotation_list_event_'+twt_menu_variables.e_type+'.png" alt="event node"/></span><span class="list_text">C:'+twt_menu_variables.e_comments+'</span></div>';
            }
            if ((no_error)&&(twt_menu_variables.e_type!=='0')&&(twt_menu_variables.e_tense!=='0')) {
                $('.claws7_unit').slice(startWordID-1,endWordID).addClass('event_marked_'+twt_menu_variables.e_type);
            }
            $('#accordion').accordion({active: 2});
        }
        
        if (no_error){
            //List the added results if any form item is used
	        $('#sorted_WN').append(addNode_script);
        }
    }
    
    function sortNode(){
        //Find all the world node and give them IDs
        //Discourse World ID is 0 (predefined) 
        $('#sorted_WN .list_TWT_node .world_node[worldType="1"]').attr('worldID','0').text('0');
        
        //Text world ID starts from 1
        var worldID=1;
        $('#sorted_WN .list_TWT_node .world_node[textWorldType!="0"]').each(function(){
            $(this).attr('worldID',worldID).text(worldID);
            worldID++;
        });
        
        //People ID start from 1
        var peopleID=1;
        $('#sorted_WN .list_TWT_node .people_node').each(function(){
            $(this).attr('peopleID',peopleID);
            peopleID++;
        });
		
		//Object ID start from 1
        var objectID=1;
        $('#sorted_WN .list_TWT_node .object_node').each(function(){
            $(this).attr('objectID',objectID);
            objectID++;
        });
        
        //Location ID start from 1
        var locationID=1;
        $('#sorted_WN .list_TWT_node .location_node').each(function(){
            $(this).attr('locationID',locationID);
            locationID++;
        });
        
        //Time ID start from 1
        var timeID=1;
        $('#sorted_WN .list_TWT_node .time_node').each(function(){
            $(this).attr('timeID',timeID);
            timeID++;
        });
        
        //Event ID start from 1
        var eventID=1;
        $('#sorted_WN .list_TWT_node .event_node').each(function(){
            $(this).attr('eventID',eventID);
            eventID++;
        });
        
        //The world have all been defined now, so the worldID=-1 are belongs to the world building elements who havent been defined under any world
        $('#sorted_WN .list_TWT_node').children('[worldID="-1"]').each(function(){
            var undefinedElementSenStart = Number($(this).attr('startSenID'));
            var undefinedElementSenEnd = Number($(this).attr('endSenID'));
            var $undefiendNode=$(this);
            //$('#sorted_WN .list_TWT_node .world_node[textWorldType!="0"]').each(function(){
            $('#sorted_WN .list_TWT_node .world_node').each(function(){
                var definedWorldSenStart = Number($(this).attr('startSenID'));
                var definedWorldSenEnd = Number($(this).attr('endSenID'));
                if ((definedWorldSenStart<=undefinedElementSenStart)&&(definedWorldSenEnd>=undefinedElementSenEnd)){
                    $undefiendNode.attr('worldID',$(this).attr('worldID'));
                }
            });
        });
        
        //Reorder the list: Undefined nodes first(WorldID=-1) followed by World ID=0,1,2,..
        //Under each world, the order is people, object, location, time and then a list of the events
        //Put undefined nodes (WorldID=-1) at begining to let user know
        $('[worldID=-1]').parent().appendTo('#sorted_WN');
        //World ID=0 follow the undefiend nodes
        $('.world_node[worldID=0]').next().text('Discourse World').parent().appendTo('#sorted_WN');
        for (i=0; i<worldID;i++){
            $('.world_node[worldID='+i+']').parent().appendTo('#sorted_WN');
            $('.people_node[worldID='+i+']').parent().appendTo('#sorted_WN');
			$('.object_node[worldID='+i+']').parent().appendTo('#sorted_WN');
            $('.location_node[worldID='+i+']').parent().appendTo('#sorted_WN');
            $('.time_node[worldID='+i+']').parent().appendTo('#sorted_WN');
            $('.event_node[worldID='+i+']').parent().appendTo('#sorted_WN');            
        }
        
        //Every time sorting the ID will renew the world switches "from" and "to" list
        //Forget the previous one
        $('select[name="ws_from"]').html('<option value="'+0+'">...</option>');
        $('select[name="ws_to"]').html('<option value="'+0+'">...</option>');
        //Renew
        for (i=1; i<worldID;i++){
            $('select[name="ws_from"]').append('<option value="'+i+'">'+i+'</option>');
            $('select[name="ws_to"]').append('<option value="'+i+'">'+i+'</option>');
        }
        
        //Define the ID shows in the WS list. The ID will renew every time just in case user delete the nodes
        //From...
        $('#sorted_WS .list_TWT_WS').children('[fromWorldID="-1"]').each(function(){
            var $fromNode=$(this);
            var undefinedWSFromSenStart=Number($(this).attr('startSenID'));
            var undefinedWSFromSenEnd=Number($(this).attr('endSenID'));
            $('#sorted_WN .list_TWT_node .world_node[textWorldType!="0"]').each(function(){
                var definedWorldSenStart = Number($(this).attr('startSenID'));
                var definedWorldSenEnd = Number($(this).attr('endSenID'));
                if ((definedWorldSenStart===undefinedWSFromSenStart)&&(definedWorldSenEnd===undefinedWSFromSenEnd)){
                    $fromNode.attr('fromWorldID',$(this).attr('worldID')).text($(this).attr('worldID'));
                    $fromNode.attr('textWorldType',$(this).attr('textWorldType'));
                }
            });
        });
        //To...
        $('#sorted_WS .list_TWT_WS').children('[toWorldID="-1"]').each(function(){
            var $toNode=$(this);
            var undefinedWSToSenStart=Number($(this).attr('startSenID'));
            var undefinedWSToSenEnd=Number($(this).attr('endSenID'));
            $('#sorted_WN .list_TWT_node .world_node[textWorldType!="0"]').each(function(){
                var definedWorldSenStart = Number($(this).attr('startSenID'));
                var definedWorldSenEnd = Number($(this).attr('endSenID'));
                if ((definedWorldSenStart===undefinedWSToSenStart)&&(definedWorldSenEnd===undefinedWSToSenEnd)){
                    $toNode.attr('toWorldID',$(this).attr('worldID')).text($(this).attr('worldID'));
                    $toNode.attr('textWorldType',$(this).attr('textWorldType'));
                }
            });
        });
        
        //Renew the statisic event option list
        var phyWorldNum=$('#sorted_WN .list_TWT_node').children('*:nth-child(2)[textWorldType="1"]').length;
        var menWorldNum=$('#sorted_WN .list_TWT_node').children('*:nth-child(2)[textWorldType="2"]').length;
        $('select[name="event_options"]').html('<option value="1">the whole text</option><option value="2">the TW-physical</option><option value="3">the TW-mental</option>');
        for (i=1;i<=(phyWorldNum+menWorldNum);i++){
            $('select[name="event_options"]').append('<option value="'+(i+3)+'">TW #'+i+'</option>');
        }
        //Renew statistic graph everytime the node is changed
        update_Sta_Graph();
        
        //the vis_list_item can be mistakely add into the list. remove them all at the end
        $('#sorted_WN .vis_list_item').remove();
        
    }
    
    function addWS(){
        var no_error=true;
        var addWS_script='';
        var WSFromSenStart=$('#sorted_WN .list_TWT_node .world_node[worldID="'+twt_menu_variables.ws_from+'"]').attr('startSenID');
        var WSFromSenEnd=$('#sorted_WN .list_TWT_node .world_node[worldID="'+twt_menu_variables.ws_from+'"]').attr('endSenID');
        var WSToSenStart=$('#sorted_WN .list_TWT_node .world_node[worldID="'+twt_menu_variables.ws_to+'"]').attr('startSenID');
        var WSToSenEnd=$('#sorted_WN .list_TWT_node .world_node[worldID="'+twt_menu_variables.ws_to+'"]').attr('endSenID');

        if(annotation_flag.ws){
            //No error check
            if ((twt_menu_variables.ws_from==='0')||(twt_menu_variables.ws_to==='0')){
                alert('Please define "from" and "to" with suitable world IDs');
                no_error=false;
            }
            if (!((twt_menu_variables.ws_s)||(twt_menu_variables.ws_t)||(twt_menu_variables.ws_e)||(twt_menu_variables.ws_a))){
                alert('Please choose a suitable world-switch type');
                no_error=false;
            }
            //Becuase user can delete the world nodes during the operation and world ID may change. the fromWorldID  and toWorldID will not be set here.(will be sorted in sorted node function by using senID).Same as textWorldType.
            
            addWS_script='<div class="list_TWT_WS"><span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete peolpe node"/></span><span  class="world_node from_world_node" fromWorldID="-1" textWorldType="-1" startSenID="'+WSFromSenStart+'" endSenID="'+WSFromSenEnd+'" wsComments="'+twt_menu_variables.ws_comments+'">'+'-1'+'</span>';
            if (twt_menu_variables.ws_s) {
                addWS_script=addWS_script+'<span class="WS_symbol WS_1"><img src="icons/ws_S.png" alt="spatial"/></span>';
            }
            if (twt_menu_variables.ws_t) {
                addWS_script=addWS_script+'<span class="WS_symbol WS_2"><img src="icons/ws_T.png" alt="temporal"/></span>';
            }
            if (twt_menu_variables.ws_e) {
                addWS_script=addWS_script+'<span class="WS_symbol WS_3"><img src="icons/ws_E.png" alt="epistemic"/></span>';
            }
            if (twt_menu_variables.ws_a) {
                addWS_script=addWS_script+'<span class="WS_symbol WS_4"><img src="icons/ws_A.png" alt="attitudinal"/></span>';
            }
            addWS_script=addWS_script+'<span class="world_node to_world_node" toWorldID="-1" textWorldType="-1" startSenID="'+WSToSenStart+'" endSenID="'+WSToSenEnd+'">'+'-1'+'</span></div>';
            
            if (no_error){
            //List the added results if any form item is used
	        $('#accordion').accordion({active: 3});
            $('#sorted_WS').append(addWS_script);
        }
        }
        
    }
    
    //////////////////////////////////////
    //Delete a listed item and its marks//
    //////////////////////////////////////
    //Delete World Nodes
    $('#sorted_WN').on('mouseenter','.list_TWT_node',function(){
        $(this).children().first().css('visibility','visible');
    });
    $('#sorted_WN').on('mouseleave','.list_TWT_node',function(){
        $(this).children().first().css('visibility','hidden');
    });
    $('#sorted_WN').on('click','.delete',function(e){
        e.preventDefault();
        e.stopPropagation();
        var delete_confirm = confirm('Delete this node?');
        startSenID = Number($(this).next().attr('startSenID'));
        endSenID = Number($(this).next().attr('endSenID'));
        startWordID = Number($(this).next().attr('startWordID'));
        endWordID = Number($(this).next().attr('endWordID'));
        if (delete_confirm){
            //Remove the node
            $(this).parent().remove();            
            //Remove the marks
            //Remove world mark
            if($(this).next().hasClass('world_node')){
                $('.sentenceDiv').slice(startSenID-1,endSenID).removeClass('tw_type_'+$(this).next().attr('textWorldType'));
                //also redefine all worldID of elements to -1, which is easy to redefine to another worlds in sort function
                $('#sorted_WN .list_TWT_node').children('*:nth-child(2)[class!="world_node"]').attr('worldID','-1');
                //also redefine all fromWorldID of elements to -1, which is easy to redefine to another worlds in sort function
                $('.from_world_node').attr('fromWorldID','-1').attr('textWorldType','-1').each(function(){
                    var originalText=$(this).text();
                    $(this).text('del');
                });
               //also redefine all toWorldID of elements to -1, which is easy to redefine to another worlds in sort function
                $('.to_world_node').attr('toWorldID','-1').attr('textWorldType','-1').each(function(){
                    var originalText=$(this).text();
                    $(this).text('del');
                });
            }
            //Remove people mark
            if($(this).next().hasClass('people_node')){$('.claws7_unit').slice(startWordID-1,endWordID).removeClass('people_marked');}
			//Remove object mark
            if($(this).next().hasClass('object_node')){$('.claws7_unit').slice(startWordID-1,endWordID).removeClass('object_marked');}
            //Remove locaiton mark
            if($(this).next().hasClass('location_node')){$('.claws7_unit').slice(startWordID-1,endWordID).removeClass('location_marked');}
            //Remove time mark
            if($(this).next().hasClass('time_node')){$('.claws7_unit').slice(startWordID-1,endWordID).removeClass('time_marked');}
            //Remove event mark
            if($(this).next().hasClass('event_node')){$('.claws7_unit').slice(startWordID-1,endWordID).removeClass('event_marked_'+$(this).next().attr('event_type'));}
            sortNode();
            
        }            
            
    });
    //Delete World Switches
    $('#sorted_WS').on('mouseenter','.list_TWT_WS',function(){
        $(this).children().first().css('visibility','visible');
    });
    $('#sorted_WS').on('mouseleave','.list_TWT_WS',function(){
        $(this).children().first().css('visibility','hidden');
    });
    $('#sorted_WS').on('click','.delete',function(e){
        e.preventDefault();
        e.stopPropagation();
        var delete_confirm = confirm('Delete this World-Switch?');
        if (delete_confirm){$(this).parent().remove();}
    });
    
    ////////////////////////////////////
    //Edit a listed item and its marks//
    ////////////////////////////////////
    //Load varables to the popup menu
    var $object='';
    $('#sorted_WN').on('click','.list_TWT_node',function(e){
       $object=$(this).children(':nth-child(2)');
        var currentEditNodeClass = $(this).children(':nth-child(2)').attr('class');
        
        if (currentEditNodeClass==='world_node'){
            //Popup the Menu
            popup_menu_singlePage ('#w_popup','edit_node');
            //Send value to the menu items
            $('select[name="w_type"]').val($object.attr('worldType'));
            $('select[name="tw_type"]').val($object.attr('textWorldType'));
            $('textarea[name="w_comments"]').val($object.attr('worldComments'));
            //The default seeting make tw_type unavailable. Should be changed here if the w_type=text world
            if($object.attr('worldType')==='2'){
                $('select[name="tw_type"]').prop('disabled',false);
            }
            else{
                $('select[name="tw_type"]').prop('disabled',true);
            }
        }
        if (currentEditNodeClass==='people_node'){
            //Popup the Menu
            popup_menu_singlePage ('#p_popup','edit_node');
            //Send value to the menu items
            $('select[name="p_type"]').val($object.attr('peopleType'));
            $('textarea[name="p_comments"]').val($object.attr('peopleComments'));
        }
		if (currentEditNodeClass==='object_node'){
            //Popup the Menu
            popup_menu_singlePage ('#o_popup','edit_node');
            //Send value to the menu items
            $('input[id="o_check"]').prop('checked',$object.hasClass('object_node'));
            $('textarea[name="o_comments"]').val($object.attr('objectComments'));
        }
        if (currentEditNodeClass==='location_node'){
            //Popup the Menu
            popup_menu_singlePage ('#l_popup','edit_node');
            //Send value to the menu items
            $('input[id="l_check"]').prop('checked',$object.hasClass('location_node'));
            $('textarea[name="l_comments"]').val($object.attr('locationComments'));
        }
        if (currentEditNodeClass==='time_node'){
            //Popup the Menu
            popup_menu_singlePage ('#t_popup','edit_node');
            //Send value to the menu items
            $('select[name="t_type"]').val($object.attr('time_type'));
            $('select[name="t_value"]').val($object.attr('time_value'));
            $('textarea[name="t_comments"]').val($object.attr('timeComments'));
        }
        if (currentEditNodeClass==='event_node'){
            //Popup the Menu
            popup_menu_singlePage ('#e_popup','edit_node');
            //Send value to the menu items
            $('select[name="e_type"]').val($object.attr('event_type'));
            $('select[name="e_tense"]').val($object.attr('event_tense'));
            $('textarea[name="e_comments"]').val($object.attr('eventComments'));
        }
        
    });
    
    //WS Edit
	$('#sorted_WS').on('click','.list_TWT_WS',function(){
        $object=$(this);
        popup_menu_singlePage('#ws_popup','edit_node');
        $('select[name="ws_from"]').val($(this).children(':nth-child(2)').attr('fromWorldID'));
        $('select[name="ws_to"]').val($(this).children(':last-child').attr('toWorldID'));
        $('input[id="ws_s"]').prop('checked',$(this).children().hasClass('WS_1'));
        $('input[id="ws_t"]').prop('checked',$(this).children().hasClass('WS_2'));
        $('input[id="ws_e"]').prop('checked',$(this).children().hasClass('WS_3'));
        $('input[id="ws_a"]').prop('checked',$(this).children().hasClass('WS_4'));
        $('textarea[name="ws_comments"]').val($(this).children(':nth-child(2)').attr('wsComments'));        
    });
    
    //Renew the varables and update the nodes
    $('#edit_button').on('click',function(){
        //Check the popup menu's values
        popup_menu_to_variable();
        //Distinguish annotation content:Use flag to indicate which group of the anntation has been added.
        which_groups_are_annotated();
        editNode($object);
        editWS($object);
        sortNode();
        //Then close the menu
        $('#root_dl-menu').removeClass('dl-subview');
        $('.dl-subviewopen').removeClass('dl-subviewopen');
        clearTWTAnnotaitonForm();
        kill_popup_menu();
    });
    
    function editNode($TWT_object){
        var no_error=true;
        startSenID=Number($TWT_object.attr('startSenID'));
        startWordID=Number($TWT_object.attr('startWordID'));
        endSenID=Number($TWT_object.attr('endSenID'));
        endWordID=Number($TWT_object.attr('endWordID'));
        
        if (annotation_flag.w){
            //Error check
            if (twt_menu_variables.w_type==='0'){
                alert('Please choose a suitable World type');
                no_error=false;
            }
            if ((twt_menu_variables.w_type==='2')&&(twt_menu_variables.tw_type==='0')){
                alert('Please choose a suitable Text-world type');
                no_error=false;
            }
            if (no_error){
                $TWT_object.attr('textWorldType',twt_menu_variables.tw_type);
                $TWT_object.attr('worldType',twt_menu_variables.w_type);
                $TWT_object.attr('worldComments',twt_menu_variables.w_comments);                
            }
            //add mark in the text area
            if ((twt_menu_variables.tw_type!=='0')&&(no_error)){
                $('.sentenceDiv').slice(startSenID-1,endSenID).attr('class','sentenceDiv tw_type_'+twt_menu_variables.tw_type);
            }
            
            //To allow Sort Node funciton update the world type, from/to WorldID in world switches will be reset to -1
            $('.world_node').attr('fromWorldID','-1').attr('toWorldID','-1');
            
        }
        if (annotation_flag.p){
            //Error check
            if (twt_menu_variables.p_type==='0'){
                alert('Please choose a suitable People type');
                no_error=false;
            }
            
            if(no_error){
                $TWT_object.attr('peopleType',twt_menu_variables.p_type);
                $TWT_object.attr('peopleComments',twt_menu_variables.p_comments);
                if ((startWordID===0)&&(endWordID===0)){
                     $TWT_object.next().text('C:'+twt_menu_variables.p_comments);
                }                    
            }

        }
		if (annotation_flag.o){
            //Error check
            if (!(twt_menu_variables.o_check)){
                alert('Please mark/dismark a object');
                no_error=false;
            }
            if (no_error){
                $TWT_object.attr('objectComments',twt_menu_variables.o_comments);
                if ((startWordID===0)&&(endWordID===0)){
                    $TWT_object.next().text('C:'+twt_menu_variables.o_comments);
                }
            }
        }
        if (annotation_flag.l){
            //Error check
            if (!(twt_menu_variables.l_check)){
                alert('Please mark/dismark a location');
                no_error=false;
            }
            if (no_error){
                $TWT_object.attr('locationComments',twt_menu_variables.l_comments);
                if ((startWordID===0)&&(endWordID===0)){
                    $TWT_object.next().text('C:'+twt_menu_variables.l_comments);
                }
            }
        }
        if(annotation_flag.t){
            //Error check
            if (twt_menu_variables.t_type==='0'){
                alert('Please choose a suitable time type');
                no_error=false;
            }
            if (twt_menu_variables.t_value==='0'){
                alert('Please choose a suitable time value');
                no_error=false;
            }
            if (no_error){
                $TWT_object.attr('time_type',twt_menu_variables.t_type);
                $TWT_object.attr('time_value',twt_menu_variables.t_value);
                $TWT_object.attr('timeComments',twttwt_menu_variables.t_comments);
                if ((startWordID===0)&&(endWordID===0)){
                     $TWT_object.next().text('C:'+twt_menu_variables.t_comments);
                }
            }
        }
        if(annotation_flag.e){
            //Error check
            if (twt_menu_variables.e_type==='0'){
                alert('Please choose a suitable event type');
                no_error=false;
            }
            if (twt_menu_variables.e_tense==='0'){
                alert('Please choose a suitable event tense');
                no_error=false;
            }
            if (no_error){
                $TWT_object.attr('event_type',twt_menu_variables.e_type);
                $TWT_object.attr('event_tense',twt_menu_variables.e_tense);
                $TWT_object.attr('eventComments',twt_menu_variables.e_comments);
                $TWT_object.children(':first-child').attr('src','icons/annotation_list_event_'+twt_menu_variables.e_type+'.png');
                if ((startWordID===0)&&(endWordID===0)){
                     $TWT_object.next().text('C:'+twt_menu_variables.e_comments);
                }
            }
            if ((no_error)&&(twt_menu_variables.e_type!=='0')&&(twt_menu_variables.e_tense!=='0')) {
                $('.claws7_unit').slice(startWordID-1,endWordID).attr('class','claws7_unit event_marked_'+twt_menu_variables.e_type);
            }
        }           
        
    }
    
    function editWS($WS_object){
        var no_error=true;
        var editWS_script='';
        var WSFromSenStart=$('#sorted_WN .list_TWT_node .world_node[worldID="'+twt_menu_variables.ws_from+'"]').attr('startSenID');
        var WSFromSenEnd=$('#sorted_WN .list_TWT_node .world_node[worldID="'+twt_menu_variables.ws_from+'"]').attr('endSenID');
        var WSToSenStart=$('#sorted_WN .list_TWT_node .world_node[worldID="'+twt_menu_variables.ws_to+'"]').attr('startSenID');
        var WSToSenEnd=$('#sorted_WN .list_TWT_node .world_node[worldID="'+twt_menu_variables.ws_to+'"]').attr('endSenID');

        if(annotation_flag.ws){
            //No error check
            if ((twt_menu_variables.ws_from==='0')||(twt_menu_variables.ws_to==='0')){
                alert('Please define "from" and "to" by suitable world IDs');
                no_error=false;
            }
            if (!((twt_menu_variables.ws_s)||(twt_menu_variables.ws_t)||(twt_menu_variables.ws_e)||(twt_menu_variables.ws_a))){
                alert('Please choose a suitable world swirch type');
                no_error=false;
            }
            //Becuase user can delete the world nodes during the operation and world ID may change. the fromWorldID  and toWorldID will not be set here.(will be sorted in sorted node function by using senID).Same as textWorldType.
            
            editWS_script='<span class="delete" style="visibility:hidden"><img src="icons/annotation_list_delete.png" alt="delete peolpe node"/></span><span  class="world_node from_world_node" fromWorldID="-1" textWorldType="-1" startSenID="'+WSFromSenStart+'" endSenID="'+WSFromSenEnd+'" wsComments="'+twt_menu_variables.ws_comments+'">'+'-1'+'</span>';
            if (twt_menu_variables.ws_s) {
                editWS_script=editWS_script+'<span class="WS_symbol WS_1"><img src="icons/ws_S.png" alt="spatial"/></span>';
            }
            if (twt_menu_variables.ws_t) {
                editWS_script=editWS_script+'<span class="WS_symbol WS_2"><img src="icons/ws_T.png" alt="temporal"/></span>';
            }
            if (twt_menu_variables.ws_e) {
                editWS_script=editWS_script+'<span class="WS_symbol WS_3"><img src="icons/ws_E.png" alt="epistemic"/></span>';
            }
            if (twt_menu_variables.ws_a) {
                editWS_script=editWS_script+'<span class="WS_symbol WS_4"><img src="icons/ws_A.png" alt="attitudinal"/></span>';
            }
            editWS_script=editWS_script+'<span class="world_node to_world_node" toWorldID="-1" textWorldType="-1" startSenID="'+WSToSenStart+'" endSenID="'+WSToSenEnd+'">'+'-1'+'</span>';
            
            if (no_error){
            //List the added results if any form item is used
	        $('#accordion').accordion({active: 3});
            $WS_object.html(editWS_script);
            }
        }
        
    }
    
    /////////////////////
    //Generate XML file//
    /////////////////////
    //XML file has three part: readable part, original part (for easy coding) and text part (instead of using text file)
    //Soruce code and text are added as comments. User dont need to look into it
    $('#export_twt').click(function(){
        var script=format_xml();        
        localStorage.setItem("XMLScript",script);
        alert('Worldbuilder System will open a new window to export the TWT annotation file');
        window.open('XMLscript.html');    
    });
    
    function format_xml(){
        var XMLScript=''
        var XML_Head='<?xml version="1.0" encoding="UTF-8"?>';
        var XML_TWTNode= '';
        var XML_WSNode='';
        var XML_Source='';
        var XML_text='';
        
        //Format TWT nodes
        var firstWorld=true;
        $('[worldID]').each(function(){
            var line='';
            var nodeClass = $(this).attr('class');
            var annotated_text = $(this).next().text();
            var startSenID = Number($(this).attr('startSenID'));
            var endSenID = Number($(this).attr('endSenID'));
            var startWordID = Number($(this).attr('startWordID'));
            var endWordID = Number($(this).attr('endWordID'));
            if (nodeClass==="world_node"){
                var worldType = $('select[name="w_type"]').children('[value="'+$(this).attr('worldType')+'"]').text();
                var textWorldType = $('select[name="tw_type"]').children('[value="'+$(this).attr('textWorldType')+'"]').text();
                if (firstWorld){
                    line='<world worldID="'+$(this).attr('worldID')+'" worldType="'+worldType+'" textWorldType="'+textWorldType+'" worldComments="'+$(this).attr('worldComments')+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+annotated_text;
                    firstWorld=false;
                }
                else{
                    line='</world><world worldID="'+$(this).attr('worldID')+'" worldType="'+worldType+'" textWorldType="'+textWorldType+'" worldComments="'+$(this).attr('worldComments')+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+annotated_text;
                }
            }
            if(nodeClass==="people_node"){
                var peopleType = $('select[name="p_type"]').children('[value="'+$(this).attr('peopleType')+'"]').text();
                line='<people worldID="'+$(this).attr('worldID')+'" peopleID="'+$(this).attr('peopleID')+'" peopleType="'+peopleType+'"  peopleComments="'+$(this).attr('peopleComments')+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+annotated_text+'</people>';
            }
			if(nodeClass==="object_node"){
                line='<object  worldID="'+$(this).attr('worldID')+'" objectID="'+$(this).attr('objectID')+'" objectComments="'+$(this).attr('objectComments')+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+annotated_text+'</object>';
            }
            if(nodeClass==="location_node"){
                line='<location  worldID="'+$(this).attr('worldID')+'" locationID="'+$(this).attr('locationID')+'" locationComments="'+$(this).attr('locationComments')+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+annotated_text+'</location>';
            }
            if(nodeClass==="time_node"){
                var time_type = $('select[name="t_type"]').children('[value="'+$(this).attr('time_type')+'"]').text();
                var time_value = $('select[name="t_value]').children('[value="'+$(this).attr('time_value')+'"]').text();
                line='<time worldID="'+$(this).attr('worldID')+'" timeID="'+$(this).attr('timeID')+'" time_type="'+time_type+'" time_value="'+time_value+'" timeComments="'+$(this).attr('timeComments')+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+annotated_text+'</time>';
            }
            if(nodeClass==="event_node"){
                var event_type = $('select[name="e_type"]').children('[value="'+$(this).attr('event_type')+'"]').text();
                var event_tense = $('select[name="e_tense"]').children('[value="'+$(this).attr('event_tense')+'"]').text();
                line='<event worldID="'+$(this).attr('worldID')+'" eventID="'+$(this).attr('eventID')+'" event_type="'+event_type+'" event_tense="'+event_tense+'" eventComments="'+$(this).attr('eventComments')+'" startSenID="'+startSenID+'" endSenID="'+endSenID+'" startWordID="'+startWordID+'" endWordID="'+endWordID+'">'+annotated_text+'</event>';
            }
            XML_TWTNode=XML_TWTNode+line;
        });
        XML_TWTNode=XML_TWTNode+'</world>';
        
        //format WS
        $('[fromWorldID]').each(function(){
            var ws_from=$(this).attr('fromWorldID');
            var ws_to=$(this).parent().children(':last-child').attr('toWorldID');
            var ws_type=''
            var comments=$(this).attr('wsComments');
            var line='';        
            if ($(this).parent().children().hasClass('WS_1')){ws_type=ws_type+$('#ws_s').parent().text()+' ';}            
            if ($(this).parent().children().hasClass('WS_2')){ws_type=ws_type+$('#ws_t').parent().text()+' ';}
            if ($(this).parent().children().hasClass('WS_3')){ws_type=ws_type+$('#ws_e').parent().text()+' ';}
            if ($(this).parent().children().hasClass('WS_4')){ws_type=ws_type+$('#ws_a').parent().text()+' ';}
            line = '<WS from="'+ws_from+'" to="'+ws_to+'" type="'+ws_type+'">'+comments+'</WS>';
            XML_WSNode = XML_WSNode+line;          
        });
        
        //load source code
        var twt_node_code='';
        var twt_ws_code='';
        if($('#sorted_WN').html().indexOf('<div class="list_TWT_node">')!==-1){twt_node_code=$('#sorted_WN').html().substr($('#sorted_WN').html().indexOf('<div class="list_TWT_node">'));}
        if($('#sorted_WS').html().indexOf('<div class="list_TWT_WS">')!==-1){twt_ws_code=$('#sorted_WS').html().substr($('#sorted_WS').html().indexOf('<div class="list_TWT_WS">'));}
                
        //load text
        XML_text=$('#annotation_area').html();
        
        XMLScript=XML_Head+'<root><TWT_nodes>'+XML_TWTNode+'</TWT_nodes><World_Switches>'+XML_WSNode+'</World_Switches><!--<w_code>'+twt_node_code+'</w_code><ws_code>'+twt_ws_code+'</ws_code><text>'+XML_text+'</text>--></root>';
        return XMLScript;
        
    }

});