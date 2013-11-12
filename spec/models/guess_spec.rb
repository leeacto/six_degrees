require 'spec_helper'

describe "Guess" do
  before(:each) do
    @from_actor = Actor.create(:name => 'From', :profile_url => '/from', :tmdb => 1)
    @to_actor = Actor.create(:name => 'To', :profile_url => '/to', :tmdb => 2)
    @film = Film.create(:title => 'Movie', :profile_url => '/movieurl', :tmdb => 4)
    @guess = Guess.create(:from_actor_id => 1, :to_actor_id => 2, :film_id => 3, :film_id => 4)
  end

  describe 'from_actor' do
    it 'links the tmdb to an actor' do
      expect(@guess.from_actor).to eq @from_actor
    end
  end

  describe 'to_actor' do
    it 'links the tmdb to an actor' do
      expect(@guess.to_actor).to eq @to_actor
    end
  end

  describe 'film' do
    it 'links the tmdb to a film' do
      expect(@guess.film).to eq @film
    end
  end
end
