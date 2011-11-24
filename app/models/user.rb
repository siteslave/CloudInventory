class User < ActiveRecord::Base
  validates :user_name, :presence => true
  validates :user_pass, :presence => true
  validates :fullname, :presence => true
  validates :department_id, :presence => true

  belongs_to :department

end
