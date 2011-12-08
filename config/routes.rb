CloudInventory::Application.routes.draw do

 root :to => 'site#index'

  resources :categories
  resources :categorytype
  resources :departments
  resources :unit_count
  resources :users
  resources :companies
  resources :paids do
  	collection do
  		get 'list'
  		delete 'cleartemp'
  		post 'saveproducts'
  		get 'tmpproducts'
  		post 'save'
  	end
  end
  
  resources :receive_details do
    collection do
      post 'list'
      post 'cleartemp'
      post 'save'
    end
  end

  resources :receives do
    collection do
      get :sess
    end
  end

  # RESTFul for products
  resources :products
  #match 'products/:name' => 'products#search', :via => :get
end
