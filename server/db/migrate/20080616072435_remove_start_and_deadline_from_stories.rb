class RemoveStartAndDeadlineFromStories < ActiveRecord::Migration
  def self.up
    remove_column :stories, :start rescue nil
    remove_column :stories, :deadline rescue nil
  end

  def self.down
    add_column :stories, :deadline, :date rescue nil
    add_column :stories, :start, :date rescue nil
  end
end
