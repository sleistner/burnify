# == Schema Information
# Schema version: 20080611171750
#
# Table name: iterations
#
#  id          :integer(11)     not null, primary key
#  name        :string(255)     
#  description :text            
#  start       :date            
#  deadline    :date            
#  created_at  :datetime        
#  updated_at  :datetime        
#  project_id  :integer(11)     
#

class Iteration < ActiveRecord::Base

  belongs_to :project
  has_many :stories
  
  validates_presence_of :name
  validates_presence_of :start
  validates_presence_of :deadline

  validates_presence_of :project

  validates_uniqueness_of :name, :scope => :project_id

  def validate
    if deadline && start
      errors.add(:deadline, "should be greater then #{start}.") if deadline < start
    end
  end

end
