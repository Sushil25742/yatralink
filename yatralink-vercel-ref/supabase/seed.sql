-- Demo accounts (passwords documented in README). Password hashes are scrypt with per-user salts.
insert into public.users_custom(email,name,role,password_hash,password_salt) values
('hary123@gmail.com','Hary','traveler','4a5d93efedb55455cc47009222ad22b060c39cf4a87181d6efdbba5d887a8994','4d1e13c375e03ff0a32490cf38720386'),
('pratima@gmail.com','Pratima','traveler','8fef5b17793e653c0149ff786bc6b54209d9c320f2316b43559d440a02a274ab','857ec115578391a20f6395ea50f8f4ae'),
('asim@operator.com','Asim','operator','4bbb5bd6b405b19a062d1e9bd3039fc13312c881aec7f5ad80509c07ee2b75bb','0bab90056026a245aeb2b65890d520fe'),
('sushil@admin.com','Sushil','superadmin','4d21075ca9c63dde282f86f42a0e279b337626761e8bb824ffca7cab8fe000a6','ce2d7756ca24ee90c7d041a7afc59228'),
('hemanta@engineer.com','Hemanta','engineer','96c94783005d2512b2176836a35402907efb22e7a84db42522b9c20a6e1e7b6e','62e8707dac0f70b5fb5266671f1ece6d')
on conflict(email) do update set name=excluded.name,role=excluded.role,password_hash=excluded.password_hash,password_salt=excluded.password_salt;

insert into public.user_settings(email,name) select email,name from public.users_custom
on conflict(email) do nothing;

insert into public.operators(id,name,business,email,status,experiences,rating,revenue) values
('op-1','Asim','Patan Woodcraft Collective','asim@operator.com','Verified',1,4.8,48200),
('op-2','Maya Maharjan','Newari Kitchen Patan','maya@example.com','Verified',1,4.9,52600),
('op-3','Niraj Shakya','Patan Heritage Walks','niraj@example.com','Verified',1,4.7,21400),
('op-4','Sanjay Chitrakar','Paubha Studio','sanjay@example.com','Verified',1,4.9,31800)
on conflict(id) do update set name=excluded.name,business=excluded.business,email=excluded.email,status=excluded.status,experiences=excluded.experiences,rating=excluded.rating,revenue=excluded.revenue;

insert into public.places(id,name,category,zone,status,crowd,capacity,visits,lat,lng) values
('place-patan','Patan Durbar Square','Heritage','Patan Core','Active','High',1800,1840,27.673,85.325),
('place-golden','Golden Temple','Spiritual','Kwa Bahal','Active','Moderate',500,620,27.6746,85.3245),
('place-mangal','Mangal Bazaar','Market','Patan Core','Active','Low',1000,410,27.6727,85.3256),
('place-craft','Woodcarving Quarter','Craft','Patan North','Active','Low',300,188,27.6752,85.3228),
('place-kumbheshwar','Kumbheshwar Temple Area','Spiritual','Patan North','Active','Low',450,210,27.6785,85.3229),
('place-mahaboudha','Mahaboudha Temple Area','Spiritual','Patan South','Active','Low',350,165,27.6697,85.326)
on conflict(id) do update set name=excluded.name,category=excluded.category,zone=excluded.zone,status=excluded.status,crowd=excluded.crowd,capacity=excluded.capacity,visits=excluded.visits,lat=excluded.lat,lng=excluded.lng;

insert into public.crowd_sites(id,name,level,score,wait,lat,lng,source) values
('place-patan','Patan Durbar Square','High',78,'40–50 min',27.673,85.325,'Destination manager demo signal'),
('place-golden','Golden Temple','Moderate',52,'15–25 min',27.6746,85.3245,'Demo estimate'),
('place-mangal','Mangal Bazaar','Low',28,'Comfortable now',27.6727,85.3256,'Demo estimate'),
('place-craft','Woodcarving Quarter','Low',19,'Comfortable now',27.6752,85.3228,'Demo estimate'),
('place-kumbheshwar','Kumbheshwar Temple Area','Low',24,'Comfortable now',27.6785,85.3229,'Demo estimate'),
('place-mahaboudha','Mahaboudha Temple Area','Low',22,'Comfortable now',27.6697,85.326,'Demo estimate')
on conflict(id) do update set name=excluded.name,level=excluded.level,score=excluded.score,wait=excluded.wait,lat=excluded.lat,lng=excluded.lng,source=excluded.source,updated_at=now();

insert into public.experiences(id,title,operator_id,category,price,capacity,status,bookings,rating) values
('exp-wood','Traditional Woodcarving Workshop','op-1','Craft',800,8,'Published',46,4.8),
('exp-food','Newari Lunch Experience','op-2','Food',1200,12,'Published',39,4.9),
('exp-walk','Living Heritage Walk','op-3','Culture',600,10,'Published',28,4.7),
('exp-paubha','Paubha Painting Introduction','op-4','Art',1500,6,'Published',17,4.9)
on conflict(id) do update set title=excluded.title,operator_id=excluded.operator_id,category=excluded.category,price=excluded.price,capacity=excluded.capacity,status=excluded.status,bookings=excluded.bookings,rating=excluded.rating;

insert into public.slots(id,experience_id,operator_id,day,time,available,capacity,booked) values
('wood-10','exp-wood','op-1','Today','10:00 AM',true,8,4),
('wood-1130','exp-wood','op-1','Today','11:30 AM',false,8,8),
('wood-14','exp-wood','op-1','Today','2:00 PM',true,8,2),
('wood-16','exp-wood','op-1','Today','4:00 PM',true,8,1),
('food-1215','exp-food','op-2','Today','12:15 PM',true,12,3),
('food-14','exp-food','op-2','Today','2:00 PM',true,12,2),
('walk-10','exp-walk','op-3','Today','10:00 AM',true,10,1),
('walk-1530','exp-walk','op-3','Today','3:30 PM',true,10,2),
('paubha-11','exp-paubha','op-4','Today','11:00 AM',true,6,1),
('paubha-15','exp-paubha','op-4','Today','3:00 PM',true,6,0)
on conflict(id) do update set experience_id=excluded.experience_id,operator_id=excluded.operator_id,day=excluded.day,time=excluded.time,available=excluded.available,capacity=excluded.capacity,booked=excluded.booked;

insert into public.reviews(id,experience_id,operator_id,guest,rating,text,reply) values
('rev-1','exp-wood','op-1','Emma Johnson',5,'Wonderful hands-on session and a very patient artisan.',''),
('rev-2','exp-wood','op-1','Aarav Sharma',5,'The workshop was the highlight of Patan for us.','Thank you for visiting our workshop!'),
('rev-3','exp-wood','op-1','David Wilson',4,'Authentic and informative. Would recommend.','')
on conflict(id) do update set experience_id=excluded.experience_id,operator_id=excluded.operator_id,guest=excluded.guest,rating=excluded.rating,text=excluded.text,reply=excluded.reply;
