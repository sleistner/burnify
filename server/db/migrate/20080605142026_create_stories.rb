class CreateStories < ActiveRecord::Migration
  def self.up
    create_table :stories do |t|
      t.string :name
      t.text :description
      t.belongs_to :iteration
      t.integer :estimated_hours
      t.timestamps
    end
    
    add_foreign_key :stories, :iterations, :on_delete => :cascade
  end

  def self.down
    drop_table :stories
  end
end
