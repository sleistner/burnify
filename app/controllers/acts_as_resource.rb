module ActsAsResource

  def create
    model = controller_name.singularize
    obj = model.camelize.constantize.create! params[model]
    headers['Location'] = send "#{model}_url", obj
    head :ok
  end

end