require File.dirname(__FILE__) + '/../test_helper'

class ProjectsControllerTest < ActionController::TestCase

  def test_should_not_create_without_required_attributes
    xhr :post, :create, :project => {
      # empty
    }
    assert_response :unprocessable_entity, @response.body
  end

  def test_create_should_return_valid_location
    xhr :post, :create, :project => {
      :name => 'foo_project'
    }
    assert_response :ok, @response.body

    location = @response.headers['Location']
    assert_not_nil location
    assert_match /projects\/#{Project.find_by_name('foo_project').id}$/, location
  end
end
