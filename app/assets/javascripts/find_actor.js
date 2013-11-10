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

Actor.prototype.appendToList = function(){
  $(this.html).appendTo('.starting_actor');
}

var wasInObj = function(actor) {
  this.startActor = actor;
  this.filmDropDown = $('#film_dropdown');
  this.castDropDown = $('#cast_dropdown');
  this.selectButton = $('#select_actor');
  this.filmography = this.getFilms();
  this.castDropDown.on('change', function(){
    var actorId = $(this).children(":selected").attr("id");
    $.ajax({
      url: "/games/find_actor_by_id",
      method: 'POST',
      data: {id: actorId},
      dataType: 'json'
    }).done(function(actor){
      var workedWith = new Actor(actor);
      $('#current_actor').html(workedWith.html);
    });
  })
}

wasInObj.prototype.updateActor = function(actor) {
  this.startActor = actor;
  this.filmography = this.getFilms();
}

wasInObj.prototype.getFilms = function (){
  var self = this;
  (self.filmDropDown).html('');
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
    })
  }).done(function(){
    $('#cast_dropdown').html('');
    self.filmDropDown.on('change', function(){
      (self.castDropDown).html('');
      var movieId = $(this).children(":selected").attr("id");

      $.ajax({
        url: '/games/cast',
        method: 'POST',
        data: {id: movieId},
        dataType: 'json'
      }).done(function(data){
        var curr_movie = "<div class='portrait'>" +
              "<img src='http://d3gtl9l2a4fn1j.cloudfront.net/t/p/original/" +
              data[1] + "' width='92' height='138'></div>";
        $('#current_movie').html(curr_movie);
        $('#cast_dropdown').append($('<option>Cast</option>'));

        $.each(data[0], function(id, actor){
          var opt = $('<option/>');
          opt.attr('id', actor[0]);
          opt.text(actor[1]);
          opt.appendTo($('#cast_dropdown'));
        });
      });
    });
  });
}

$(document).ready(function(){
 var actorChain = [];

  $('body').on('actorSelect', function(event, actor){
    event.stopPropagation();
    event.preventDefault();
    $('#starting_actors_box').html('');
    actorChain.push(actor);
    actor.setStartActor();
    var wasIn = new wasInObj(actor);
    wasIn.selectButton.on('click', function(){
      $('.current').html("<div id='current_movie'></div>" + 
        "<div id='current_actor'></div>")
      var actorId = $(wasIn.castDropDown).children(":selected").attr("id");
      $.ajax({
        url: "/games/find_actor_by_id",
        method: 'POST',
        data: {id: actorId},
        dataType: 'json'
      }).done(function(actor){
        var workedWith = new Actor(actor);
        workedWith.appendToList();
        actorChain.push(workedWith);
        if(workedWith.tmdb === 4724) {
          console.log(actorChain);
          alert('You connected in ' + (actorChain.length-1) + ' steps!')
        } else {
          wasIn.updateActor(workedWith);
        }
      });
    })
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
  });
});