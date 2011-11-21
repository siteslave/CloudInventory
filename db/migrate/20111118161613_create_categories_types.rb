class CreateCategoriesTypes < ActiveRecord::Migration
  def change
    create_table :categories_types do |t|

      t.timestamps
    end
  end
end
