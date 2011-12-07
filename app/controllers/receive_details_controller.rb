class ReceiveDetailsController < ApplicationController
  # GET     /receive_details
  def index
    @Products =  TempProduct.where(:sess => params[:sess]).all

    @rows = @Products.collect { |r| {
        :id => r.id,
        :product_id => r.product_id,
        :name => r.product.name,
        :code => r.product.code,
        :price  => r.price,
        :qty => r.qty,
        :total => r.qty * r.price
    } }

    render :json => { :success => true, :rows => @rows }

  end
  # POST    /receive_details
  def create
	if chkproduct(params[:product_id], params[:sess])
		#render :json => { :success => false, :msg => 'Duplicate product_id'}
		begin
			@product = TempProduct.where(:product_id => params[:product_id]).where(:sess => params[:sess]).first
			#@product.price = params[:price]
			newqty = @product.qty + params[:qty].to_i
			
			@product.qty = newqty
			
			if @product.save
				render :json => { :success => true }
			else
				render :json => { :success => false, :msg => 'update do not success' }
			end
		rescue ActiveRecord::RecordNotFound
			render :json => { :success => false, :msg => 'Record not found for update' }
		end
	else
		@Products = TempProduct.new

		@Products.product_id = params[:product_id]
		@Products.price = params[:price]
		@Products.qty = params[:qty]
		@Products.sess = params[:sess]

		if @Products.save
		  render :json => { :success => true }
		else 
		  render :json => { :success => false, :msg => @Products.errors.to_json, :sess => session[:recvId] }
		end

	end
  end

  # DELETE    /receive_details/:id
  def destroy
    begin
      @product = TempProduct.find(params[:id])
      if @product.destroy
        render :text => 'ok'
      else
        render :text => @product.errors.to_json
      end
    rescue
      render :text => 'Record not found.'
    end
  end
  
  # PUT		/receive_details/:id
	def update
		begin
			@product = TempProduct.find(params[:id])
			
			@product.product_id = params[:product_id]
			@product.price = params[:price]
			@product.qty = params[:qty]
			
			if @product.save
				render :json => { :success => true }
			else
				render :json => { :success => false, :msg => @product.errors.to_json }
			end
		rescue ActiveRecord::RecordNotFound
			render :json => { :success => false, :msg => 'Record not found.' }
		end
	end
	
	# POST	/receive_details/cleartemp
	def cleartemp
		begin
			
			if TempProduct.delete_all(:sess => params[:sess])
				render :text => 'ok'	
			else
				render :text => 'Delete failed.'
			end
		rescue
			render :text => 'Active record error.'
		end
	end
	# POST		/receive_detail/save
	def save
			# Create new receive 
			@receives = Receive.new
			@receives.receive_date 	= params[:receive_date]
			@receives.company_id 	= params[:company_id]
			@receives.receive_code 	= params[:receive_code]
		
			if @receives.save
				@temp = TempProduct.where(:sess => params[:sess])
				# Insert batch from temp product.
				@temp.each do |r|
					#new receive detail
					@rcv = ReceiveDetail.new
					#update product detail
					@product = Product.find(r.product_id)
					#update product
					newQty = @product.qty + r.qty.to_i
					@product.qty = newQty
					@product.price = r.price
					@product.save
					#create new receive
					@rcv.product_id = r.product_id
					@rcv.qty 		= r.qty
					@rcv.price 		= r.price
					@rcv.receive_id = @receives.id
					@rcv.save
					
					# update stock cards.
					@sc = StockCard.new
					@sc.product_id = r.product_id
					@sc.qty = r.qty
					@sc.company_id = params[:company_id]
					@sc.date_update = params[:receive_date]
					@sc.receive_id = @receives.id
					#
					@sc.save
					
				end
				# Clear temp product
				deletetemp(params[:sess])
				render :text => 'ok'
			else
				render :text => @receives.errors.to_json
			end
	end	
	
  private
	# @private 
	# check product ready exist in table
	def chkproduct( product_id, sess)
		@product = TempProduct.where(:product_id => product_id).
							   where(:sess => sess)
		if @product.count > 0
			true
		else
			false
		end
	end
	
	private
	# @private
	# delete product in temp_product
	def deletetemp(sess)
		begin
			if TempProduct.delete_all(:sess => sess)
				true	
			else
				false
			end
		rescue
			false
		end
	end	
end
