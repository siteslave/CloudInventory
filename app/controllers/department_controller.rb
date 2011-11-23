class DepartmentController < ApplicationController
  # Get department list
  # GET /department
  # GET /department.json
  def index
    @departments = Departments.order('name DESC').all

    render :json => { :success => true, :rows => @departments }
  end

  def update
    @department = Departments.find(params[:id])
    @department.name = params[:name];
    
    if @department.save
      render :json => { :success => true }
    else
      render :json => { :success => false }
    end
  end
  # DELETE  /department/:id
  def destroy

    begin
      @department = Departments.find(params[:id])
      @department.destroy
      render :text => 'ok'
    rescue Exception => e
      render :text => e
    end
  end

  def show
  end
  # POST  /department
  def create
    @department = Departments.new
    @department.name = params[:name]

    if @department.save
      render :json => { :success => true }
    else
      render :json => { :success => false }
    end
  end

  def new

  end

end
