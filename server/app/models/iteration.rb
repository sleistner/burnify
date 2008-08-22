# == Schema Information
# Schema version: 20080617193638
#
# Table name: iterations
#
#  id          :integer(11)     not null, primary key
#  name        :string(255)     
#  description :text            
#  start_at    :date            
#  deadline    :date            
#  created_at  :datetime        
#  updated_at  :datetime        
#  project_id  :integer(11)     
#  color       :string(255)     default("#cccccc")
#

class Iteration < ActiveRecord::Base
  include Chartify
  include StartAtAndDeadline

  belongs_to  :project
  has_many    :stories
  
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

  def chart_data
    init_chart_data do |cdata|
      wdays = working_date_of_days

      story_ids = [] # contains all story ids for this iteration
      _stories  = {} # fast access to a story by id

      stories.each do |story|
        story_ids << story.id
        _stories[story.id] = story
      end

      stories_days = StoryHistory.all :conditions => ['story_id in (?) AND day IN (?)', story_ids, wdays], :order => 'day'

      hm = {} # all histories of stories_days => hm[day][story_id] => history
      sh = {} # contains for each story the sorted list of histories

      stories_days.each do |history|
        (hm[date_of_day(history.day)] ||= {})[history.story_id] = history
        (sh[history.story_id] ||= []) << history
      end

      progress_on = lambda do |day, story_id|
        (hm[day][story_id].hours_left rescue sh[story_id].last.hours_left) rescue _stories[story_id].estimated_hours
      end

      cdata[:days] = wdays.map do |wday|
        hours = hm[wday].values.map(&:hours_left).compact rescue []
        unless hours.empty? || hours.size == story_ids.size
          hours = story_ids.map {|story_id| progress_on.call(wday, story_id) }
        end
        { :day => wday, :hours_left => (hours.empty? ? nil : hours.sum) }
      end

      cdata[:stories] = stories.map &:chart_data # TODO please remove -- lazy load story data only if needed (on demand)
    end
  end

  def estimated_hours
    stories.sum('estimated_hours')
  end

=begin  
  def hours_left_on day
    progresses = stories.map { |story| story.progress_on day }
    progresses.all?(&:empty?) ? nil : progresses.map(&:hours_left).sum
  end
=end

end
