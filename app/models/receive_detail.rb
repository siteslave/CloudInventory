class ReceiveDetail < ActiveRecord::Base
  validates_presence_of :receive_id, :product_id, :price, :qty

  belongs_to :receive
  has_many :product
end
