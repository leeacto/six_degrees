require 'spec_helper'

describe GamesController do
  describe '#persist' do
    context 'given valid attributes' do
      before(:each) do
        @actors = {'0' => ['actor1', 'pic1', '1'], '1' => ['actor2', 'pic2', '2'], '2' => ['actor3', 'pic3', '3']}
        @films = {'0' => ['film1', 'pic1', '1'], '1' => ['film2', 'pic2', '2']}
      end

      it 'creates a new game' do
        expect{ post :persist, :actors => @actors, :films => @films
          }.to change(Game, :count).by(1)
      end

      it 'creates 2 guesses' do
        expect{ post :persist, :actors => @actors, :films => @films
          }.to change(Guess, :count).by(2)
      end

      it 'creates 3 actors' do
        expect{ post :persist, :actors => @actors, :films => @films
          }.to change(Actor, :count).by(3)
      end

      it 'creates 2 films' do
        expect{ post :persist, :actors => @actors, :films => @films
          }.to change(Film, :count).by(2)
      end
    end
  end
end