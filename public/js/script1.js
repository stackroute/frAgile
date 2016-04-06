//Story code starts//

function loadStory(fname) {
  getActivity(fname);
  $.getJSON("/story?id="+fname+"", function (json) {
    if(json.story_status=="Completed"){
      $('#div_header').removeClass("div_header_orange");
      $('#div_header').removeClass("div_header_red");
      $('#div_header').addClass("div_header_green");
    }
    if(json.story_status=="inProgress"){
      $('#div_header').removeClass("div_header_red");
      $('#div_header').removeClass("div_header_green");
      $('#div_header').addClass("div_header_orange");
    }
    if(json.story_status=="unAssigned"){
      $('#div_header').removeClass("div_header_orange");
      $('#div_header').removeClass("div_header_green");
      $('#div_header').addClass("div_header_red");
    }
    $('#story_label').html("");
    $('#story_label').append( json.heading);
    //$('#activity_list').html("");
    // for (var i = 0; i < json.commentlist.length; i++) {
    //   $('#activity_list').append( "<div class='cssstory_label'><h4> "+json.commentlist[i].desc+"</h4></div>");
    // }
    if(json.labellist.length!=0){
      $('#label_list').html("");
      $('#label_list').append( "<h4>Labels :</h4><div>");
      for (var i = 0; i < json.labellist.length; i++) {
        $('#label_list').append( "<div class='pull-left csslabel_list' style=background:"+json.labellist[i].colorcode+";></div> ");
      }
      $('#label_list').append( "</div><button type='button' name='button' class='add_file'>+</button><br>");

    }
    if(json.memberlist.length!=0){
      $('#member_list').html( "");
      $('#member_list').append( "<h4>Members :</h4>");
      for (var i = 0; i < json.memberlist.length; i++) {
        $('#member_list').append( "<button type='button' name='button' class='member_button'>&nbsp;"+json.memberlist[i].initials+"</button>&nbsp;");
      }
      $('#member_list').append( "&nbsp;<button type='button' name='button'class='add_file'>+</button><br>");

    }
    if(json.attachmentlist.length!=0){
      $('#attachment_list').html( "");
      for (var i = 0; i < json.attachmentlist.length; i++) {
        $('#attachment_list').append( "<img class='cssattachment_list' src='"+json.attachmentlist[i].filename+"'></img>");
      }
      $('#attachment_list').append( "&nbsp;<button type='button' name='button' class='add_file'>+</button><br>");
    }
    if(json.checklist.length!=0){
      $('#check_list').html("");
      for (var i = 0; i < json.checklist.length; i++) {
        $('#check_list').append( "<h4>"+json.checklist[i].checklist_heading+":</h4><h5>");
        for (var j = 0; j < parseInt(json.checklist[i].checked_count); j++) {
          $('#check_list').append( "<input type='checkbox'>"+json.checklist[i].items[j].text+"</input>&nbsp;<br>");
        }
        $('#check_list').append( "</h5>&nbsp;<button type='button' name='button' class='add_file'>+</button><br>");
      }
    }
    $('#edit_desc').on('click',function(){
      $('#description_div').html("");
      $('#description_div').append( "<h4>Edit Description </h4><textarea name='name' rows='5' cols='100' width='100%'></textarea><button type='button ' class='div_margin pull-right' name='button'>Canel</button><button class='pull-right div_margin' type='button' name='button'>Save</button>");
    })
  });
}
//Story code ends
//Release and sprint code starts

//releases("Release0");
loadProj("project");


$("#home").on("click", function() {
  $(".release").html(""); $(".sprintDiv").html("");
  loadProj("project")
});

function draggableFunc() {

  $(".child").draggable({
    revert: true
  });

  $(".sorting").droppable({
    accept: '.child',
    drop: function(event, ui) {
      $(this).append($(ui.draggable));
    }
  });


  $(".sorting").sortable({
    revert: true,
    placeholder: "test-placeholder",
    over: function() {
      $('.test-placeholder').stop().animate({
        height: 0
      }, 400);
    },
    change: function() {
      $('.test-placeholder').stop().animate({
        height: 50
      }, 400);
    }
  });

};
function loadProj(jsnName){
  jsnName = ["56ea78dd15eac2a96fedb5ec", "56ea78ea15eac2a96fedb5ee"];// TODO: get dynamic data
  sprintId = "56ea89de1d4b0a2572f25b9c";
  // $.post( "/project/addMember", function( data ) {
  //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..");
  //   console.log(data);
  // });
  // $.getJSON( "/sprint?id="+sprintId+"", function( data ) {
  //   console.log("---------------------------------------------------------");
  //   console.log(data);
  //   console.log("---------------------------------------------------------");
  // });
  $.getJSON( "/project?id="+jsnName+"", function( data ) {
    var items = [];
    $( ".release" ).append( "<h3 class = 'pull-right' id=\"chartBtn\"><i class=\"fa fa-bar-chart\"data-toggle=\"modal\" data-target=\"#graphModal\" onclick=\"drawReleaseGraph();\"></i></h3>" );
    $.each( data, function(keySprint, valproj) {
      items = [];
      items.push("<div class = 'headingBox'><h3 class ='pull-left'>" + data[keySprint]["name"]);
      var desc = data[keySprint]["description"];
      if (desc.length > 50){ //For a Long value in description
        desc = desc.substr(0,50) + "...";
      }
      items.push("<small>" + desc + "</small></h3>");
      items.push("</div><div class=\"innerClass\">");
      $( "<div/>", {
        "class": "",
        "id" : keySprint,
        html:  items.join( "" )
      }).appendTo( ".release" );
      $.each( data[keySprint]["release"], function(keyrel, valrel) {
        items = [];
        items.push("<ul>");
        items.push("<li><div class='boxHeading'>" + valrel["name"] + "</div></li>");
        var desc = valrel["description"];
        if (desc.length > 35){ //For a Long value in description
          desc = desc.substr(0,35) + "...";
        }
        items.push("<li>" + desc + "</li>");
        items.push("<li>" + valrel["date"] + "</'li'>");
        items.push("</ul>");
        $( "<div/>", {
          "class": "releases",
          "id" : valrel["_id"],
          html:  items.join( "" )
        }).appendTo( "#" + keySprint +" .innerClass" );
      });
      items = [];
      items.push("<h4>Add Release...</h4>");
      $( "<div/>", {
        "class": "releases addmore",
        "id" : data[keySprint]["name"],
        html:  items.join( "" )
      }).appendTo( "#" + keySprint +" .innerClass" );

    });
    afterRelLoad();
    function afterRelLoad() {
      $(".releases").on("click", function(){
        //sprintLoad($(this).attr("id"));
        $(".release").html(""); $(".sprintDiv").html("");
        releases($(this).attr("id"));
      });

    }
    function relLoad(id) {
      items = [];
      $(".release").html(""); $(".sprintDiv").html("");
      console.log(data);
      $.each( data["_id"]["release"], function(keyrel, valrel) {
        items = [];
        items.push("<ul>");
        items.push("<li><div class='boxHeading'>" + valrel["name"] + "</div></li>");
        var desc = valrel["description"];
        if (desc.length > 35){ //For a Long value in description
          desc = desc.substr(0,35) + "...";
        }
        items.push("<li>" + desc + "</li>");
        items.push("<li>" + valrel["date"] + "</li>");
        items.push("</ul>");
        $( "<div/>", {
          "class": "releases",
          "id" : valrel["_id"],
          html:  items.join( "" )
        }).appendTo( ".release" );
      });
      afterRelLoad();
      function afterRelLoad() {
        $(".releases").on("click", function(){
          //sprintLoad($(this).attr("id"));
          $(".release").html(""); $(".sprintDiv").html("");
          releases($(this).attr("id"));
        });

      }
    }
  });
}

/*Function for each Release*/
function releases(ReleaseId) {
  // $.post( "/story", function( data ) {
  //   console.log("Posting");
  // });
  ReleaseId =  "56e7abf68c7925694961c5ea";
  $.getJSON( "/release?id="+ReleaseId+"", function( data ) {
    var items = [];
    items.push("<h3 class ='pull-left'>" + data["release_Name"]);
    items.push("<small>" + data["release_Date"] + "</small>");
    items.push("<h3 class = 'pull-right' id=\"chartBtn\"><i class=\"fa fa-bar-chart\"data-toggle=\"modal\" data-target=\"#graphModal\" onclick=\"drawGraph('storyStatus',false,'CFD');\"></i></h3>");
    $( "<div/>", {
      "class": "headingBox",
      html:  items.join( "" )
    }).appendTo( ".release" );
    $.each( data["sprint"], function( keySprint, valSprint ) {
      items = [];
      items.push("<ul>");
      items.push("<li><div class='boxHeading'>" + valSprint["sprint_Name"] + "</div></li>");
      var desc = valSprint["sprint_description"];
      if (desc.length > 35){ //For a Long value in description
        desc = desc.substr(0,35) + "...";
      }
      items.push("<li>" + desc + "</li>");
      items.push("</ul>");
      items.push("<span>" + valSprint["sprint_Start_Date"] + " to " + valSprint["sprint_End_Date"] + "</span>");
      $( "<div/>", {
        "class": "sprints",
        "id" : keySprint,
        html:  items.join( "" )
      }).appendTo( ".release" );
    });
    afterLoad();
    function afterLoad() {
      $(".sprints").on("click", function(){
        sprintLoad($(this).attr("id"));
      });

    }
    function sprintLoad(id) {
      $(".release").html(""); $(".sprintDiv").html("");
      items = [];
      items.push("<div class = 'heading'><h3 class ='pull-left'>" + data["sprint"][id]["sprint_Name"]);
      var desc = data["sprint"][id]["sprint_description"];
      if (desc.length > 50){ //For a Long value in description
        desc = desc.substr(0,50) + "...";
      }
      items.push("<small>" + desc + "</small></h3>");
      items.push("<h3 class = 'pull-right' id=\"chartBtn\"><i class=\"fa fa-bar-chart\"data-toggle=\"modal\" data-target=\"#graphModal\" onclick=\"drawGraph('storyStatus',false,'VELOCITY');\"></i></h3>");
      items.push("</div>");
      $( "<div/>", {
        "class": "headingBox",
        "id" : "keySprint",
        html:  items.join( "" )
      }).appendTo( ".release" );
      $.each( data["sprint"][id]["list"], function( keyList, valList ) {
        items = [];
        listDiv = "<div class = 'listHead'>" + valList["list_Name"] + "</div>";
        items.push("<div class = 'sorting'>");
        if(valList["story"] != undefined){
          $.each( valList["story"], function( keyStory, valStory ) {
            //items.push( "<li id='" + key + "'>" + key + " - " + val + "</li>" );

            //<a href="#myModal" data-toggle="modal" class="col-sm-4 btn btn-primary pull-left buttonid" >Story</a>
            items.push("<div  href='#myModal' data-toggle='modal'  id = '"  + valStory["id"] +  "' class = \"child\">");
            items.push( "<div class = 'story_Name' id = '" + valStory["story_Name"] + "'> " + valStory["story_Name"] + " </div>" );
            items.push("<div class='updates'>");
            if(valStory["story_notification"] > 0){
              items.push("<div class='att' id='not'> <span class=\"fa fa-bell-o\"></span>" + valStory["story_notification"] + "</div>");
            }
            if(valStory["story_comments"] > 0){
              items.push("<div class='att'><span class=\"fa fa-comment-o\"></span>" + valStory["story_comments"] + "</div>");
            }
            if(valStory["story_label"] > 0){
              items.push("<div class='att'> <span class=\"fa fa-tags\"></span>" + valStory["story_label"] + "</div>");
            }
            if(valStory["story_Description"]){
              items.push("<div class='att'> <span class=\"fa fa-book\"></span></div>");//Gliph Icon description
            }
            if(valStory["checklist_count"] > 0){
              items.push("<div class='att'> <span class=\"glyphicon glyphicon-list-alt\"></span>" + valStory["checklist_count"] + "</div>");
            }
            if(valStory["story_Attachment"] > 0){
              items.push("<div class='att'> <span class=\"fa fa-paperclip\"></span>" + valStory["story_Attachment"] + "</div>");
            }
            items.push("</div>");
            items.push("<div class='memberdiv'>");
            $.each( valStory["memberlist_initials"], function( keyStory, valStory ) {
              items.push( "<div class = 'memlist att'> " + valStory + " </div>" );
            });
            items.push("</div>");
            items.push("</div>");
          });
        }

        items.push("</div>");
        $( "<div/>", {
          "class": "parent",
          "id" : valList["list_id"],
          html: listDiv + items.join( "" )
        }).appendTo( ".sprintDiv" );

      });
      draggableFunc();

      $( "<div/>", {
        "class": "addStory",
        "id" : "addStory",
        html: "Add Storys..."
      }).appendTo( "#backlog" );
      items = [];
      items.push("<input type = 'text' class= 'addStoryText' placeholder = 'Story Name'>");
      items.push("<input type = 'button' class= 'submitButton btn btn-success' value = 'Add'>");
      items.push("<input type = 'button' class= 'cancelButton' value = 'X'>");
      $( "<div/>", {
        "class": "addStoryBox disable",
        "id" : "addStoryBox",
        html: items.join( "" )
      }).appendTo( "#backlog" );
      $("#addStory").on("click", function() {
        $("#addStory").addClass("disable");
        $("#addStoryBox").removeClass("disable");
      });
      $("#addStoryBox .cancelButton").on("click", function() {
        $("#addStory").removeClass("disable");
        $("#addStoryBox").addClass("disable");
      });
      $("#addStoryBox .submitButton").on("click", function() {
        $("#addStory").removeClass("disable");
        $("#addStoryBox").addClass("disable");
      });
      $(".child").on('click', function() {

        loadStory($(this).attr("id"));
      });
    }

  });
}
//Release and sprint code ends


//Activity list code

var prepositionsMap = {
  "added": " to ",
  "created": " the ",
  "commented": " on ",
  "moved": " to ",
  "changed": " to "
}

$(document).ready(function() {

  //setInterval(function(){ getActivity() }, 3000);
  getActivity()


  //Button click event to show and hide activity bar
  $('#showMenu').click(function() {
    $(".activity-bar").fadeToggle(300);
  });
  $('#sideBarClose').click(function() {
    $(".activity-bar").fadeOut(100);
  });



})



var getActivity = function( storyID) {
  var path = (storyID == undefined) ? ('/activity') : ('/activity?storyID=' + storyID)
  var activitiesHTML = "";

  $.getJSON(path, function(data) {
    $.each(data.reverse(), function(i, value) {

      var context = {};
      context.userid = value.userCreator.id;
      context.username = value.userCreator.name;
      context.firstLetter = value.userCreator.name.charAt(0);
      context.action = value.action;
      context.target = value.target.name;
      context.preposition = prepositionsMap[context.action];
      context.read = false;

      context.targetClass = "";
      switch (value.target.type) {
        case "story":
          context.targetClass = "activity-object-link";
          break;
        default:
          context.targetClass = "activity-object-link-disabled";
          break;
      }

      if (value.object) {
        context.objectClass = "";
        context.object = value.object.name
        context.comment = value.object.content;

        switch (value.object.type) {
          case "story":
            context.objectClass = "activity-object-link";
            break;
          case "member":
            context.objectClass = "activity-username activity-object-link-disabled";
            break;
          case "comment":
            context.objectClass = "activity-comment";
            break;
          default:
            context.objectClass = "activity-object-link-disabled";
            break;
        }
      }

      var templateScript = $("#activity-template").html(),
        template = Handlebars.compile(templateScript);

      var parsedHTML = template(context);
      activitiesHTML += parsedHTML

    });


    if(storyID != undefined)
    $('#activity_list').html('').append(activitiesHTML);
    else {
      $('#activities').html('').append(activitiesHTML);

    }

  });
}
