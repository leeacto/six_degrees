class Actor < ActiveRecord::Base
  validates_uniqueness_of :tmdb
  validates_presence_of :tmdb

  def to_s
    name
  end
end
