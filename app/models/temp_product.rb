class TempProduct < ActiveRecord::Base
  validates_presence_of :product_id, :price, :qty, :sess

  belongs_to :product

end
