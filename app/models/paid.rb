class Paid < ActiveRecord::Base
  belongs_to :department
  has_many :stock_card
  has_many :paid_detail
end
