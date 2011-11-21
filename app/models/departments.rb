class Departments < ActiveRecord::Base
  #attr_accessible :name

  #accepts_nested_attributes_for :departments
  #attr_accessible :name, :departments
  has_many :users
end
