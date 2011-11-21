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
    if @department.update_attributes(params[:departments])
      render :json => { :success => true }
    else
      render :json => { :success => false }
    end
  end

  def destroy
  end

  def show
  end

  def create
  end

  def new

  end

end
