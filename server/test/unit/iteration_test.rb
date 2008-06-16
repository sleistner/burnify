require File.dirname(__FILE__) + '/../test_helper'

class IterationTest < ActiveSupport::TestCase

  def setup
    Calendar.create! :name => 'Berlin', :ics => File.read(File.join(RAILS_ROOT, 'config', 'berlin.ics'))
  end

  def test_should_not_create_without_project
    it = Iteration.new :name => 'foo', :start => Time.now, :deadline => 23.days.from_now
    assert !it.valid?
    assert_not_nil it.errors.on(:project)
  end

  def test_create_with_project_as_object
    pr = projects(:connect)

    it = Iteration.create :name => 'foo', :start => Time.now, :deadline => 23.days.from_now, :project => pr
    assert_valid it

    assert_equal Project.find(pr.id).iterations.find_by_name('foo').id, it.id
  end

  def test_create_with_project_id
    pr = projects(:connect)

    it = Iteration.create :name => 'foo', :start => Time.now, :deadline => 23.days.from_now, :project_id => pr.id
    assert_valid it

    assert_equal Project.find(pr.id).iterations.find_by_name('foo').id, it.id
  end

  def test_should_not_create_with_invalid_project_id
    Project.find(23).delete rescue nil

    it = Iteration.new :name => 'foo', :start => Time.now, :deadline => 23.days.from_now, :project_id => 23
    assert !it.valid?
    assert_not_nil it.errors.on(:project)
  end
  
  def test_should_generate_chart_data
    it = Iteration.new :name => 'foo', :start => Date.new(2008, 05, 01).to_datetime, :deadline => Date.new(2008, 05, 05).to_datetime
    it.stories.build :estimated_hours => 20
    it.stories.build :estimated_hours => 40
    chart_data = it.chart_data
    assert_equal 60, chart_data[:estimated_hours]
    assert_equal 2, chart_data[:days].size
  end

  def test_should_generate_empty_chart_data
    it = Iteration.new :name => 'foo', :start => Date.new(2008, 05, 01).to_datetime, :deadline => Date.new(2008, 05, 05).to_datetime
    chart_data = it.chart_data
    assert_equal 0, chart_data[:estimated_hours]
    assert_equal 2, chart_data[:days].size
    assert_equal [], chart_data[:days].map { |h| h[:left] }.compact
  end

end
