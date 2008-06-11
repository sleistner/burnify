module ActsAsResource

  def create
    instance = model.create! params[model_name]
    headers['Location'] = send "#{model_name}_url", instance
    head :ok
  end

  def index
    respond_to do |format|
      format.json { render :json => model.all }
      format.xml  { render :xml  => model.all }
    end
  end

  def show
    instance = model.find(params[:id])
    respond_to do |format|
      format.json { render :json => instance }
      format.xml  { render :xml  => instance }
    end
  end

  def update
    instance = model.find(params[:id])
    instance.update_attributes(params[model_name])
    respond_to do |format|
      format.json { render :json => instance }
      format.xml  { render :xml  => instance }
    end
  end

  def destroy
    model.destroy model.find(params[:id])
    head :ok
  end


private

  def model_name
    @model_name ||= controller_name.singularize
  end

  def model
    @model ||= model_name.camelize.constantize
  end
end