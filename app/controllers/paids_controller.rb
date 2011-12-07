class PaidsController < ApplicationController
  # GET /paids/tmpproducts/:sess
  def tmpproducts
    
    @products =  TempProduct.where(:sess => params[:sess]).all
    
    @rows = @products.collect { |r| {
        :id     => r.id,
        :name   => r.product.name,
        :code   => r.product.code,
        :qty    => r.qty,
        :price  => r.price,
        :total  => r.price.to_f * r.qty.to_i
    }}

    render :json => { :success => true, :rows => @rows }
    
  end
  
  # POST /paids/saveproducts
  def saveproducts
    @products       = TempProduct.new
    
    @products.sess  = params[:sess]
    @products.product_id    = params[:product_id]
    @products.qty   = params[:qty]
    @products.price = params[:price]
    
    begin
      if @products.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @products.errors.to_json }
      end
    rescue
      render :json => { :success => false, :msg => 'Active record error, please see log.' }
    end
  end
  
end
