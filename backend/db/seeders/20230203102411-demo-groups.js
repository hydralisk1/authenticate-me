'use strict';

const { User } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const groups = [{
  name: "Phoenix Impact Investing Meetup Group",
  about: "To inform and educate individuals and the public about Impact Investing, a process where investors identify opportunities that make money and a difference in their community.\n\nPeople who want to learn how to harness the economy to fund the social changes they seek should join and people who have resources to invest in making those changes.\n\nWe will provide free educational material and real-world examples of how Impacting Investing delivers a win-in outcome for people and profits.",
  type: 'In person',
  private: false,
  city: "Phoenix",
  state: 'AZ',
},{
  name: "Young Social Professionals -YSP PHX 2.0",
  about: "Are you looking to make new friends with other young professionals? This group might be for you! YSP 2.0 is a new group designed to bring people together and form new friendships through a variety of activities such as: hiking, trying new restaurants, movies, game night, karaoke, dinner, dancing, wine tasting, brunches, happy hour, etc. Since a majority of our members are transplants from other cities, we understand the challenges of meeting people and making new friends. We are an easy-going group that doesn‚Äôt aspire to be as big as the other Meetup groups, but instead we focus on building lasting friendships and hosting fun events where you can get to know the other members. Most of the members in our group range in age from mid-20‚Äôs to late 30‚Äôs. While almost everyone has at least a bachelor‚Äôs degree, it is not a strict requirement.\n\nIf you are interested in meeting like-minded people and making new friends, follow the instructions and submit your information. Due to the popularity of the group, applications will be reviewed 1-2 times monthly and offered on a first come, first served basis with room permitting. You will be sent an email and private message the organizer and then if you you made the cut off you will be in and if not you can re-apply and try for the next months round (we strongly recommend you review your email settings for meetup as the groups has grown in popularity)\n\nPlease note: This is intended as a social group, not a networking group or a singles group. Therefore, please do not message other members of the group through the Meetup app to ask them out or solicit business, especially if you have not met them in person. We have a zero tolerance policy for this, and if cases are brought up to the leadership team, the person will be removed and banned from the group. The decision cannot be appealed.\n\nInstructions for joining:\n\nPlease post a clear and recent photo of yourself in addition to telling us a bit about yourself with a short intro in your profile. This will help us learn a little bit about you and find you at our events. (All information must be accurate and factual.) This is a private group and we reserve the right to remove members we consider unfit for the group or poses harm to other members.",
  type: 'In person',
  private: false,
  city: "Phoenix",
  state: 'AZ',
},{
  name: "Scottsdale's BEST Over 50 \"Happy Hours & More\" by Debra",
  about: "Join our FAMILY OF FRIENDS, for those over 50 that want to have fun! We will be making new friendships while enjoying a variety of activities together. We will always have many events to choose from. Please let me know if there is something you would like to see on our calendar. Any suggestions you might have, are always welcomed. Most of the events will be in Scottsdale, but may also take place in other areas of the valley. The majority of our members are single, but couples are welcome to join. In addition to dining and entertainment, we might also have a day trip, cruise or other travel itineraries to choose from. There is one guideline that we must adhere to, in order to be considerate to all our members and hosts. If you sign up for an event with reserved seating (i.e. a happy hour, dinner, Sunday brunch), and you are a no show 3 times, your membership will be terminated.\n\n\"Scottsdale's BEST Over 50\" has been waiting for you.\n\nLet's have fun!",
  type: 'In person',
  private: false,
  city: "Scottsdale",
  state: 'AZ',
},{
  name: "Gay Golden Girls",
  about: "We are a social group of women 50 and over who identify as lesbian. Our purpose is to meet at the events posted on our site for fun and conversation. We're based on the Northeast side but welcome older lesbians from all over the valley! Please include a picture with your profile so we can recognize you at events. Thanks!\nNOTE: New members will be asked if they meet our criteria.",
  type: 'In person',
  private: false,
  city: "LA",
  state: 'CA',
},{
  name: "Single & Sincere: Fabulous and Fun in our 40's",
  about: "I don't know about you, but I feel pretty fabulous in my 40's! I have a confidence and strength I never had before, and I've got a better grasp on life and adulting!\n\nWould you agree that in today's world with growing attention on apps, swiping, media glorifying a hookup culture, and so many different definitions for modern-day relationships, it can feel extra isolating wondering if that one love designed for you is out there and whether you'll find it? Not only that, it can be awkward to talk about. You don't want to be a negative nelly, but there are real fears and insecurities that can creep in as we age. So, let's be real and connect in meaningful yet positive and productive ways.\n\nThe goal of this group is to inspire and be inspired by people who share similar wants and values, who see the beauty that surrounds us, who want the best for those around them, and who still believe great love is out there. Pejorative comments about groups of people will not be tolerated.\n\nGroup Guidelines:\n*Each guest is asked to order food/drink and contribute toward tip in support of the hosting establishment. Let's be sure they want us back! :)\n*No male/female/other-bashing -- If I hear it, I will awkwardly ask you to change the subject and focus on what YOU bring. It is all of our responsibilities to keep this an emotionally healthy and safe group so please do help me protect that for us all.\n*No ex-bashing\n\nOur groups are all about intentionality. Here are our asks:\n*Put away your phone. Look up, engage with those around you, co-create the beautiful experience we all want to have.\n*We rely on precise headcounts out of respect for our hosting establishments and guests look forward to meeting you, so please honor your RSVP. No-shows and last minute cancellations will be removed from the group. The success and magic of our event counts on your unique presence :)! Our group is about quality, not quantity.\n\nWhat you can expect from our events:\n\nYou are asked to participate in Ice Breakers to suspend judgment! You have no idea which next stranger might just change your life!\nI will awkwardly redirect conversations away from politics, COVID, religion, social division, clickiness, or negativity if I hear them so be intentional with your words and presence :P We come together to find the beauty in all strangers!\nLet's create a space where we connect over the positives we want to affirm and create, not negativity/loss of the pass. Let's feel empowered over lessons learned and wisdom gained! We're more likely to attract what we want by investing time and surrounding ourselves with positive, like-minded people who believe in what we want. SO, let's create it together!\n\nIf you're hoping to one day attract a life-changing love and healthy partnership, if you enjoy connecting meaningfully over conversations that go beyond surface level, if you're interested in events centered around more than just alcohol and bars, join our group and help make it great! Whether you find a love connection or not is not the goal, although it would be outstanding if you do! That said, the group is not to be used for hookups and soliciting dates but rather for cultivating meaningful connections. What grows from there is a blessing. People want to do life, love, and relationships with people we like so let's grow in like of each other!\n\nWithin this group we rotate events from potlucks to game nights to coffee meetups, book workshops, and meals where we share conversation, enjoy activities and laughs, talk feelings, share real talk of what it's like to be in our 40's and singles, and deepen connections and sincerity.\n\nNote:\nSeveral have asked if they can join the group if they‚Äôre a few years outside of the 40‚Äôs age range but date those in their 40‚Äôs. I‚Äôve appreciated the honesty and welcomed them into group, asking that they lead with upfront honesty and respect with any connections they make. Happy to adjust as we go!",
  type: 'In person',
  private: false,
  city: "Las Vegas",
  state: 'NV',
},{
  name: "Over 50 Singles of Central Phoenix",
  about: "Our group welcomes any single person 50 years of age or over with the sole purpose of making new friends and enjoying social functions together. Our functions are held in and around the general Phoenix area.\n\nNOTE: we are a friendship site only, we are not a dating site.\n\nWe enjoy bi-monthly early Dinners, occasional luncheons, bi-monthly discussion groups, movies, cultural events, etc.\n\nThere is a $5.00 once a year membership fee. You will be asked to pay after you attend a function or two in order to continue your membership with the group.\n\nNOTE; A Covid vaccination(s), boosters, etc., is a requirement in order to attend any function.\n\nPlease note: if you sign up for a function with reserved seating (i.e. a dinner) and you are a no-show, your membership may be terminated.\n\nWe look forward to sharing fun and friendships with you!",
  type: 'In person',
  private: false,
  city: "Phoenix",
  state: 'AZ',
},{
  name: "The Wineopotamus Bloat",
  about: "You'll need to read this whole description and watch the video for the two secret words which will allow you to join. One secret word is in this description, the other is at the end of the video.\n\nWe have a weekly happy hour (usually 4:30-6:30 on Thursdays) and other special events like pot lucks, comedy shows, concerts, etc.\n\nThe Wineopotamus Bloat. What does it all mean? Wineopotamus is similar to our old name of Wineoceros which was a name made up for a TV show our previous organizer had in DC called The Wineoceros Show. Wineopotamus is pronounced like hippopotamus but starts with a \"Wineo\" instead of hippo.\n\nWhy Bloat? A group of hippopotamus is called a bloat. Who knew?! So we're a bloat of wine drinkers and lovers who like to gather for a good time. For our event a good time involves - wine, good conversations,  games and being considerate. So we require the following (with bolded phrases being paramount):\n\n1. First and foremost, this is a wine group so one must drink wine at our events.  If you don't want to do that, this group is not for you.\n\n2. To facilitate conversation, and to avoid that awkward moment of not remembering someone's name, we use name tags. Your first name goes on it and then below it, an answer to the question of the day. \nI'll send the question of the day out by email the day of the event and I'll post it on this website under the event description also. Please make sure you know the question when you arrive at the event. Fun, thoughtful answers really make a difference as far as interesting conversation!\n\n3. We drop corks at most event. Enthusiastically participating in cork dropping is important. If you win at cork dropping, you can win a brand new Mercedes Benz, a diamond ring, or something else! I can‚Äôt even count how many new cars were given away since the Bloat‚Äôs inception, but even if you don‚Äôt win the car, you will win a prize valued at $5 or more to take home with you. \n\nYou'll need to watch this VIDEO to learn how to drop corks AND get one of the secret words.\n\n4. And this is kind of obvious but still worth mentioning, if you RSVP and can‚Äôt make it, change your RSVP to No‚Ä¶ especially important since at most events attendance is limited. Last minute cancellations or no-shows will result in your removal from the group. \n\nIf you bring a guest, please make sure they are aware of the above requirements.\n\n5. While many of the attendees are single, this is not singles/dating group. The Bloat is about drinking wine, playing games, talking and having fun and building great relationships. If you happen to end up liking someone and dating that's great, but that is not the main purpose of the group. And GUYS, don't ask women out the first time you meet them. Slow your horses and get to know them and then, if there is some chemistry, feel free to ask them out.\n\nWomen, if a guy bothers you by being overly persistent or anything else, please let me know and I can remove the guy instead of you just not coming back again. And guys, refrain from asking out a lady or asking for her number on her first visit (and maybe her second too) to the Bloat. Let her ease into the group for Pete's sake. :)\n\n6. We don't charge an upfront membership fee to give you a chance to attend an event to see if you like it. Once you have attended an event, there is a $10 annual fee to be in the group and attend the events. The $10 is peanuts compared to the money you save on wine and food at the events plus the chance to win valuable prizes, not to mention all the great friends that you'll make!\n\n7. You can bring a person one time as a guest for free. Then, they can either join and pay the annual fee or continue coming as a guest and pay $5 each time.\n\n8. Please make sure you have a profile picture on your meetup account that is recent and accurate.\n\nYou can arrive and leave our events at any time. We're usually at a venue for two to three hours. If you have any questions, just ask me.\n\nThe one secret word is Good.\n\nCome join us!",
  type: 'In person',
  private: false,
  city: "Englewood",
  state: 'NJ',
},]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Groups'

    const userIds = await User.findAll({ attributes: ['id'] })

    return queryInterface.bulkInsert(options, groups.map((group, i) => ({...group, organizerId: userIds[i].id})), {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op
     options.tableName = 'Groups'

     return queryInterface.bulkDelete(options, {
       name: {[Op.in]: groups.map(group => group.name)}
     }, {})
  }
};
