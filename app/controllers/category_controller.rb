class CategoryController < ApplicationController
  # POST  /category
  def create

    c = Category.find_by_name(params[:name])

    @success = nil
    @msg = nil

    if c.nil?
      # Create new category.
      @category = Category.new
      # name
      @category.name = params[:name]
      # categories_types
      @category.categories_type_id = params[:categories_type_id]

      if @category.save
        @success = true
        @msg = @category.errors.messages
      else
        @success = false
        @msg = 'Save success'
      end

    else
      @success = false
      @msg = 'Name duplicate.'
    end

    render :json => { :success => @success, :msg => @msg }

  end

  # GET /category
  # GET /category.json
  # GET /category.xml
  def index
    @category = Category.order('id DESC').all
    #
    @rows = @category.collect { |r| {
        :id => r.id,
        :name => r.name,
        :categories_type_id => r.categories_type_id,
        :categories_type_name => r.categories_type.name
    }}
    respond_to do |format|
      format.html { render :json => { :success => true, :categories => @rows } }
      format.xml  { render :xml => @category }
      format.json { render :json => { :success => true, :categories => @rows } }
    end

  end


  # PUT /category/:id
  def update
    @category = Category.find(params[:id])

		@category.name = params[:name]
		@category.categories_type_id = params[:categories_type_id]
		
    if @category.save
      render :json => { :success => true }
    else
      render :json => { :success => false }
    end
  end

  # GET /category/detail
  # @id int
  def detail
    @rows = nil
    begin
      @category = Category.find( params[:id] )
      @rows = @category.collect{ |r| {
          :id => r.id,
          :name => r.name,
          :type =>r.categories_type_id
      }}
    rescue ActiveRecord::RecordNotFound
      # Record not found.
    end

    render :json => {:success => true, :rows => @category}

  end

  def destroy
    begin
      @category = Category.find(params[:id])
      @category.destroy
      render :text => 'ok'
    rescue Exception => e
      render :text => e
    end
  end
end
