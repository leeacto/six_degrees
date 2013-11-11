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
  var self = this;
  this.startActor = actor;
  this.filmDropDown = $('#film_dropdown');
  this.castDropDown = $('#cast_dropdown');
  this.selectButton = $('#select_actor');
  this.removeButton = $('#remove_actor');
  this.actorChain = [];
  this.movieChain = [];
  this.filmography = this.getFilms();

  this.castDropDown.on('change', function(){
    self.showCurrentActor();
  });

  this.removeButton.on('click', function(){
    self.removeActor();
  });

  this.selectButton.on('click', function(){
    var actorId = $(self.castDropDown).children(":selected").attr("id");
    self.selectActor(actorId);
  });
}

wasInObj.prototype.selectActor = function(actorId) {
  var self = this;
  $.ajax({
    url: "/games/find_actor_by_id",
    method: 'POST',
    data: {id: actorId},
    dataType: 'json'
  }).done(function(actor){
    var workedWith = new Actor(actor);
    var movieId = self.filmDropDown.children(":selected").attr("id");
    var newActor = true;
    var newMovie = true;
    $.each(self.actorChain, function(index, actor){
      if (workedWith.name === actor.name) { newActor = false }
    });
    if ($.inArray(movieId, self.movieChain) >= 0) { newMovie = false }
    if (newActor && newMovie) {
      $('#error').text('');
      $('.current').html("<div id='current_movie'></div>" + 
        "<div id='current_actor'></div>")
      workedWith.appendToList();
      self.movieChain.push(self.filmDropDown.children(":selected").attr("id"));
      self.actorChain.push(workedWith);
      if(workedWith.tmdb === 4724) {
        alert('You connected in ' + (self.actorChain.length-1) + ' steps!')
        self.persist();
      } else { self.updateActor(workedWith) }
    }
    else { $('#error').text('Actor/Movie already added') }
  });
}

wasInObj.prototype.persist = function() {
  var actorIds = [];
  var movieIds = [];
  var self = this;

  $.each(this.actorChain, function(index, actor){
    actorIds.push(actor.tmdb);
  })
  $.each(this.movieChain, function(index, movie){
    movieIds.push(movie);
  })
  $.ajax({
    url: '/games/persist',
    method: 'POST',
    data: {actors: actorIds, movies: movieIds}
  }).done(function(data){
    window.location.href = data.location
  });
}

wasInObj.prototype.removeActor = function() {
  if (this.actorChain.length > 0) {
    this.actorChain.pop();
    this.movieChain.pop();
    $('.starting_actor').find('.portrait').last().detach();
  }
}

wasInObj.prototype.showCurrentActor = function() {
  var actorId = this.castDropDown.children(":selected").attr("id");
  $.ajax({
    url: "/games/find_actor_by_id",
    method: 'POST',
    data: {id: actorId},
    dataType: 'json'
  }).done(function(actor){
    var workedWith = new Actor(actor);
    $('#current_actor').html(workedWith.html);
  });
}

wasInObj.prototype.updateActor = function(actor) {
  this.startActor = actor;
  this.filmography = this.getFilms();
}

wasInObj.prototype.getFilms = function (){
  var self = this;
  this.filmDropDown.html('');
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
      var movieName = $(this).children(":selected").val();

      $.ajax({
        url: '/games/cast',
        method: 'POST',
        data: {id: movieId},
        dataType: 'json'
      }).done(function(data){
        var curr_movie = "<div class='portrait'>" +
              "<img src='http://d3gtl9l2a4fn1j.cloudfront.net/t/p/original/" +
              data[1] + "' width='92' height='138'>" + movieName + "</div>";
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
  $('body').on('actorSelect', function(event, actor){
    $('#starting_actors_box').html('');
    actor.setStartActor();
    var wasIn = new wasInObj(actor);
    wasIn.actorChain.push(actor);
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