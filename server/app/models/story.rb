# == Schema Information
# Schema version: 20080616190553
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
#  start           :datetime        
#  deadline        :datetime        
#

class Story < ActiveRecord::Base
  include Chartify
  
  belongs_to :iteration
  has_many :histories, :class_name => 'StoryHistory'

  validates_presence_of :name
  validates_presence_of :iteration

  validates_uniqueness_of :name, :scope => :iteration_id

  validates_numericality_of :estimated_hours, :greater_than_or_equal_to => 0

  def start_at
    read_attribute(:start_at) || iteration.start_at
  end

  def deadline
    read_attribute(:deadline) || iteration.deadline
  end
  
  def progress_on day
    returning Progress.new do |progress|
      if hours_left = hours_left_on(day)
        progress.hours_left = hours_left
        progress.empty = false
      else
        progress.hours_left = histories.sort.last.hours_left rescue estimated_hours
      end
    end
  end

  def hours_left_on day
    histories.find_by_day(day).hours_left rescue nil
  end

  def set_hours_left day, left
    histories.find_or_create_by_day(day).update_attributes! :hours_left => left
  end

  private

    class Progress
      attr_accessor :hours_left, :empty
    
      def initialize; @empty = true end

      def empty?; @empty end
      
    end#Progress
    
end#Story
