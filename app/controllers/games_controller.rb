class GamesController<ApplicationController
  include RottenTomatoes
  
  def new
    @movie = RottenMovie.find(:imdb => 137523)
  end
end