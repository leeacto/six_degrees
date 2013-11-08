var Actor = function(actor_obj) {
  this.tmdb = actor_obj.id;
  this.name = actor_obj.name;
  this.pic = actor_obj.profile_path
  this.html = "<div><img src='http://d3gtl9l2a4fn1j.cloudfront.net/t/p/original/" + this.pic + "' width='92' height='138'>" + 
              this.name + "</div>";
};


$(document).ready(function(){
  $('#starting_actor').on('submit', function(event){
    event.stopPropagation();
    event.preventDefault();

    $.ajax({
      url: "/games/find_actor",
      method: 'POST',
      data: $(this).serialize(),
      dataType: 'json'
    }).done(function(actor_results){
      $.each(actor_results, function(index, value){
        var actor = new Actor(value);
        $('#starting_actor_box').append(actor.html);
        console.log(actor.name);
      });
    });
  })
});