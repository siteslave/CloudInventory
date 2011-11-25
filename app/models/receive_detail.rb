class ReceiveDetail < ActiveRecord::Base
  belongs_to :receive
  has_many :product
end
