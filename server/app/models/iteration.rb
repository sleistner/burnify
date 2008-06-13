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
  
  def chart_data
    returning Hash.new do |iteration|
      iteration[:estimated_hours] = stories.map(&:estimated_hours).sum
      working_days.each { |day| (iteration[:days] ||= []) << { :day => day, :left => hours_left_on(day) } }
    end
  end
  
  private
    
    # TODO: we need to implement the calendar working days check here or in an module
    def working_days
      (start..deadline)
    end
    
    def hours_left_on day
      hours = stories.map { |story| story.hours_left_on day }.compact
      hours.empty? ? nil : hours.sum
    end

end
