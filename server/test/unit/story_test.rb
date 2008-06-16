require File.dirname(__FILE__) + '/../test_helper'

class StoryTest < ActiveSupport::TestCase

  def setup
    Calendar.create! :name => 'Berlin', :ics => File.read(File.join(RAILS_ROOT, 'config', 'berlin.ics'))
  end

  def test_should_not_create_without_iteration
    st = Story.new :name => 'foo', :estimated_hours => 150
    assert !st.valid?
    assert_not_nil st.errors.on(:iteration)
  end
  
  def test_create_with_iteration_as_object
    it = iterations(:june)
    st = Story.create :name => 'foo', :estimated_hours => 150, :iteration => it

    assert_valid st
    assert_equal Iteration.find(it.id).stories.find_by_name('foo').id, st.id
  end
  
  def test_create_with_project_id
    it = iterations(:june)
    st = Story.create :name => 'foo', :estimated_hours => 150, :iteration_id => it.id

    assert_valid st
    assert_equal Iteration.find(it.id).stories.find_by_name('foo').id, st.id
  end

  def test_should_not_create_with_invalid_iteration_id
    Iteration.find(23).delete rescue nil

    st = Story.new :name => 'foo', :estimated_hours => 150, :iteration_id => 23
    
    assert !st.valid?
    assert_not_nil st.errors.on(:iteration)
  end

  def test_should_generate_chart_data
    it = iterations(:june)
    it.update_attributes :start => Date.new(2008, 05, 01).to_datetime, :deadline => Date.new(2008, 05, 05).to_datetime
    
    st = stories(:urar)
    st.histories.create :hours_left => 10, :day => it.working_days.first, :story => st
    chart_data = st.chart_data
    assert_equal 10, chart_data[:days].first[:left]
    assert_equal nil, chart_data[:days].last[:left]
  end
end
