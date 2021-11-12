function Gauge(el) {
    var element,
        data,
        needle,
        value = parseFloat(el.getAttribute("data-value")),
        prop;
    
    var setElement = function(el) {
        element = el;
        data = element.querySelector(".gauge__data");
        needle = element.querySelector(".gauge__needle");
    };

    var setValue = function(x) {
        value = x;
        var turns = -0.5 + (x * 0.5);
        data.style[prop] = "rotate(" + turns + "turn)";
        needle.style[prop] = "rotate(" + turns + "turn)";
    };

    function exports() { };

    exports.element = function(el) {
        if (!arguments.length) { return element; }
        setElement(el);
        return this;
    };

    exports.value = function(x) {
        if (!arguments.length) { return value; }
        setValue(x);
        return this;
    };

    var body = document.getElementsByTagName("body")[0];
    ["webkitTransform", "mozTransform", "msTransform", "oTransform", "transform"].
        forEach(function(p) {
            if (typeof body.style[p] !== "undefined") { prop = p; }
        }
    );

    if (arguments.length) {
        setElement(el);
    }
    setValue(value);
    return exports;

};
$(document).on('daPageLoad', function(){
    var gauges = document.getElementsByClassName('gauge');
    if (gauges.length > 0) {
        Array.prototype.forEach.call(gauges, function (gauge) {
            new Gauge(gauge); 
        });       
    }
  
    var commentBlocks = $('.comment-block');
    if (commentBlocks) {
      if (commentBlocks.length > 0) {
        commentBlocks.each(function(i) {
          var lawyerTag = $(this).attr('data-lawyer');
          var commentHtml = "<div class='form-group row'><div class='col-md-12'><label for='comment'>Comment</label><textarea id='comment' class='form-control comment' placeholder='Enter comments regarding this question' rows='3'></textarea></div></div><div class='row'><div class='col-md-12'><div class='custom-control custom-checkbox'><input type='checkbox' class='custom-control-input signoff-check' id='signed-off-"+i+"'><label class='custom-control-label comment-label' for='signed-off-"+i+"'>Check here to indicate this page has not been signed off by "+lawyerTag+"</label></div></div></div><div class='row mt-3'><div class='col-md-12'><button type='button' class='btn btn-primary post-comment'>Submit</button></div></div>";
          $(this).html(commentHtml);
       });
        
       $('.comment-block').on('click', '.post-comment', function(){
         var commentBlock = $(this).parents('.comment-block');
         var comment = $(commentBlock).find('textarea.comment');
         var checkInput = $(commentBlock).find('input.signoff-check');
         var signOffCheck = false;
         if (comment) {
           if (!/\S/.test($(comment).val())){
             flash("Please add comment to submit!", "danger", true);
             return false;
           }
           if($(checkInput).prop('checked') == true){
             signOffCheck = true;
           }
           var question = $(commentBlock).attr("data-question");
           var lawyer = $(commentBlock).attr("data-lawyer");
           flash("Sending . . .", "info", true);
           action_call("post_comment", {"question": question, "comment": $(comment).val(), "signoff_check": signOffCheck, "lawyer_tag": lawyer}, function(data){
             if (data.success){
               $(comment).val('');
               $(checkInput).prop('checked', false);
               flash("Comment successfully sent!", "info", true);
             } else {
               flash("Error while sending comment!", "danger", true);
             }
           });
           return false;
         }
       });
     }
   }
});
