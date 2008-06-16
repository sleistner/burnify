class RenameColumnStartToStartAtOnIterationsAndStories < ActiveRecord::Migration
  def self.up
    rename_column :iterations, :start, :start_at
    rename_column :stories, :start, :start_at
  end

  def self.down
    rename_column :stories, :start_at, :start
    rename_column :iterations, :start_at, :start
  end
end
