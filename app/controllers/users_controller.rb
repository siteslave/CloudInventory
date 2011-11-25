class UsersController < ApplicationController

  # GET   /users
  def index

    @Users = User.all

    @rows = @Users.collect { |r| {
        :id => r.id,
        :fullname => r.fullname,
        :user_name => r.user_name,
        :active => r.active,
        :department_id => r.department_id,
        :department_name => r.department.name,
        :last_login => r.last_login
    }}

    render :json => { :success => true, :rows => @rows }

  end
  # POST    /users
  def create

    c = User.find_by_user_name(params[:user_name])

    if c.nil?
      @User = User.new

      @User.fullname = params[:fullname]
      @User.user_name = params[:user_name]
      @User.user_pass = params[:user_pass]
      #@User.active = params[:active]
      @User.department_id = params[:department_id]

      if @User.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @User.errors.to_json }
      end
    else
       render :json => { :success => false, :msg => '[Username duplicate please use another.]' }
    end

  end
  # PUT     /users/:id
  def update
    begin
      @User = User.find(params[:id])

      @User.fullname = params[:fullname]
      @User.user_name = params[:user_name]
      #@User.user_pass = params[:user_pass]
      #@User.active = params[:active]
      @User.department_id = params[:department_id]

      if @User.save
        render :json => { :success => true }
      else
        render :json => { :success => false, :msg => @User.errors.to_json }
      end
    rescue ActiveRecord::RecordNotFound
      render :json => { :success => true, :msg => 'Record not found' }
    end

  end
  # DELETE  /users/:id
  def destroy
  end

end
