require 'spec_helper'

describe GamesController do
  describe '#persist' do
    context 'given valid attributes' do
      before(:each) do
        @actors = [['actor1', 'pic1', '1'], ['actor2', 'pic2', '2'], ['actor3', 'pic3', '3']]
        @movies = ['4', '5']
      end

      it 'creates a new game' do
        expect{ post :persist, :actors => @actors, :movies => @movies
          }.to change(Game, :count).by(1)
      end

      it 'creates 2 guesses' do
        expect{ post :persist, :actors => @actors, :movies => @movies
          }.to change(Guess, :count).by(2)
      end

      it 'creates 3 actors' do
        expect{ post :persist, :actors => @actors, :movies => @movies
          }.to change(Actor, :count).by(3)
      end
    end
  end
end