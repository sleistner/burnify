class AddDayToStoryHistories < ActiveRecord::Migration
  def self.up
    add_column :story_histories, :day, :datetime
  end

  def self.down
    remove_column :story_histories, :day
  end
end
