# Mannam - Meet up Clone

Mannam is a Meetup cloning site. Mannam can be used for creating groups, creating events and attending other's events. As a side note, Mannam literally means MeetUp in Korean. [Click here to view Mannam Live Site.](https://mannam.onrender.com)

### Please see below links to project Wiki
[API Documentation](https://github.com/hydralisk1/authenticate-me/wiki/API-Documentation)

[Database Schema](https://github.com/hydralisk1/authenticate-me/wiki/Database-Schema)

[Feature List](https://github.com/hydralisk1/authenticate-me/wiki/Feature-List)

## Tech Stack
### Frameworks, Platforms and Libraries:
* Javascripts
* HTML
* CSS
* node.js
* Express.js
* React
* Redux

### Database:
* Postgresql

### Hosting:
* Heroku

### API Services
* Google Maps API
* Google Geocoding API

## Landing Page
You can get to modals for log in and for sign up here. Also, this web application supports multi-languages. You can set your perferred language here. For now, English and Korean are available.

![landingpage]

[landingpage]: ./assets/landing-page.png

## Home Page

After log in, you'll get to this page. You can see calendar, events and groups here. Additionally, you can create a group clicking on 'Start a new group' button from the top side bar, log out and move to your groups page via profile button on top-right side. 'Mannam' logo on top-left side will always take you to this page.

Events or groups not having their own preview images will show Schrödinger's cat as place holders.

![homepage]

[homepage]: ./assets/homepage.png

## Group Detail Page

Users can join or leave groups on this page. Organizers will have 'Setting Group', 'Setting Events' buttons as below.

![groupdetail]

[groupdetail]: ./assets/groupdetail.png

## Event Detail Page

Users can see event images, event location with Google Maps based on latitude and longitude. (Maps on this image points a random location because of incorrect seed data.) If there are multiple event images, users can choose one and see it. If users already requested to attend this event or there's no remaining spot, attend button will be disabled.

Users can see attendees, address, location, price and remaining spots here.

Organizers can upload event images here.

![eventdetail]
![eventdetail2]

[eventdetail]: ./assets/eventdetail.png
[eventdetail2]: ./assets/eventdetail2.png

## Your groups page

Users can see groups organized and joined by themselves.

![yourgroups]

[yourgroups]: ./assets/yourgroups.png

## Group Settings Page

Organizers can set a group they organized here.

![groupsettings1]
![groupsettings2]

If organizers click on that modify button, they can edit group name, about and other things except for city and state. Organizers also can upload and remove group images, and add venues here.

![groupsettings3]
![groupsettings4]
![groupsettings5]

[groupsettings1]: ./assets/groupsettings1.png
[groupsettings2]: ./assets/groupsettings2.png
[groupsettings3]: ./assets/groupsettings3.png
[groupsettings4]: ./assets/groupsettings4.png
[groupsettings5]: ./assets/groupsettings5.png

## Event Settings Page

Organizers can create and remove events here.

![eventsettings1]
![eventsettings2]

[eventsettings1]: ./assets/eventsettings1.png
[eventsettings2]: ./assets/eventsettings2.png

## Start a new group Page

Users can create groups here. Group's location will be based on organizer's current location. If organizer doesn't allow using location, it will set to New York as the group's location for now. City and state name are from Google Geocoding API.

![creategroup1]
![creategroup2]

[creategroup1]: ./assets/creategroup1.png
[creategroup2]: ./assets/creategroup2.png
[creategroup3]: ./assets/creategroup3.png
[creategroup4]: ./assets/creategroup4.png
[creategroup5]: ./assets/creategroup5.png

Creating a group has a four steps to complete. Users can see which step they're on with progress bar.

![creategroup3]
![creategroup4]
![creategroup5]
