class RenameColumnEndOnIterations < ActiveRecord::Migration
  def self.up
    rename_column :iterations, :end, :deadline
  end

  def self.down
    rename_column :iterations, :deadline, :end
  end
end
