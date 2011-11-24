class UnitCountController < ApplicationController

  def index
    @unitcount = UnitCount.all
    render :json => { :success => true, :rows => @unitcount }
  end

  # POST  /unit_count
  def create
    c = UnitCount.find_by_name(params[:name])

    if c.nil?
      # create new unit count
      @unitcount = UnitCount.new

      @unitcount.name = params[:name]

      if @unitcount.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @unitcount.errors }
      end

    else
      # duplicate
      render :json => { :success => false, :msg => 'Name duplicate' }
    end
  end

  # PUT /unit_count
  def update
    begin
      @unitcount = UnitCount.find(params[:id])
      @unitcount.name = params[:name]

      if @unitcount.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @unitcount.errors }
      end
    rescue Exception => e
      render :json => { :success => false, :msg => e }
    end

  end

  # DELETE  /unit_count/:id
  def destroy
    begin
      @unitcount = UnitCount.find(params[:id])
      if @unitcount.destroy
        render :text => 'ok'
      else
        render :text => @unitcount.errors
      end
    rescue ActiveRecord::RecordNotFound
      render :text => 'Record not found.'
    end
  end
end