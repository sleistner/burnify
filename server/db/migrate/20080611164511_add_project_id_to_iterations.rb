class AddProjectIdToIterations < ActiveRecord::Migration
  def self.up
    add_column :iterations, :project_id, :integer
    add_foreign_key :iterations, :projects, :on_delete => :cascade
  end

  def self.down
    remove_foreign_key :iterations, :projects
    remove_column :iterations, :project_id
  end
end
