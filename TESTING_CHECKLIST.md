# Marham Saudi - Testing Checklist

## 🧪 Pre-Launch Testing Checklist

### ✅ Authentication & User Management
- [ ] **Patient Registration**
  - [ ] Sign up with email and password
  - [ ] Email validation
  - [ ] Profile auto-creation in database
  - [ ] Patient record auto-creation
  
- [ ] **Patient Login**
  - [ ] Login with correct credentials
  - [ ] Error handling for wrong credentials
  - [ ] Self-healing logic for missing profiles
  - [ ] Redirect to intended page after login

- [ ] **Doctor Registration**
  - [ ] Complete 4-step registration wizard
  - [ ] Document upload (placeholder working)
  - [ ] Profile creation with pending status
  - [ ] Email confirmation sent

- [ ] **Doctor Login**
  - [ ] Login redirects to dashboard
  - [ ] Access control working
  - [ ] Self-healing for missing records

- [ ] **Logout**
  - [ ] Logout from patient dashboard
  - [ ] Logout from doctor dashboard
  - [ ] Session cleared properly

---

### 🏥 Patient Portal
- [ ] **Homepage**
  - [ ] Hero section loads with image
  - [ ] All sections render correctly
  - [ ] CTAs link to correct pages
  - [ ] Mobile responsive
  - [ ] RTL layout working

- [ ] **Doctor Listing**
  - [ ] Doctors load from database
  - [ ] Filters work (specialty, city, price)
  - [ ] Search functionality
  - [ ] Pagination if needed
  - [ ] Doctor cards display correctly

- [ ] **Doctor Profile**
  - [ ] Profile information displays
  - [ ] Qualifications shown
  - [ ] Reviews displayed
  - [ ] Availability calendar
  - [ ] Book button works

- [ ] **Booking Flow**
  - [ ] Select time slot
  - [ ] Enter patient information
  - [ ] Form validation working
  - [ ] Payment page (placeholder)
  - [ ] Confirmation page
  - [ ] Appointment created in database

- [ ] **Patient Dashboard**
  - [ ] Upcoming appointments shown
  - [ ] Past appointments shown
  - [ ] Join video call button appears
  - [ ] Appointment details correct

- [ ] **Health Articles**
  - [ ] Articles list page loads
  - [ ] 20 articles visible
  - [ ] Article detail page works
  - [ ] Categories filter
  - [ ] Search functionality
  - [ ] Read time displayed

---

### 👩‍⚕️ Doctor Portal
- [ ] **Doctor Dashboard**
  - [ ] Stats cards display correctly
  - [ ] Today's appointments count
  - [ ] Total patients count
  - [ ] Average rating shown
  - [ ] Monthly earnings calculated

- [ ] **Schedule Management**
  - [ ] Weekly schedule loads
  - [ ] Can toggle days on/off
  - [ ] Can add time slots
  - [ ] Can remove time slots
  - [ ] Save schedule to database
  - [ ] Load saved schedule

- [ ] **Appointments Management**
  - [ ] All appointments listed
  - [ ] Status badges correct
  - [ ] Join video call button works
  - [ ] Filtering by status
  - [ ] Patient information shown

- [ ] **Patients List**
  - [ ] All unique patients shown
  - [ ] Contact information displayed
  - [ ] Last visit date correct
  - [ ] Patient cards render properly

- [ ] **Earnings Dashboard**
  - [ ] Total earnings calculated
  - [ ] Paid amount shown
  - [ ] Pending amount shown
  - [ ] Transaction history table
  - [ ] Correct calculations from DB

- [ ] **Reviews Dashboard**
  - [ ] Average rating calculated
  - [ ] Total reviews count
  - [ ] Individual reviews listed
  - [ ] Patient names shown
  - [ ] Dates displayed correctly

- [ ] **Settings Page**
  - [ ] Current profile data loads
  - [ ] Can update name
  - [ ] Can update consultation price
  - [ ] Can update bio
  - [ ] Specialty is disabled
  - [ ] Form validation works
  - [ ] Toast notifications appear
  - [ ] Changes saved to database

---

### 📹 Video Consultation
- [ ] **Authorization**
  - [ ] Only patient/doctor can join
  - [ ] Unauthorized users blocked
  - [ ] Proper error messages

- [ ] **Video Room**
  - [ ] Jitsi Meet loads correctly
  - [ ] Video works
  - [ ] Audio works
  - [ ] Chat functionality
  - [ ] Screen sharing
  - [ ] Participant names shown

- [ ] **Post-Consultation**
  - [ ] End call button works
  - [ ] Feedback form appears
  - [ ] Rating system works
  - [ ] Review submission
  - [ ] Redirect to dashboard

---

### 🗄️ Database & Backend
- [ ] **Migrations**
  - [ ] Initial schema runs successfully
  - [ ] Can re-run without errors (idempotent)
  - [ ] Triggers working correctly
  - [ ] RLS policies enforced

- [ ] **Data Integrity**
  - [ ] Foreign keys enforced
  - [ ] Required fields validated
  - [ ] Enum types working
  - [ ] Timestamps auto-populated

- [ ] **Server Actions**
  - [ ] Login action works
  - [ ] Signup action works
  - [ ] Logout action works
  - [ ] Booking action works
  - [ ] Schedule save/load works
  - [ ] Profile update works
  - [ ] Doctor registration works

---

### 📱 Responsive Design
- [ ] **Mobile (< 768px)**
  - [ ] Homepage renders correctly
  - [ ] Navigation menu works
  - [ ] Forms are usable
  - [ ] Cards stack properly
  - [ ] Buttons are touchable

- [ ] **Tablet (768px - 1024px)**
  - [ ] Layout adjusts properly
  - [ ] Sidebars collapse/expand
  - [ ] Grid layouts work

- [ ] **Desktop (> 1024px)**
  - [ ] Full layout displays
  - [ ] Sidebars fixed
  - [ ] Optimal spacing

---

### 🌐 Localization & RTL
- [ ] **Arabic (RTL)**
  - [ ] Text aligns right
  - [ ] Icons flip correctly
  - [ ] Forms layout correct
  - [ ] Navigation reversed

- [ ] **English (LTR)**
  - [ ] Fallback text works
  - [ ] Mixed content displays well

---

### 🎨 UI/UX Polish
- [ ] **Color Scheme**
  - [ ] Teal/emerald colors consistent
  - [ ] No purple remnants
  - [ ] Contrast ratios accessible
  - [ ] Hover states work

- [ ] **Animations**
  - [ ] Smooth transitions
  - [ ] Loading states
  - [ ] Hover effects
  - [ ] Page transitions

- [ ] **Typography**
  - [ ] Arabic fonts render well
  - [ ] English fonts readable
  - [ ] Hierarchy clear
  - [ ] Line heights comfortable

---

### ⚡ Performance
- [ ] **Page Load Times**
  - [ ] Homepage < 3s
  - [ ] Doctor listing < 2s
  - [ ] Dashboard < 2s
  - [ ] Images optimized

- [ ] **Database Queries**
  - [ ] No N+1 queries
  - [ ] Proper indexing
  - [ ] Efficient joins

---

### 🔒 Security
- [ ] **Authentication**
  - [ ] Protected routes work
  - [ ] Unauthorized access blocked
  - [ ] Session management secure

- [ ] **Data Access**
  - [ ] RLS policies enforced
  - [ ] Users can only see their data
  - [ ] Doctors can't access other doctors' data

---

### 🐛 Error Handling
- [ ] **User-Facing Errors**
  - [ ] Clear error messages
  - [ ] Toast notifications
  - [ ] Form validation errors
  - [ ] Network error handling

- [ ] **Edge Cases**
  - [ ] Empty states handled
  - [ ] No data scenarios
  - [ ] Failed API calls
  - [ ] Missing images

---

## 📝 Test Scenarios

### Scenario 1: New Patient Books Appointment
1. Patient signs up
2. Browses doctors
3. Selects a doctor
4. Books appointment
5. Receives confirmation
6. Joins video call at appointment time
7. Completes consultation
8. Leaves review

### Scenario 2: Doctor Manages Schedule
1. Doctor logs in
2. Goes to schedule page
3. Sets availability for the week
4. Saves schedule
5. Logs out and back in
6. Verifies schedule persisted

### Scenario 3: Doctor Views Earnings
1. Doctor logs in
2. Goes to earnings page
3. Sees total earnings
4. Reviews transaction history
5. Checks pending payouts

### Scenario 4: Patient Reads Health Article
1. Patient visits homepage
2. Clicks on article preview
3. Reads full article
4. Navigates to article listing
5. Filters by category
6. Reads another article

---

## ✅ Sign-Off Checklist

- [ ] All critical paths tested
- [ ] No console errors
- [ ] No broken links
- [ ] All images load
- [ ] Forms submit correctly
- [ ] Database operations work
- [ ] Mobile experience good
- [ ] Arabic text displays correctly
- [ ] Color scheme consistent
- [ ] Ready for user testing

---

## 📊 Testing Results

**Date Tested:** _________________

**Tester:** _________________

**Browser:** _________________

**Device:** _________________

**Issues Found:** _________________

**Status:** ☐ Pass ☐ Fail ☐ Needs Review

---

## 🚀 Next Steps After Testing

1. Fix any critical bugs found
2. Optimize performance issues
3. Refine UI based on feedback
4. Prepare for payment integration
5. Set up email notifications
6. Plan user acceptance testing
