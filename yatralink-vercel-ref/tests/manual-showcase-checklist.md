# YatraLink showcase QA checklist

## 1. End-to-end booking
1. Login as Hary.
2. Open Traditional Woodcarving Workshop.
3. Select an available time and book two guests.
4. Confirm the booking appears in My Bookings.
5. In another browser, login as Asim and confirm the same booking appears in Operator → Bookings.
6. Mark it Checked In and confirm the Traveler booking status refreshes.

## 2. Availability and cancellation
1. Asim closes a Woodcarving time slot.
2. Traveler confirms the slot disappears.
3. Reopen it and create a booking.
4. Superadmin cancels the booking.
5. Confirm the released seats become available again.

## 3. Crowd realtime
1. Superadmin → Crowd → set Patan to High or Critical.
2. A signed-in Traveler keeps the Map open.
3. Confirm crowd badge/wait state updates without a manual refresh.

## 4. Engineer publication
1. Login as Hemanta.
2. Add two points and connect them.
3. Publish the route and Save.
4. Traveler Map should refresh and display the published route line.

## 5. Persistent user state
1. Traveler changes Display Name in Settings.
2. Refresh and confirm the new name remains.
3. Toggle location sharing from Traveler Privacy, refresh Settings → Privacy, and confirm it matches.
4. Redeem a reward, refresh, and confirm the points stay deducted.

## 6. Role boundaries
- Travelers cannot open Manager/Operator workspaces from the Traveler product map.
- Operators only see their own experiences, bookings, slots and reviews.
- Operator cannot directly publish an experience; paused experiences request re-approval.

## 7. AI planner
1. Add `OPENAI_API_KEY` in Vercel.
2. Traveler generates a 2–3 day plan.
3. Confirm the plan references current YatraLink places/experiences and labels non-live crowd values as estimates.
4. Remove the key temporarily and confirm a clear configuration/failure state appears instead of fake success.
