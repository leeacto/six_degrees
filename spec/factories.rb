FactoryGirl.define do
  factory :game do
    actor_start_id "162655641"
    actor_end_id "162655909"
  end

  factory :guess do
    association :game
    film_id "770672122"
    from_actor_id "162655020"
    to_actor_id "341817905"
  end
end
