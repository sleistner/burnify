module ActsAsResourceController

  def self.included(base) # :nodoc:
    base.extend ClassMethods
  end

  module ClassMethods

    def acts_as_resource_controller options = {}
      self.send :include, ResourceMethods
    end

  end

  module ResourceMethods

    def create
      instance = model.create! params[model_name]
      headers['Location'] = send "#{model_name}_url", instance
      head :ok
    end

    def index
      render_formats model.all
    end

    def show
      instance = model.find(params[:id])
      render_formats instance
    end

    def update
      instance = model.find(params[:id])
      instance.update_attributes(params[model_name])
      render_formats instance
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
    
    def render_formats data
      respond_to do |format|
        format.json { render :json => data }
        format.xml  { render :xml  => data }
      end
    end
  
  end# ClassMethods

end