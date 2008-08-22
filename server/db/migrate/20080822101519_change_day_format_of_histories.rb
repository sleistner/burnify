class ChangeDayFormatOfHistories < ActiveRecord::Migration
  def self.up
    change_column :story_histories, :day, :date
  end

  def self.down
    change_column :story_histories, :day, :datetime
  end
end
