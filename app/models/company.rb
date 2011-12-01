class Company < ActiveRecord::Base
  validates_presence_of :name, :address

  has_many :receive
  has_many :stock_card
end
