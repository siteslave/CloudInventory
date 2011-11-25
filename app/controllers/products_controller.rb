class ProductsController < ApplicationController
  # GET     /products
  def index
    @products = Product.all

    @rows = @products.collect { |r| {
        :id => r.id,
        :name => r.name,
        :code => r.code,
        :qty => r.qty,
        :price => r.price,
        :category_id => r.category_id,
        :category_name => r.category.name,
        :unit_count_id => r.unit_count_id,
        :unit_count_name => r.unit_count.name
    }}

    render :json => { :success => true, :rows => @rows }

  end

  # POST    /products
  def create
    @product = Product.new

    @product.name = params[:name]
    @product.price = params[:price]
    @product.code = params[:code]
    @product.category_id = params[:category_id]
    @product.unit_count_id = params[:unit_count_id]

    if @product.valid?
      if @product.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @product.errors.to_json }
      end
    else
      render :json => { :success => false, :msg => @product.errors.to_json }
    end

  end
  # PUT     /products/:id
  def update
    begin
      @product = Product.find_by_id(params[:id])

      @product.name = params[:name]
      @product.price = params[:price]
      @product.unit_count_id = params[:unit_count_id]
      @product.category_id = params[:category_id]

      if @product.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @product.errors.to_json }
      end
    rescue ActiveRecord::RecordNotFound
      render :json => { :success => false, :msg => 'Record not found' }
    end
  end
  # DELETE  /products/:id
  def destroy
  end

  def show
  end

  def search
  end

end
