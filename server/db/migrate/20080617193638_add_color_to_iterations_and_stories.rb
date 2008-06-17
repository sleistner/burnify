class AddColorToIterationsAndStories < ActiveRecord::Migration
  def self.up
    add_column :iterations, :color, :string, :default => '#cccccc'
    add_column :stories, :color, :string, :default => '#cccccc'
    
    Iteration.update_all "color = '#ff0000'"
    Story.update_all "color = '#ff0000'"
  end

  def self.down
    remove_column :stories, :color
    remove_column :iterations, :color
  end
end
