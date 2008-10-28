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
      cdata[:estimated_hours] = stories.map(&:estimated_hours).sum

      story_ids = [] # contains all story ids for this iteration
      _stories  = {} # fast access to a story by id

      stories.each do |story|
        story_ids << story.id
        _stories[story.id] = story
      end

      wdays = working_date_of_days
      stories_days = StoryHistory.all :conditions => ['story_id IN (?) AND day IN (?)', story_ids, wdays], :order => 'day'

      hm = {} # all histories from stories_days => hm[day][story_id] => history
      sh = {} # contains for each story the sorted list of histories

      stories_days.each do |history|
        (hm[date_of_day(history.day)] ||= {})[history.story_id] = history
        (sh[history.story_id] ||= []) << history
      end

      progress_on = lambda do |day, story_id|
        return _stories[story_id].estimated_hours if _stories[story_id].start_at && Date.parse(day) < _stories[story_id].start_at.to_date
        (hm[day][story_id].hours_left rescue sh[story_id].last.hours_left) rescue _stories[story_id].estimated_hours
      end

      cdata[:days] = wdays.map do |wday|
        hours = hm[wday].values.map(&:hours_left).compact rescue []
        unless hours.empty? || hours.size == story_ids.size
          hours = story_ids.map {|story_id| progress_on.call(wday, story_id) }
        end
        { :day => wday, :hours_left => (hours.empty? ? nil : hours.sum) }
      end

      #cdata[:stories] = stories.map &:chart_data # TODO please remove -- lazy load story data only if needed (on demand)
      cdata[:project] = { :name => project.name, :id => project_id }
    end
  end

  def estimated_hours
    stories.sum('estimated_hours')
  end

end
