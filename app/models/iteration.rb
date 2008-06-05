class Iteration < ActiveRecord::Base
  validates_presence_of :name
  validates_presence_of :start
  validates_presence_of :deadline
  
  validates_uniqueness_of :name
  
  def validate
    errors.add(:deadline, "should be greater then #{start}.") if deadline < start
  end
  
end
