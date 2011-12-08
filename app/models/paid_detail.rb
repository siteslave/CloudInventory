class PaidDetail < ActiveRecord::Base
  
  belongs_to :paid
  has_many :product
  
end
