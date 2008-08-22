# == Schema Information
# Schema version: 20080617193638
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
#  start_at        :datetime        
#  deadline        :datetime        
#  color           :string(255)     default("#cccccc")
#

class Story < ActiveRecord::Base
  include Chartify
  include StartAtAndDeadline

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

  def chart_data
    init_chart_data do |cdata|
      cdata[:estimated_hours] = estimated_hours

      wdays = working_date_of_days
      days  = histories.all :conditions => ['day IN (?)', wdays], :order => 'day'

      hours_left   = Hash[*days.map {|hi| [date_of_day(hi.day), hi.hours_left] }.flatten]
      cdata[:days] = wdays.map {|day| { :day => day, :hours_left => hours_left[day] }}
    end
  end

  def hours_left_on day
    histories.find_by_day(day.is_a?(DateTime) ? date_of_day(day) : day).hours_left rescue nil
  end

  def set_hours_left day, hours_left
    histories.find_or_create_by_day(day).update_attributes! :hours_left => hours_left
  end
end
