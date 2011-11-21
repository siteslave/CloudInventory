class CategoryController < ApplicationController
  # POST  /category/doregister
  # @name string
  # @type int
  def doregister

    c = Category.find_by_name( params[:name] )

    @success = nil
    @msg = nil

    if c.nil?
      # Create new category.
      @category = Category.new
      # name
      @category.name = params[:name]
      # categories_types
      @category.categories_type_id = params[:type]

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
    @category = Category.all
    #
    #@rows = @category.collect { |r| {
    #    :id => r.id,
    #    :name => r.name,
    #    :type => r.categories_type
    #
    #}}
    respond_to do |format|
      format.html { render :json => { :success => true, :rows => @category } }
      format.xml  { render :xml => @category }
      format.json { render :json => { :success => true, :rows => @category } }
    end

  end


  # PUT /category/:id
  def update
    @category = Category.find(params[:id])

    if @category.update_attributes(params[:categories])
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
end
