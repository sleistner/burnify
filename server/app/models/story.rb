# == Schema Information
# Schema version: 20080616072435
#
# Table name: stories
#
#  id              :integer(11)     not null, primary key
#  name            :string(255)     
#  description     :text            
#  iteration_id    :integer(11)     
#  estimated_hours :integer(11)     
#  created_at      :datetime        
#  updated_at      :datetime        
#

class Story < ActiveRecord::Base
  include Chartify
  
  belongs_to :iteration
  has_many :histories, :class_name => 'StoryHistory'

  validates_presence_of :name
  validates_presence_of :iteration

  validates_uniqueness_of :name, :scope => :iteration_id

  validates_numericality_of :estimated_hours, :greater_than_or_equal_to => 0

  def hours_left_on day
    histories.find_by_day(day).hours_left rescue nil
  end
  
  private
  
    def working_days
      iteration.working_days
    end
end
