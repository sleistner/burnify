module ActsAsResourceController

  def self.included(base) # :nodoc:
    base.extend ClassMethods
  end

  module ClassMethods

    def acts_as_resource_controller options = {}
      include ResourceMethods

      define_method(:belongs_to) { options[:belongs_to] }
      define_method(:order) { options[:order] || 'id ASC' }
      define_method(:conditions) { (options[:conditions] ||= []).map { |v| v.is_a?(Proc) ? v.call(self) : v } }
    end

  end# ClassMethods

  module ResourceMethods

    def create
      self.instance = model.create! params[model_name]
      headers['Location'] = send "#{model_name}_url", instance
      head :ok
    end

    def index
      self.instances = with_scope do
        options = returning(:order => order) { |o| o[:conditions] = ["#{belongs_to_id} = ?", params[belongs_to_id]] if belongs_to? }
        model.find :all, options
      end
      render_formats instances, true
    end

    def show
      self.instance = with_scope { model.find params[:id] }
      render_formats instance
    end

    def update
      self.instance = with_scope { model.find params[:id] }
      instance.update_attributes!(params[model_name])
      render_formats instance
    end

    def destroy
      model.destroy with_scope { model.find params[:id] }
      head :ok
    end

  private
  
    def with_scope
      model.send(:with_scope, :find => { :conditions => conditions }) { yield }
    end

    def belongs_to?
      !belongs_to.nil? && !params[belongs_to_id].nil?
    end

    def belongs_to_id
      "#{belongs_to}_id"
    end

    def model_name
      @model_name ||= controller_name.singularize
    end

    def model
      @model ||= model_name.camelize.constantize
    end
    
    def instance=(value)
      instance_variable_set "@#{model_name}", value
    end
    
    def instance
      instance_variable_get "@#{model_name}"
    end
    
    def instances=(value)
      instance_variable_set "@#{model_name.pluralize}", value
    end
    
    def instances
      instance_variable_get "@#{model_name.pluralize}"
    end
    
    def render_formats data, list = false
      respond_to do |format|
        format.html
        format.json { render :json => data }
        format.js { render :json => data, :content_type => 'application/json' }
        format.xml  { render :xml  => data }
        format.ext do
          render :json => list ? { :results => data.size, model_name.pluralize.to_sym => data } : { :success => true, :data => [data] }
        end if defined? Mime::EXT
      end
    end
  
  end# ResourceMethods

end# ActsAsResourceController
