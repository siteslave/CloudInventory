class Category < ActiveRecord::Base
  has_many :products
  belongs_to :categories_type
end
