require "rails_helper"

RSpec.describe "User Management", type: :request do
  let(:user) { FactoryGirl.create(:user) }

  context "when user successfully updates password" do
    let(:new_password) { "new_password" }
    
    before do
      @old_password = user.encrypted_password
      post "/users/sign_in", params: {user: {email: user.email, password: user.password}}
    end

    it "should update the users password appropriately" do
      result = put "/users/#{user.id}", params: {user: {email: user.email, password: new_password}}
      expect(result).to eq(200) 
      expect(user.reload.encrypted_password).to_not eq(@old_password)
    end
  end

  context "when bad params come in" do
   it "shouldn't allow you to update" do
     @encrypted_password = user.encrypted_password
     result = put "/users/#{user.id}", params: {user: {bad: "params"}}
     expect(result).to eq(302)
     expect(user.reload.encrypted_password).to eq(@encrypted_password)
   end
  end
end
