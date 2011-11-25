class ReceivesController < ApplicationController
  # GET     /receives
  def index
    @Receives = Receive.order('receive_date').all

    @rows = @Receives.collect { |r| {
        :id => r.id,
        :receive_date => r.receive_date,
        :receive_detail_id => r.receive_detail_id,
        :company_id => r.company_id,
        :company_name => r.company.name,
        :total_price => r.receive_details.sum('price*qty'),
        :total_qty => r.receive_details.sum('qty')
    } }

    render :json => { :success => true, :rows => @rows }

  end
end
