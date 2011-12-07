class TempProduct < ActiveRecord::Base
  validates_presence_of :product_id, :qty, :sess

  belongs_to :product

end
