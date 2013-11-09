var Actor = function(actor_obj) {
  this.tmdb = actor_obj.id;
  this.name = actor_obj.name;
  if (actor_obj.profile_path) {
    this.pic = 'http://d3gtl9l2a4fn1j.cloudfront.net/t/p/original/' + actor_obj.profile_path
  } else {
    this.pic = '/assets/no-profile.jpg'
  }
  this.el = $('#'+this.tmdb)
  this.html = "<div class='portrait'>" +
              "<img src='" + this.pic +
              "' width='92' height='138'>" + 
              this.name + "</div>";
}

Actor.prototype.setStartActor = function(){
  $('.starting_actor').html('');
  $('.starting_actor').append(this.html)
};

Actor.prototype.appendAndListen = function(){
  var actor = this;
  $(this.html).on("click", function(e) {
    e.preventDefault();
    $(this).trigger("actorSelect", actor);
  }).appendTo('#starting_actors_box');
};

$(document).ready(function(){
  $('body').on('actorSelect', function(event, actor){
    event.stopPropagation();
    event.preventDefault();
    $('#starting_actors_box').html('');
    actor.setStartActor();
  });

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
        actor.appendAndListen();
      });
    });
  })
});