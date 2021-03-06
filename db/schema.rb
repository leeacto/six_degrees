# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131112160518) do

  create_table "actors", force: true do |t|
    t.string   "name"
    t.string   "profile_url"
    t.integer  "tmdb"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "films", force: true do |t|
    t.string   "title"
    t.string   "profile_url"
    t.integer  "tmdb"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "games", force: true do |t|
    t.integer  "actor_start_id"
    t.integer  "actor_end_id"
    t.integer  "steps"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "actor_start_name"
    t.string   "actor_end_name"
  end

  create_table "guesses", force: true do |t|
    t.integer  "film_id"
    t.integer  "from_actor_id"
    t.integer  "to_actor_id"
    t.integer  "game_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
