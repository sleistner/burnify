class AddStartAndDeadlineToStories < ActiveRecord::Migration
  def self.up
    add_column :stories, :start, :datetime
    add_column :stories, :deadline, :datetime
  end

  def self.down
    remove_column :stories, :start
    remove_column :stories, :deadline
  end
end
