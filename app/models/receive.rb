class Receive < ActiveRecord::Base
	validates_presence_of :company_id, :receive_date
	
  	belongs_to :company
  	has_many :receive_details
end
