require File.dirname(__FILE__) + '/../test_helper'

class IterationTest < ActiveSupport::TestCase

  def test_should_not_create_without_project
    it = Iteration.new :name => 'foo', :start => Time.now, :deadline => 23.days.from_now
    assert !it.valid?
    assert_not_nil it.errors.on(:project)
  end

  def test_create_with_project_as_object
    pr = Project.create :name => 'foo_project'

    it = Iteration.create :name => 'foo', :start => Time.now, :deadline => 23.days.from_now, :project => pr
    assert_valid it

    assert_equal Project.find(pr.id).iterations.find_by_name('foo').id, it.id
  end

  def test_create_with_project_id
    pr = Project.create :name => 'foo_project'

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

end
