class Receive < ActiveRecord::Base
  belongs_to :company
  has_many :receive_details
end
