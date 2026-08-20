export const seedData = {
  places: [
    { id: 'place-patan', name: 'Patan Durbar Square', category: 'Heritage', zone: 'Patan Core', status: 'Active', crowd: 'Moderate', capacity: 1500, visits: 3420, lat: 27.6737, lng: 85.3245 },
    { id: 'place-swoyambhu', name: 'Swoyambhunath Stupa', category: 'Spiritual', zone: 'West Kathmandu', status: 'Active', crowd: 'High', capacity: 2000, visits: 1200, lat: 27.7149, lng: 85.2903 },
    { id: 'place-bhaktapur', name: 'Bhaktapur Durbar Square', category: 'Heritage', zone: 'Bhaktapur', status: 'Active', crowd: 'Low', capacity: 3000, visits: 2100, lat: 27.6722, lng: 85.4278 }
  ],
  experiences: [
    { id: 'exp-1', title: 'Traditional Wood Carving Workshop', operatorId: 'op-1', category: 'Craft', price: 1500, capacity: 10, status: 'Published', bookings: 12, rating: 4.8 },
    { id: 'exp-2', title: 'Newari Food Tour', operatorId: 'op-1', category: 'Food', price: 2000, capacity: 15, status: 'Published', bookings: 25, rating: 4.9 },
    { id: 'exp-3', title: 'Sunrise Meditation at Stupa', operatorId: 'op-2', category: 'Spiritual', price: 800, capacity: 20, status: 'Published', bookings: 50, rating: 4.7 }
  ],
  bookings: [
    { id: 'bk-1', guest: 'Pratima Tamang', userEmail: 'pratima@gmail.com', experienceId: 'exp-1', experienceTitle: 'Traditional Wood Carving Workshop', operatorId: 'op-1', date: '2026-08-21', time: '10:00 AM', guests: 2, amount: 3000, status: 'Confirmed', createdAt: Date.now() - 86400000 },
    { id: 'bk-2', guest: 'Hary Thapa', userEmail: 'hary123@gmail.com', experienceId: 'exp-2', experienceTitle: 'Newari Food Tour', operatorId: 'op-1', date: '2026-08-22', time: '2:00 PM', guests: 1, amount: 2000, status: 'Confirmed', createdAt: Date.now() - 172800000 }
  ],
  operators: [
    { id: 'op-1', name: 'Asim Shrestha', business: 'Asim Heritage Tours', email: 'asim@operator.com', status: 'Verified', experiences: 2, rating: 4.8, revenue: 55000 },
    { id: 'op-2', name: 'Nabin Lama', business: 'Himalayan Spiritual Guides', email: 'nabin@operator.com', status: 'Verified', experiences: 1, rating: 4.7, revenue: 32000 }
  ],
  crowdSites: [
    { id: 'place-patan', name: 'Patan Durbar Square', level: 'Moderate', score: 55, wait: '15-25 min', lat: 27.6737, lng: 85.3245, source: 'Destination manager demo signal' },
    { id: 'place-swoyambhu', name: 'Swoyambhunath Stupa', level: 'High', score: 85, wait: '40-50 min', lat: 27.7149, lng: 85.2903, source: 'Demo estimate' }
  ],
  slots: [
    { id: 'slot-1', experienceId: 'exp-1', operatorId: 'op-1', day: 'Today', time: '10:00 AM', available: true, capacity: 10, booked: 2 },
    { id: 'slot-2', experienceId: 'exp-1', operatorId: 'op-1', day: 'Today', time: '2:00 PM', available: true, capacity: 10, booked: 0 }
  ],
  reviews: [
    { id: 'rev-1', experienceId: 'exp-1', operatorId: 'op-1', guest: 'Pratima Tamang', rating: 5, text: 'Amazing experience!', reply: 'Thank you!' }
  ],
  users: [
    { email: 'hary123@gmail.com', name: 'Hary Thapa', role: 'traveler', password: '123456' },
    { email: 'pratima@gmail.com', name: 'Pratima Tamang', role: 'traveler', password: '123456' },
    { email: 'asim@operator.com', name: 'Asim Shrestha', role: 'operator', password: '123456' },
    { email: 'sushil@admin.com', name: 'Sushil Admin', role: 'superadmin', password: 'sushil@123456' },
    { email: 'hemanta@engineer.com', name: 'Hemanta Engineer', role: 'engineer', password: '1234567' }
  ]
};
