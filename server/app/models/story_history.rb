# == Schema Information
# Schema version: 20080616190553
#
# Table name: story_histories
#
#  id         :integer(11)     not null, primary key
#  hours_left :integer(11)     
#  story_id   :integer(11)     
#  created_at :datetime        
#  updated_at :datetime        
#  day        :datetime        
#

class StoryHistory < ActiveRecord::Base
  belongs_to :story

  validates_presence_of :story
  validates_presence_of :day
  
  validates_uniqueness_of :day, :scope => :story_id
  
  validates_numericality_of :hours_left, :greater_than_or_equal_to => 0
end
