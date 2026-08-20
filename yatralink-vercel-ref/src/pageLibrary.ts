export type ProductRole='Traveler'|'Destination Admin'|'Local Operator'|'Partner';
export type ProductPage={id:string;role:ProductRole;module:string;title:string;route:string;description:string};
const raw:Record<string,Record<string,string>>={
traveler:{
'Getting Started':'Splash|Welcome|Why YatraLink|Choose Language|Location Permission|Privacy Consent|Notification Permission|Travel Interests|Travel Style|Budget Preference|Accessibility Needs|Create Account|Sign In|Guest Mode|Forgot Password',
'Explore':'Home|Explore Overview|Search|Search Results|Recent Searches|Suggested Searches|Categories|Heritage Category|Food Category|Craft Category|Spiritual Category|Hidden Gems|Nearby Places|Trending Places|Saved Places|Recently Viewed|Place Collections|Festival Discovery',
'Crowd Intelligence':'Crowd Overview|Live Crowd Map|Map Place Selected|Crowd Alert|Nearby Alternatives|Visit Later|Best Time to Visit|Crowd Forecast|Queue Estimate|Crowd Confidence|Crowd Data Explanation|Crowd Preferences|Crowd History|Alternative Route|Crowd Notification Settings',
'Journey':'AI Trip Planner|Multi-Day Planner|Destination Builder|Complete Timeline|Planner Preferences|Regenerate Plan|Saved AI Plans|Daily Route Summary|Plan Journey|Journey Preferences|Select Duration|Set Budget|Choose Interests|Walking Preference|Crowd Preference|Accessibility Preference|Generated Itinerary|Itinerary Map|Itinerary Timeline|Edit Itinerary|Reorder Stops|Replace Stop|Add Stop|Remove Stop|Save Journey|Share Journey|Start Journey|Active Journey|Next Stop|Journey Completed',
'Experiences':'Experience Home|Experience Search|Experience Filters|Experience Listing|Experience Details|Host Profile|Availability|Choose Time|Guests|What Is Included|Reviews|Experience Location|Related Experiences|Experience Wishlist|Experience Share',
'Booking':'Booking Review|Booking Details|Price Breakdown|Payment Method|Payment Placeholder|Booking Processing|Booking Confirmed|Booking QR|Upcoming Bookings|Booking Details Upcoming|Completed Bookings|Booking History|Cancel Booking|Cancellation Reason|Refund Status|Rate Experience|Write Review|Contact Host',
'Rewards & Impact':'Heritage Points|Points History|Earn Points|Rewards Catalog|Reward Details|Redeem Reward|Redemption Confirmed|My Impact|Impact History|Local Spend|Businesses Supported|Crowded Places Avoided|Cultural Experiences|Contribution Transparency',
'Account & Support':'Profile|Edit Profile|Account Settings|Language Settings|Currency Settings|Units Settings|Privacy Settings|Location Sharing|Notification Settings|Saved Places Account|Saved Experiences|Travel Preferences|Emergency Info|Help Center|FAQ|Contact Support|Report Issue|Feedback|Terms|Privacy Policy|About YatraLink|Invite Friends|Offline Maps|Downloads'},
admin:{
'Overview':'Admin Dashboard|Executive Summary|Live Operations|Daily Brief|Alerts Center|Quick Actions|Destination Health',
'Crowd Operations':'Crowd Monitor|Crowd Map|Site Crowd Detail|Crowd Simulator|Crowd Forecast|Queue Monitor|Density Monitor|Flow Monitor|Zone Monitor|Sensor Status|Signal Confidence|Crowd Alerts|Incident Log|Site Closures|Routing Rules|Alternative Capacity|Peak Hour Analysis',
'Places':'Places Overview|Place Directory|Add Place|Place Detail|Edit Place|Opening Hours|Entry Fees|Capacity Rules|Access Rules|Place Media|Heritage Content|Content Review|Site Contacts|Place Analytics',
'Experiences':'Experience Management|Experience Directory|Add Experience|Experience Detail|Review Experience|Verification Queue|Categories|Availability Monitor|Capacity Monitor|Quality Score|Featured Experiences|Suspended Experiences',
'Bookings':'Bookings Management|Bookings Overview|Upcoming Bookings|Completed Bookings|Cancelled Bookings|Booking Detail|Refund Queue|Payment Ledger|Settlement Overview|Disputes',
'Operators':'Operator Directory|Operator Applications|Operator Verification|Operator Detail|Artisan Directory|Guide Directory|Food Partners|Homestay Partners|Operator Performance|Operator Payouts|Operator Support|Suspended Operators',
'Analytics':'Analytics Overview|Visitor Trends|Visitor Distribution|Route Acceptance|Alternative Adoption|Local Spend Analytics|Experience Conversion|Booking Conversion|Repeat Visits|Source Markets|Language Analytics|Time of Day|Seasonality|Export Reports',
'Impact':'Impact Dashboard|Community Revenue|Business Support|Heritage Contribution|Impact by Zone|Impact by Operator|Impact by Experience|Sustainability Indicators|Monthly Impact Report',
'Settings':'Destination Settings|Crowd Thresholds|Scoring Weights|Recommendation Rules|Roles & Permissions|Audit Log|Integrations|Data Sources|API Settings|Privacy Controls|Notification Rules|Demo Reset'},
operator:{
'Setup':'Operator Welcome|Business Registration|Business Type|Identity Verification|Business Location|Contact Setup|Payout Setup|Profile Setup|Photo Upload|Onboarding Complete',
'Dashboard':'Operator Dashboard|Today Overview|Upcoming Guests|Revenue Snapshot|Profile Views|Rating Summary|Tasks',
'Experiences':'My Experiences|Add Experience|Edit Experience|Experience Preview|Pricing|Capacity|Schedule|Availability|Blackout Dates|What Is Included|Policies|Media Manager|Publish Experience',
'Bookings':'Operator Bookings|Upcoming|Completed|Cancelled|Booking Detail|Guest Detail|Check In|Manual Check In|QR Check In|No Show|Contact Guest|Booking Notes',
'Calendar':'Operator Calendar|Day View|Week View|Month View|Availability Editor|Bulk Availability|Time Slots|Capacity Calendar',
'Earnings':'Earnings Overview|Daily Earnings|Weekly Earnings|Monthly Earnings|Payout History|Payout Detail|Commission Breakdown|Tax Summary|Download Statement',
'Reviews':'Reviews Overview|New Reviews|Reply to Review|Rating Breakdown|Quality Insights',
'Customers':'Guest History|Repeat Guests|Customer Notes|Message Center',
'Account':'Operator Profile|Edit Business Profile|Team Members|Permissions|Notifications|Security|Help|Report Issue|Terms'},
partner:{
'Partner Portal':'Partner Dashboard|Hotel Partner Overview|Tour Operator Overview|Referral Links|Guest Recommendations|Experience Inventory|Commission Summary|Referral History|API Access|White Label Settings',
'Municipality':'Municipality Overview|Zone Performance|Site Performance|Visitor Redistribution|Local Economy Dashboard|Policy Rules|Campaigns|Off Peak Campaign|Emergency Broadcast|Reports',
'Research & Content':'Heritage Knowledge Base|Source Registry|Content Authors|Review Queue|Translation Queue|Cultural Sensitivity Review|Version History|Research Notes',
'Platform':'System Status|Integration Health|Data Governance|Consent Analytics|Anonymization Monitor|Audit Reports|Partner Management|Subscription Plans|Billing|Support Tickets'}};
const display:Record<string,ProductRole>={traveler:'Traveler',admin:'Destination Admin',operator:'Local Operator',partner:'Partner'};
const slug=(s:string)=>s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const PAGE_LIBRARY:ProductPage[]=Object.entries(raw).flatMap(([role,modules])=>Object.entries(modules).flatMap(([module,pages])=>pages.split('|').map(title=>({id:`${role}-${slug(module)}-${slug(title)}`,role:display[role],module,title,route:`#/${role}/${slug(module)}/${slug(title)}`,description:`${title} for the ${display[role].toLowerCase()} experience, designed as part of YatraLink's ${module.toLowerCase()} workflow.`}))));
export const PAGE_COUNT=PAGE_LIBRARY.length;
export const ROLE_COUNTS=PAGE_LIBRARY.reduce<Record<string,number>>((a,p)=>{a[p.role]=(a[p.role]||0)+1;return a;},{});
export const EXPECTED_ROLE_COUNTS:Record<ProductRole,number>={Traveler:149,'Destination Admin':107,'Local Operator':77,Partner:38};
export const EXPECTED_PAGE_COUNT=371;
for(const [role,count] of Object.entries(EXPECTED_ROLE_COUNTS)){if(ROLE_COUNTS[role]!==count)throw new Error(`YatraLink screen registry mismatch for ${role}: expected ${count}, got ${ROLE_COUNTS[role]||0}`)}
if(PAGE_COUNT!==EXPECTED_PAGE_COUNT)throw new Error(`YatraLink screen registry mismatch: expected ${EXPECTED_PAGE_COUNT}, got ${PAGE_COUNT}`);
