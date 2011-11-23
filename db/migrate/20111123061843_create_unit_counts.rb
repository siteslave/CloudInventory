class CreateUnitCounts < ActiveRecord::Migration
  def change
    create_table :unit_counts do |t|

      t.timestamps
    end
  end
end
