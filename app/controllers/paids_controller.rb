class PaidsController < ApplicationController
  # GET /paids/list/:sess
  def list
    
    @Products =  TempProduct.where(:sess => params[:sess]).all
    
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
  
  def create
    
  end
end
