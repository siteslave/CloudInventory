class CategorytypeController < ApplicationController
  # GET /categorytype
  # GET /categorytype.json
  # GET /categorytype.xml
  def index
    @CategoriesTypes = CategoriesType.all

    respond_to do |format|
      format.html  { render :json => { :success => true, :rows => @CategoriesTypes } }
      format.json  { render :json => { :success => true, :rows => @CategoriesTypes } }
      format.xml  { render :xml => @CategoriesTypes }
    end
    #render :json => { :success => true, :rows => @CategoriesTypes }
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

  # POST  /categorytype/doregister
  # @name string
  # @type int
  def doregister
    render :json => { :success => true }
  end
end
