var Actor = function(tmdb_obj, position) {
  this.tmdb = tmdb_obj.id;
  this.name = tmdb_obj.name;
  this.position = position;
  if (tmdb_obj.profile_path) {
    this.pic = 'http://d3gtl9l2a4fn1j.cloudfront.net/t/p/original/' + tmdb_obj.profile_path
  } else {
    this.pic = 'http://d3a8mw37cqal2z.cloudfront.net/assets/e7e54489e81e8eb/images/no-profile-w92.jpg'
  }
  this.el = $('#'+this.tmdb)
  this.html = "<div class='portrait'>" +
              "<img src='" + this.pic +
              "' width='92' height='138'>" + 
              this.name + "</div>";
}

Actor.prototype.setActor = function(el){
  $(el).html('');
  $(el).append(this.html)
};

Actor.prototype.appendAndListen = function(){
  var actor = this;
  $(this.html).on("click", function(e) {
    e.preventDefault();
    $(this).trigger("actorSelect", actor);
  }).appendTo('#actors_box');
};

Actor.prototype.appendToList = function(){
  $(this.html).appendTo('.starting_actor');
}

var Movie = function(tmdb_obj) {
  this.tmdb = tmdb_obj.id;
  this.title = tmdb_obj.title;
  if (tmdb_obj.poster_path) {
    this.pic = 'http://d3gtl9l2a4fn1j.cloudfront.net/t/p/original/' + tmdb_obj.poster_path
  } else {
    this.pic = '/assets/no-profile.jpg'
  }
}

var currentFrame = function(el) {
  this.el = $(el);
  this.movie = $('#current_movie');
  this.actor = $('#current_actor');
}

currentFrame.prototype.clearFrame = function() {
  this.movie.html('');
  this.actor.html('');
}

var wasInObj = function() {
  var self = this;
  this.currFrame = new currentFrame('.current');
  this.startActor = '';
  this.filmDropDown = $('#film_dropdown');
  this.castDropDown = $('#cast_dropdown');
  this.selectButton = $('#select_actor');
  this.removeButton = $('#remove_actor');
  this.randomStartButton = $('#random_start');
  this.randomEndButton = $('#random_end');
  this.actorChain = [];
  this.movieChain = [];
  
  this.castDropDown.on('change', function(){
    self.showCurrentActor();
  });

  this.removeButton.on('click', function(){
    self.removeActor();
  });

  this.selectButton.on('click', function(){
    if (self.endActor) {
      var actorId = $(self.castDropDown).children(":selected").attr("id");
      if (actorId) { self.selectActor(actorId) }
    }
    else {
      alert('Select an Ending Actor');
    }
  });

  this.randomStartButton.on('click',function(){
    self.currFrame.clearFrame();
    $.ajax({
      url: '/games/popular',
      method: 'POST',
      dataType: 'json',
      data: {start: this.startActor, end: this.endActor}
    }).done(function(actor){
      self.actorChain = [];
      var newStart = new Actor(actor);
      newStart.setActor('.starting_actor');
      self.setStartActor(newStart);
    });
  });

  this.randomEndButton.on('click',function(){
    $.ajax({
      url: '/games/popular',
      method: 'POST',
      dataType: 'json',
      data: {start: this.startActor, end: this.endActor}
    }).done(function(actor){
      var newEnd = new Actor(actor);
      newEnd.setActor('.ending_actor');
      self.endActor = newEnd;
    });
  });
}

wasInObj.prototype.setStartActor = function(actor) {
  this.startActor = actor;
  this.filmography = this.getFilms();
  this.actorChain.push(actor);
}

wasInObj.prototype.setEndActor = function(actor) {
  this.endActor = actor;
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
    var copied = '';

    $.ajax({
      url: '/games/find_film_by_id',
      method: 'POST',
      data: {id: movieId},
      dataType: 'json'
    }).done(function(movie){
      var newActor = true;
      var newMovie = true;
      var inMovie = new Movie(movie);
      $.each(self.actorChain, function(index, actor){
        if (workedWith.name === actor.name) { 
          newActor = false;
          copied = actor.name;
        }
      });
      $.each(self.movieChain, function(index, movie){
        if (inMovie.tmdb === movie.tmdb) { 
          newMovie = false;
          copied = movie.title;
        }
      });
      if (newActor && newMovie) {
        self.clearInstances();
        workedWith.appendToList();
        self.movieChain.push(inMovie);
        self.actorChain.push(workedWith);
        if(workedWith.tmdb === self.endActor.tmdb) {
          alert('You connected in ' + (self.actorChain.length-1) + ' steps!')
          self.persist();
        } 
        else {
          self.filmDropDown.off('change');
          self.updateActor(workedWith);
        }
      }
      else { $('#error').text(copied + ' already added') }
    });
  });
}

wasInObj.prototype.persist = function() {
  var actorArray = [];
  var filmArray = [];
  var self = this;

  $.each(this.actorChain, function(index, actor){
    var actorStats = [actor.name, actor.pic, actor.tmdb]
    actorArray.push(actorStats);
  })
  $.each(this.movieChain, function(index, movie){
    var movieStats = [movie.title, movie.pic, movie.tmdb]
    filmArray.push(movieStats);
  })
  $.ajax({
    url: '/games/persist',
    method: 'POST',
    data: {actors: actorArray, films: filmArray}
  }).done(function(data){
    window.location.href = data.location
  });
}

wasInObj.prototype.clearInstances = function() {
    $('#error').html('');
    this.currFrame.clearFrame();
}

wasInObj.prototype.removeActor = function() {
  var self = this;
  if (this.actorChain.length > 0) {
    self.clearInstances();
    this.actorChain.pop();
    this.movieChain.pop();
    $('.starting_actor').find('.portrait').last().detach();
    this.startActor = this.actorChain[this.actorChain.length-1];
    if (this.actorChain.length > 0) {
      this.filmography = this.getFilms()
    } else {
      this.clearFilmCast();
    }
  }
}

wasInObj.prototype.clearFilmCast = function() {
  this.castDropDown.html('');
  this.filmDropDown.html('');
}

wasInObj.prototype.showCurrentActor = function() {
  var self = this;
  var actorId = this.castDropDown.children(":selected").attr("id");
  if (actorId) {
    $.ajax({
      url: "/games/find_actor_by_id",
      method: 'POST',
      data: {id: actorId},
      dataType: 'json'
    }).done(function(actor){
      var workedWith = new Actor(actor);
      self.currFrame.actor.html(workedWith.html);
    });
  } else {
    self.currFrame.actor.html('');
  }
}

wasInObj.prototype.updateActor = function(actor) {
  this.startActor = actor;
  this.filmography = this.getFilms();
}

wasInObj.prototype.getCast = function (filmId, filmName) {
  var self = this;
  this.currFrame.actor.html('');
  (self.castDropDown).html('');
  $.ajax({
    url: '/games/cast',
    method: 'POST',
    data: {id: filmId},
    dataType: 'json'
  }).done(function(data){
    var curr_movie = "<div class='portrait'>" +
          "<img src='http://d3gtl9l2a4fn1j.cloudfront.net/t/p/original/" +
          data[1] + "' width='92' height='138'>" + filmName + "</div>";
    self.currFrame.movie.html(curr_movie);
    self.castDropDown.append($('<option>Cast</option>'));
    $.each(data[0], function(id, actor){
      var opt = $('<option/>');
      opt.attr('id', actor[0]);
      opt.text(actor[1]);
      opt.appendTo(self.castDropDown);
    });
  });
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
    });
    self.castDropDown.html('');
    self.filmDropDown.on('change', function(){
      var filmId = $(this).children(":selected").attr("id");
      var filmName = $(this).children(":selected").val();
      if (filmId) {
        self.getCast(filmId, filmName);
      } else {
        self.currFrame.clearFrame();
        self.castDropDown.html('');
      }
    });
  });
}

$(document).ready(function(){
  var wasIn = new wasInObj();

  $('body').on('actorSelect', function(event, actor){
    $('#actors_box').html('');
    if (actor.position === 'start') {
      actor.setActor('.starting_actor');
      wasIn.setStartActor(actor);
    }
    else {
      actor.setActor('.ending_actor');
      wasIn.setEndActor(actor);
    }
  });

  $('#starting_actor').on('submit', function(event){
    event.stopPropagation();
    event.preventDefault();
    $('#actors_box').html('');
    $.ajax({
      url: '/games/find_actor',
      method: 'POST',
      data: $(this).serialize(),
      dataType: 'json'
    }).done(function(actor_results){
      $.each(actor_results, function(index, value){
        var actor = new Actor(value, 'start');
        actor.appendAndListen();
      });
    });
  });

  $('#ending_actor').on('submit', function(event){
    event.stopPropagation();
    event.preventDefault();
    $('#actors_box').html('');
    $.ajax({
      url: '/games/find_actor',
      method: 'POST',
      data: $(this).serialize(),
      dataType: 'json'
    }).done(function(actor_results){
      $.each(actor_results, function(index, value){
        var actor = new Actor(value, 'end');
        actor.appendAndListen();
      });
    });
  });
});