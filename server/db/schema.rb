# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20080617193638) do

  create_table "calendars", :force => true do |t|
    t.string   "name"
    t.text     "ics"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "iterations", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.date     "start_at"
    t.date     "deadline"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "project_id",  :limit => 11
    t.string   "color",                     :default => "#cccccc"
  end

  add_index "iterations", ["project_id"], :name => "fk_iterations_projects"

  create_table "projects", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stories", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "iteration_id",    :limit => 11
    t.integer  "estimated_hours", :limit => 11
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "start_at"
    t.datetime "deadline"
    t.string   "color",                         :default => "#cccccc"
  end

  add_index "stories", ["iteration_id"], :name => "fk_stories_iterations"

  create_table "story_histories", :force => true do |t|
    t.integer  "hours_left", :limit => 11
    t.integer  "story_id",   :limit => 11
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "day"
  end

  add_index "story_histories", ["story_id"], :name => "fk_story_histories_stories"

end
