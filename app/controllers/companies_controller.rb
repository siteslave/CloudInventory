class CompaniesController < ApplicationController
  # GET     /companies
  def index
    @Company = Company.all

    render :json => { :success => true, :rows => @Company }
  end
  # POST    /companies
  def create
    @Company = Company.new

    @Company.name = params[:name]
    @Company.address = params[:address]
    @Company.contact_name = params[:contact_name]
    @Company.telephone = params[:telephone]
    @Company.fax = params[:fax]

    if @Company.valid?
      if @Company.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @Company.errors.to_json }
      end
    else
      render :json => { :success => false, :msg => @Company.errors.to_json }
    end
  end

  # PUT   /companies/:id
  def update
    begin
      @Company = Company.find(params[:id])

      @Company.name = params[:name]
      @Company.address = params[:address]
      @Company.contact_name = params[:contact_name]
      @Company.telephone = params[:telephone]
      @Company.fax = params[:fax]

      if @Company.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @Company.errors.to_json }
      end
    rescue ActiveRecord::RecordNotFound
      render :json => { :success => false, :msg => 'Record not found' }
    end
  end

  # DELETE  /companies/:id
  def destroy
    begin
      @Company = Company.find(params[:id])

      if @Company.destroy
        render :text => 'ok'
      else
        render :text => @Company.errors.to_json
      end
    rescue ActiveRecord::RecordNotFound
      render :text => 'Record not found'
    end
  end
end
