# == Schema Information
# Schema version: 20080616190553
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
  include Chartify

  belongs_to :project
  has_many :stories
  
  validates_presence_of :name
  validates_presence_of :start_at
  validates_presence_of :deadline
  validates_presence_of :project

  validates_uniqueness_of :name, :scope => :project_id

  def validate
    if deadline && start_at
      errors.add(:deadline, "should be greater then #{start_at}.") if deadline < start_at
    end
  end
  
  def chart_data_with_extension
    returning chart_data_without_extension do |chart_data|
      stories.each { |stary| (chart_data[:stories] ||= []) << stary.chart_data }
    end
  end
  
  alias_method_chain :chart_data, :extension
  
  private
  
    def estimated_hours
      stories.map(&:estimated_hours).sum
    end
    
    def hours_left_on day
      progresses = stories.map { |story| story.progress_on day }
      progresses.all?(&:empty?) ? nil : progresses.map(&:hours_left).sum
    end

end
