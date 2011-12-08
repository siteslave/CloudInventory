class PaidsController < ApplicationController
  # GET /paids/tmpproducts/:sess
  def tmpproducts
    
    @products =  TempProduct.where(:sess => params[:sess]).all
    
    @rows = @products.collect { |r| {
        :id         => r.id,
        :product_id => r.product_id,
        :name       => r.product.name,
        :code       => r.product.code,
        :qty        => r.qty,
        :price      => r.price,
        :total      => r.price.to_f * r.qty.to_i
    }}

    render :json => { :success => true, :rows => @rows }
    
  end
  
  # POST /paids/saveproducts
  def saveproducts
    # check if product exist
    if chkproduct(params[:product_id], params[:sess])
      begin
        @product  = TempProduct.where(:product_id => params[:product_id]).where(:sess => params[:sess]).first
        #@product.price = params[:price]
        newqty    = @product.qty + params[:qty].to_i
        
        @product.qty = newqty
        # update product
        if @product.save
          render :json => { :success => true }
        else # has error(s)
          render :json => { :success => false, :msg => 'update do not success' }
        end
      # rescue if ActiveRecord error
      rescue
        render :json => { :success => false, :msg => 'Active record error, please see log.' }
      end #begin
    else #product don't exist
      # create new product
      @products             = TempProduct.new
      # product definition
      @products.sess        = params[:sess]
      @products.product_id  = params[:product_id]
      @products.qty         = params[:qty]
      @products.price       = params[:price]
      # save product to temp
      if @products.save
        render :json => { :success => true }
      else # has error(s)
        render :json => { :success => false, :msg => @Products.errors.to_json }
      end
    end #end if
  end
  
  # update product in temp_product
  # PUT /paids/update/:id
  def update
    @product      = TempProduct.find(params[:id])
    @product.qty  = params[:qty]
    # save product
    if @product.save
      # success
      render :json => { :success => true }
    else
      # failed
      render :json => { :success => false }
    end
  end
  # destroy product
  # DELETE
  def destroy
    begin
      @product = TempProduct.find(params[:id])
      if @product.destroy
        render :text => 'ok'
      else
        render :text => @product.errors.to_json
      end
    rescue
      render :text => 'Product not found.'
    end
  end
  
  # Clear product in current session
  def cleartemp
    if TempProduct.delete_all(:sess => params[:sess])
      # delete success
      render :text => 'ok'
    else
      # delete failed
      render :text => 'Can not clear product in session: ' + @product.errors.to_json
    end
  end
  
  # Save session 
  # POST /paids/save
  def save
    
    # save paids summary
    @paids = Paid.new
    @paids.paid_date = Time.now
    @paids.department_id = params[:department_id]
    # save paid
    if @paids.save
    
      # save paid detail
      @temp = TempProduct.where(:sess => params[:sess])
      @temp.each do |r|
        # create paid detail
        @paid_detail = PaidDetail.new
        
        @paid_detail.product_id = r.product_id
        @paid_detail.qty = r.qty
        @paid_detail.price = r.price
        @paid_detail.paid_id = @paids.id
        
        @paid_detail.save
        
        #update product detail
        @product = Product.find(r.product_id)
        #update product
        newQty = @product.qty - r.qty.to_i
        @product.qty = newQty
        @product.price = r.price
        @product.save
   
        # update stock cards.
        @sc = StockCard.new
        @sc.product_id = r.product_id
        @sc.qty = r.qty
        @sc.department_id = params[:department_id]
        @sc.date_update = params[:paid_date]
        @sc.paid_id = @paids.id
        #
        @sc.save

      end # end do loop
           
       render :text => 'ok'
       
    else
      render :text => 'Can not save data.'  
    end
    
  end
  
  # declare private function
  private
  # check product ready exist in table
  def chkproduct( product_id, sess)
    @product = TempProduct.where(:product_id => product_id).
                 where(:sess => sess)
    if @product.count > 0
      true # return true if exist
    else
      false # return false if don't exist
    end
  end
  
  # remove products in temp_product
  def deletetemp(sess)
    begin
      if TempProduct.delete_all(:sess => sess)
        true  # return true if success
      else
        false # return false if failed
      end
    rescue
      false
    end
  end 
  
end
