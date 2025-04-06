### TODO
- [ ] Handle Auto token creation
- [ ] Write an API which checks App version & gives response for hard update or not & integrate it on app.


### TODO (less priority)
- [ ] Create the callback API.
- [ ] Take name as well in User Login


### COMPLETED
- [x] Add status in tax model. Statuses would be CREATED, CONFIRMED, COMPLETED & CANCELLED. When order is created, it will be CREATED. Then I'll do status check, and once payment is success, status will change to CONFIRMED. Only CONFIRMED orders will be shown on the Admin Dashboard.
- [x] Add payment status as well in Tax Model - CREATED, COMPLETED, FAILED & PENDING. When the app will call backend for payment link generation, at that moment only create an order with status CREATED & payment status CREATED as well. Now if customer makes the payment & does not go back to the app, I have entry in my system. Cron will pick this data & update the order status & payment status for it.
- [x] Add a cron job which will fetch orders from last 1 or 2 hrs in CREATED status & check the payment status for them. This will help to reduce the number of missing orders.
- [x] Also add some mechanism so that once the order is placed, I'll check the status of the payment continuously as soon as the order gets placed.