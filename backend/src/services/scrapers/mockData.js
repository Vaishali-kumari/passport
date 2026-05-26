import { v4 as uuidv4 } from 'uuid';

const PLATFORMS = ['Twitter/X', 'Reddit', 'Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok'];
const REGIONS = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Germany', 'Singapore', 'France', 'Japan'];
const LANGUAGES = ['en', 'hi', 'es', 'fr', 'de', 'ar', 'zh', 'ru', 'ja', 'pa'];

const MOCK_POSTS = [
  { content: "Finally got my passport renewed after 3 months of waiting! The Tatkal service was a lifesaver. Applied online, got appointment in 2 days. #passport #tatkal", platform: "Twitter/X", region: "India", language: "en" },
  { content: "PSA: Passport appointment slots at the regional office are opening up every Tuesday at 9am. Set your alarm! The website crashes fast.", platform: "Reddit", region: "USA", language: "en" },
  { content: "Scam alert! Received a call from someone claiming to be from the passport office asking for OTP. DO NOT share OTP with anyone. Official offices never call for OTP.", platform: "Facebook", region: "India", language: "en" },
  { content: "Government announces new passport seva kendras in 50 more cities. Applications can now be submitted at post offices too. Great initiative!", platform: "Twitter/X", region: "India", language: "en" },
  { content: "My visa got rejected because my passport expires in less than 6 months. Always check the validity requirement before applying for a visa!", platform: "Instagram", region: "UK", language: "en" },
  { content: "पासपोर्ट नवीनीकरण के लिए ऑनलाइन आवेदन कैसे करें? मुझे पूरी प्रक्रिया समझ नहीं आई। कोई मदद कर सकता है?", platform: "Facebook", region: "India", language: "hi" },
  { content: "Lost my passport 2 days before my flight. Emergency passport process took 24 hours and cost $200 extra. Always keep a photocopy!", platform: "Twitter/X", region: "USA", language: "en" },
  { content: "The new e-passport with biometric chip is now available. Much faster at immigration. Applied last week, received in 10 days.", platform: "LinkedIn", region: "India", language: "en" },
  { content: "Passport application rejected due to incorrect photo specifications. White background, no glasses, neutral expression. Read the guidelines carefully!", platform: "Reddit", region: "Canada", language: "en" },
  { content: "Travel tip: Some countries require blank pages in your passport for visa stamps. Check before you travel to avoid being denied boarding.", platform: "Instagram", region: "Australia", language: "en" },
  { content: "Tatkal passport service review: Applied Monday, got appointment Wednesday, passport delivered Friday. Worth the extra fee if you're in a hurry.", platform: "YouTube", region: "India", language: "en" },
  { content: "New rule: Minors under 18 now need both parents' consent for passport application. Single parents need court order. Policy effective immediately.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "Passport renewal took only 7 days! Submitted documents online, verification call happened same day. System has improved a lot.", platform: "Facebook", region: "India", language: "en" },
  { content: "Warning: Fake passport agents charging ₹5000-10000 for 'fast processing'. They just submit your application normally. Save your money!", platform: "Reddit", region: "India", language: "en" },
  { content: "Just got my OCI card along with passport renewal. The process was smooth. Took about 6 weeks total. Happy with the service.", platform: "LinkedIn", region: "USA", language: "en" },
  { content: "Passport office appointment system down again. Third time this week. How are people supposed to apply?", platform: "Twitter/X", region: "India", language: "en" },
  { content: "My experience with passport renewal in Germany as an Indian expat: Required original documents + notarized copies. Took 3 months.", platform: "Reddit", region: "Germany", language: "en" },
  { content: "Visa on arrival for Indians expanded to 15 more countries! Check the updated list on the MEA website. Great news for travelers.", platform: "Facebook", region: "India", language: "en" },
  { content: "Pro tip: Book passport appointment early morning slots. Less crowd, faster processing, staff is more attentive.", platform: "TikTok", region: "India", language: "en" },
  { content: "Passport photo rejected 3 times. Finally found a studio that knows the exact specifications. Ears must be visible, no shadows!", platform: "Instagram", region: "UK", language: "en" },
  { content: "Emergency travel document issued in 4 hours for medical emergency abroad. Kudos to the passport office for the quick response.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "Renewal vs new passport: If your old passport has valid visas, get it renewed (not reissued) to keep those visas valid.", platform: "Reddit", region: "USA", language: "en" },
  { content: "Passport application status stuck on 'Police Verification Pending' for 45 days. Anyone know how to escalate this?", platform: "Facebook", region: "India", language: "en" },
  { content: "New passport design unveiled with enhanced security features. Holograms, UV-reactive ink, and digital watermarks. Impressive!", platform: "LinkedIn", region: "India", language: "en" },
  { content: "Scam: Website 'passport-seva-online.in' is fake. Only use passportindia.gov.in for official applications. Report these sites!", platform: "Twitter/X", region: "India", language: "en" },
  { content: "Got my passport in 3 days under Tatkal! Documents needed: Aadhaar, birth certificate, old passport. No agent needed, do it yourself.", platform: "YouTube", region: "India", language: "en" },
  { content: "Passport renewal appointment available in Dubai for NRIs. Contact the Indian consulate directly. Slots fill up fast.", platform: "Facebook", region: "UAE", language: "en" },
  { content: "Travel insurance tip: Some policies require your passport to be valid for 6 months beyond travel dates. Check before buying.", platform: "Instagram", region: "Singapore", language: "en" },
  { content: "My passport was damaged in flood. Emergency replacement process: File FIR, get affidavit, apply with damaged passport. Took 2 weeks.", platform: "Reddit", region: "India", language: "en" },
  { content: "Government portal update: You can now track your passport application in real-time with SMS and email notifications.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "asdfjkl qwerty zxcvbn passport lol 123456 free passport click here!!!", platform: "Twitter/X", region: "USA", language: "en" },
  { content: "BUY CHEAP PASSPORT ONLINE!!! GUARANTEED DELIVERY!!! CLICK LINK IN BIO!!!", platform: "Instagram", region: "Unknown", language: "en" },
  { content: "xxxxxxxxxxx passport xxxxxxxxx visa xxxxxxxxx free money xxxxxxxxx", platform: "Twitter/X", region: "Unknown", language: "en" },
  { content: "Passport renewal experience in Japan: Very organized system, appointment-based, staff speaks English. Took exactly 4 weeks.", platform: "Reddit", region: "Japan", language: "en" },
  { content: "New Schengen visa rules: Passport must be issued within last 10 years AND have 3 months validity beyond stay. Double check!", platform: "LinkedIn", region: "France", language: "en" },
  { content: "पासपोर्ट के लिए पुलिस वेरिफिकेशन में देरी हो रही है। क्या कोई बता सकता है कि इसे कैसे तेज़ करें?", platform: "Facebook", region: "India", language: "hi" },
  { content: "Passport appointment cancelled without notice. No email, no SMS. Had to rebook and wait another month. Terrible system.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "First time passport applicant guide: Birth certificate, Aadhaar, school certificate, 2 photos. Book online, pay fee, attend appointment.", platform: "YouTube", region: "India", language: "en" },
  { content: "Dual citizenship passport renewal: Need to declare both citizenships. Some countries don't allow dual citizenship - check first!", platform: "Reddit", region: "Canada", language: "en" },
  { content: "Passport office staff was incredibly helpful today. Guided me through the entire process. Not all government offices are bad!", platform: "Facebook", region: "India", language: "en" },
  { content: "Visa rejection due to passport damage (torn corner). Always keep your passport in a protective cover. Lesson learned the hard way.", platform: "Instagram", region: "India", language: "en" },
  { content: "New announcement: Passport fees revised. Normal: ₹1500, Tatkal: ₹3500, Minor: ₹1000. Effective from next month.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "My passport renewal took 6 months due to address change. Tip: Update address in Aadhaar BEFORE applying for passport renewal.", platform: "Reddit", region: "India", language: "en" },
  { content: "Passport seva kendra review: Clean, organized, token system works well. Average wait time 45 minutes. Better than expected.", platform: "Google Reviews", region: "India", language: "en" },
  { content: "Lost passport abroad: Contact nearest Indian embassy immediately. Emergency certificate issued within 24-48 hours for travel back.", platform: "LinkedIn", region: "UK", language: "en" },
  { content: "Passport application for senior citizens: Home visit service available in some cities. Call 1800-258-1800 for details.", platform: "Facebook", region: "India", language: "en" },
  { content: "My US passport renewal took 16 weeks! Expedited service took 8 weeks. The backlog is insane right now.", platform: "Reddit", region: "USA", language: "en" },
  { content: "Passport photo tip: Take photo against white wall at home, print at pharmacy. Saves ₹200 vs studio. Same quality.", platform: "TikTok", region: "India", language: "en" },
  { content: "Tatkal appointment booked! Documents checklist: Original + self-attested copies of all documents. Don't forget the tatkaal fee DD.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "Passport renewal for NRI in USA: Mail-in renewal takes 3-4 months. In-person at consulate takes 2-3 weeks. Plan accordingly.", platform: "Reddit", region: "USA", language: "en" },
  { content: "Government to launch mobile passport seva units in rural areas. Will visit villages monthly for passport applications. Great initiative!", platform: "LinkedIn", region: "India", language: "en" },
  { content: "Passport application rejected: Name mismatch between Aadhaar and birth certificate. Get affidavit for name correction first.", platform: "Facebook", region: "India", language: "en" },
  { content: "Travel hack: Some countries allow entry with expired passport if you have valid visa. Always verify with airline before travel.", platform: "Instagram", region: "Singapore", language: "en" },
  { content: "Passport renewal done! New passport has 50 pages instead of 36. More space for visa stamps. Small but welcome change.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "Warning: Passport delivery agent asked for ₹500 bribe for 'fast delivery'. Refused and reported. Passport delivered next day anyway.", platform: "Reddit", region: "India", language: "en" },
  { content: "Child passport application: Both parents must be present OR provide notarized consent letter. No exceptions at our PSK.", platform: "Facebook", region: "India", language: "en" },
  { content: "Passport office appointment system: Pro tip - check for cancellations at 11pm. Many people cancel same-day appointments.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "My passport renewal experience in Australia: Online application, Australia Post verification, 3 weeks delivery. Very smooth process.", platform: "Reddit", region: "Australia", language: "en" },
  { content: "New e-passport FAQ: The chip stores your biometric data. It's read-only and encrypted. Privacy concerns are overblown.", platform: "LinkedIn", region: "India", language: "en" },
  { content: "Passport application status: Granted! After 6 weeks of waiting. The online tracker is actually accurate now.", platform: "Twitter/X", region: "India", language: "en" },
  { content: "Visa stamping on new passport: Carry old passport too if it has valid visas. Airlines and immigration accept both together.", platform: "Instagram", region: "UAE", language: "en" },
  { content: "Passport renewal appointment: Bring original documents AND photocopies. They keep the copies, return originals. Don't forget pen!", platform: "Facebook", region: "India", language: "en" }
];

export const generateMockPosts = (count = 60) => {
  const now = Date.now();
  const posts = [];
  const available = [...MOCK_POSTS];

  for (let i = 0; i < Math.min(count, available.length); i++) {
    const template = available[i];
    const hoursAgo = Math.random() * 23;
    const publishedAt = new Date(now - hoursAgo * 3600 * 1000).toISOString();

    posts.push({
      id: uuidv4(),
      platform: template.platform,
      author: generateUsername(template.platform),
      handle: generateHandle(template.platform),
      content: template.content,
      url: generateUrl(template.platform),
      publishedAt,
      engagement: {
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 1000)
      },
      region: template.region,
      language: template.language,
      rawId: uuidv4()
    });
  }

  return posts;
};

const generateUsername = (platform) => {
  const names = ['PassportHelper', 'TravelGuru', 'VisaExpert', 'IndiaTravel', 'GlobalNomad',
    'PassportPro', 'TravelTips', 'VisaGuide', 'ExpatsIndia', 'TravelHacks'];
  return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 999);
};

const generateHandle = (platform) => {
  const prefix = platform === 'Reddit' ? 'u/' : '@';
  return prefix + generateUsername(platform).toLowerCase();
};

const generateUrl = (platform) => {
  const urls = {
    'Twitter/X': 'https://twitter.com/i/web/status/',
    'Reddit': 'https://reddit.com/r/passports/comments/',
    'Facebook': 'https://facebook.com/posts/',
    'Instagram': 'https://instagram.com/p/',
    'LinkedIn': 'https://linkedin.com/posts/',
    'YouTube': 'https://youtube.com/watch?v=',
    'TikTok': 'https://tiktok.com/@user/video/'
  };
  const base = urls[platform] || 'https://example.com/post/';
  return base + Math.random().toString(36).substring(2, 10);
};
