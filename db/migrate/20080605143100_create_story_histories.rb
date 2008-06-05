class CreateStoryHistories < ActiveRecord::Migration
  def self.up
    create_table :story_histories do |t|
      t.integer :hours_left
      t.belongs_to :story

      t.timestamps
    end
    
    add_foreign_key :story_histories, :stories, :on_delete => :cascade
  end

  def self.down
    drop_table :story_histories
  end
end
