class UnitCountController < ApplicationController
  def index
    @unitcunt = UnitCount.all
    render :json => { :success => true, :rows => @unitcunt }
  end
end
