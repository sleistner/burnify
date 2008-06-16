class RemoveStartAndDeadlineFromStories < ActiveRecord::Migration
  def self.up
    remove_column :stories, :start
    remove_column :stories, :deadline
  end

  def self.down
    add_column :stories, :deadline, :date
    add_column :stories, :start, :date
  end
end
