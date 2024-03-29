class Product < ActiveRecord::Base
  validates_presence_of :name, :code, :price, :category_id, :unit_count_id

  belongs_to :unit_count
  belongs_to :category
  belongs_to :receive_detail
  has_many :stock_card
  has_many :temp_product
end
