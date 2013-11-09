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

var wasInObj = function(actor) {
  this.startActor = actor;
  this.filmDropDown = $('#film_dropdown');
  this.castDropDown = $('#cast_dropdown');
  this.filmography = this.getFilms();
}

wasInObj.prototype.getFilms = function (){
  var self = this;
  $.ajax({
    url: '/games/filmography',
    method: 'POST',
    data: {id: this.startActor.tmdb},
    dataType: 'json'
  }).done(function(films){
    (self.filmDropDown).append($('<option>Filmography</option>'));
    $.each(films, function(id, film){
      var opt = $('<option/>');
      opt.attr('id', film[0]);
      opt.text(film[1]);
      opt.appendTo(self.filmDropDown);
    });
    self.filmDropDown.on('change', self.populateCast())
  });
}

wasInObj.prototype.populateCast = function(){
  var self = this;
  console.log($('#film_dropdown'));
  var movieId = (this.filmDropDown).val();
  $.ajax({
    url: '/games/cast',
    method: 'POST',
    data: {id: movieId},
    dataType: 'json'
  }).done(function(films){
    $('#cast_dropdown').append($('<option>Cast</option>'));
    $.each(films, function(id, actor){
      var opt = $('<option/>');
      opt.attr('id', actor[0]);
      opt.text(actor[1]);
      opt.appendTo($('#cast_dropdown'));
    });
  });
}

$(document).ready(function(){

  $('body').on('actorSelect', function(event, actor){
    event.stopPropagation();
    event.preventDefault();
    $('#starting_actors_box').html('');
    actor.setStartActor();
    var wasIn = new wasInObj(actor);
  });

  $('#starting_actor').on('submit', function(event){
    event.stopPropagation();
    event.preventDefault();
    $('#starting_actors_box').html('');
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