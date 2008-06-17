require File.dirname(__FILE__) + '/../test_helper'

class StoriesControllerTest < ActionController::TestCase

  def setup
    Calendar.create! :name => 'Berlin', :ics => File.read(File.join(RAILS_ROOT, 'config', 'berlin.ics'))
  end

  def test_should_return_working_days_list
    story = stories(:urar)
    xhr :get, :working_days, :id => story.id
    working_days = ActiveSupport::JSON.decode(@response.body)['days']

    assert_equal story.start_at, working_days.first['day'].to_datetime
    assert_equal story.deadline, working_days.last['day'].to_datetime
  end
end
