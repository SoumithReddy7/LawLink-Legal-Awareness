import type { Topic, Scenario, Quiz, Badge, Resource } from '@/types';

// Static content used as fallback / demo data and for initial DB seeding.
// All legal content is for educational awareness only.

export const STATIC_TOPICS: Topic[] = [
  {
    id: 't-cyber',
    title: 'Cybercrime & Online Safety',
    slug: 'cyber-safety',
    description: 'Learn to protect yourself from online fraud, phishing, cyberbullying, and digital scams.',
    icon: 'ShieldCheck',
    difficulty: 'beginner',
    color: 'blue',
    sort_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 't-consumer',
    title: 'Consumer Rights',
    slug: 'consumer-rights',
    description: 'Understand your rights as a consumer — warranties, refunds, defective products, and complaints.',
    icon: 'ShoppingBag',
    difficulty: 'beginner',
    color: 'green',
    sort_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 't-road',
    title: 'Road & Traffic Laws',
    slug: 'road-traffic',
    description: 'Know traffic rules, fines, penalties, and what to do during a traffic stop or accident.',
    icon: 'Car',
    difficulty: 'intermediate',
    color: 'orange',
    sort_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 't-privacy',
    title: 'Digital Privacy',
    slug: 'digital-privacy',
    description: 'Understand data protection, privacy rights, and how your personal data is used online.',
    icon: 'Lock',
    difficulty: 'intermediate',
    color: 'cyan',
    sort_order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 't-fundamental',
    title: 'Fundamental Rights',
    slug: 'fundamental-rights',
    description: 'Explore the fundamental rights guaranteed by the Constitution of India.',
    icon: 'Scale',
    difficulty: 'intermediate',
    color: 'indigo',
    sort_order: 5,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 't-student',
    title: 'Student Rights',
    slug: 'student-rights',
    description: 'Learn about your rights as a student — ragging, academic freedom, and campus safety.',
    icon: 'GraduationCap',
    difficulty: 'beginner',
    color: 'purple',
    sort_order: 6,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 't-workplace',
    title: 'Workplace Rights',
    slug: 'workplace-rights',
    description: 'Understand employment rights, workplace harassment, contracts, and labor protections.',
    icon: 'Briefcase',
    difficulty: 'advanced',
    color: 'slate',
    sort_order: 7,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 't-women',
    title: "Women's Safety",
    slug: 'womens-safety',
    description: 'Know the legal protections for women — harassment, domestic violence, and helplines.',
    icon: 'Heart',
    difficulty: 'intermediate',
    color: 'rose',
    sort_order: 8,
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

export const STATIC_SCENARIOS: Scenario[] = [
  {
    id: 's-1',
    topic_id: 't-cyber',
    title: 'The OTP Fraud',
    situation:
      'You receive a WhatsApp message from an unknown number claiming your bank account will be blocked within 24 hours unless you verify your identity by sharing the OTP sent to your phone.',
    question: 'What should you do?',
    explanation:
      'Banks never ask for your OTP over WhatsApp, SMS, or phone calls. OTPs are for authentication, not verification. Sharing your OTP can give fraudsters access to your bank account.',
    next_steps:
      'Do not share the OTP. Report the number on WhatsApp as spam. Call your bank using the official number on the back of your card or from the official website. If money was lost, file a complaint at cybercrime.gov.in.',
    why_it_matters:
      'OTP fraud is one of the most common cybercrimes in India. The RBI explicitly states that banks never ask for OTPs. Awareness is your first line of defense.',
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 's-2',
    topic_id: 't-cyber',
    title: 'The Fake Shopping Website',
    situation:
      'You find a website offering branded headphones at 80% off. The site looks new, has no reviews, and asks for UPI payment to a personal number rather than a business account.',
    question: 'What should you do?',
    explanation:
      'Extremely low prices on unknown sites are a classic scam pattern. Personal UPI IDs instead of business accounts, no reviews, and no return policy are red flags.',
    next_steps:
      'Do not make the payment. Search for the website name + "scam" or "review" online. Check if the site has a valid return policy and contact details. Use Cash on Delivery if available, or shop from verified platforms.',
    why_it_matters:
      'Online shopping fraud is rising rapidly. The Consumer Protection Act, 2019 protects you, but prevention is better than pursuing a complaint. Always verify before paying.',
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 's-3',
    topic_id: 't-cyber',
    title: 'Cyberbullying on Social Media',
    situation:
      'A classmate has created a fake Instagram account impersonating you and is posting embarrassing content. Other students are sharing the posts.',
    question: 'What should you do?',
    explanation:
      'Impersonation and cyberbullying are offenses under the IT Act, 2000. You have the right to report the account to the platform and file a police complaint.',
    next_steps:
      'Report the fake account to Instagram using "Report Account > It\'s pretending to be someone else." Take screenshots as evidence. Report to the cyber crime portal (cybercrime.gov.in). Inform your parents/guardians and school authorities.',
    why_it_matters:
      'Cyberbullying can have serious mental health impacts. The IT Act Section 66D punishes impersonation. Schools and colleges are required to have anti-ragging and anti-bullying policies.',
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 's-4',
    topic_id: 't-consumer',
    title: 'The Defective Phone',
    situation:
      'You bought a smartphone two months ago. The screen has developed dead spots. The store says it is not covered under warranty and refuses to repair or replace it.',
    question: 'What are your rights?',
    explanation:
      'Under the Consumer Protection Act, 2019, you have the right to a repair, replacement, or refund for defective products within the warranty period. The store cannot simply refuse.',
    next_steps:
      'Send a written complaint to the store with the bill and warranty card. If they do not respond within 30 days, file a complaint with the Consumer Disputes Redressal Commission. You can also file online at consumerhelpline.gov.in or call 1915.',
    why_it_matters:
      'Consumer protection laws exist to balance the power between buyers and sellers. Many consumers do not exercise their rights because they are unaware of them.',
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 's-5',
    topic_id: 't-consumer',
    title: 'The Overcharged Restaurant Bill',
    situation:
      'At a restaurant, the bill includes a "service charge" of 10%. When you question it, the manager says it is mandatory and refuses to remove it.',
    question: 'Is this legal?',
    explanation:
      'The Department of Consumer Affairs has clarified that service charges are voluntary. Restaurants cannot force customers to pay them. You can choose to pay a tip directly to the staff instead.',
    next_steps:
      'Request the manager to remove the service charge. If refused, pay only for the food and taxes. File a complaint at consumerhelpline.gov.in or call 1915. Leave a review mentioning the forced service charge.',
    why_it_matters:
      'Forced service charges are a widespread issue. Consumer awareness and collective action can push establishments to follow the guidelines.',
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 's-6',
    topic_id: 't-road',
    title: 'The Traffic Stop',
    situation:
      'A traffic police officer stops you for allegedly jumping a red light. You believe you did not jump the light. The officer asks you to pay a fine on the spot in cash.',
    question: 'What should you do?',
    explanation:
      'Traffic police cannot demand cash on the spot. Fines must be paid through official channels — online (e-challan), at the police station, or via court. You have the right to contest the charge in court.',
    next_steps:
      'Ask for the challan in writing. Note the officer\'s badge number. Do not pay cash on the spot. You can pay the e-challan online or contest it in traffic court. If the officer harasses you, report to the traffic police helpline or the state police complaints authority.',
    why_it_matters:
      'Knowing traffic rules and fine payment procedures protects you from corruption and ensures due process. The Motor Vehicles Act, 1988 governs these procedures.',
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 's-7',
    topic_id: 't-fundamental',
    title: 'The Right to Protest',
    situation:
      'You and your friends want to organize a peaceful protest at a public park against a college fee hike. The local authority denies permission without giving a reason.',
    question: 'What are your rights?',
    explanation:
      'Article 19 of the Constitution guarantees the right to peaceful assembly, subject to reasonable restrictions. The authority must provide a valid reason for denial and cannot ban protests arbitrarily.',
    next_steps:
      'Request the authority to provide written reasons for denial. You can approach the High Court under Article 226 for a writ if the denial is unreasonable. Consider alternative venues or online campaigns.',
    why_it_matters:
      'The right to peaceful protest is a fundamental democratic right. Understanding constitutional protections empowers citizens to participate in democracy.',
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 's-8',
    topic_id: 't-women',
    title: 'Workplace Harassment',
    situation:
      'A female employee faces repeated inappropriate comments from a senior colleague. HR dismisses her complaint saying "it was just a joke."',
    question: 'What should she do?',
    explanation:
      'The Sexual Harassment of Women at Workplace (POSH) Act, 2013 requires every workplace with 10+ employees to have an Internal Complaints Committee (ICC). HR cannot dismiss complaints without a proper inquiry.',
    next_steps:
      'File a written complaint with the ICC. The ICC must complete the inquiry within 90 days. If the workplace has no ICC, file a complaint with the Local Complaints Committee at the district level. She can also file a police complaint under Section 354A IPC.',
    why_it_matters:
      'The POSH Act is a critical protection for women at work. Awareness of this law encourages reporting and creates safer workplaces.',
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
];

export const STATIC_SCENARIO_OPTIONS: Record<string, { label: string; is_correct: boolean }[]> = {
  's-1': [
    { label: 'Share the OTP to prevent account blocking', is_correct: false },
    { label: 'Ignore the message, report it, and contact the bank through official channels', is_correct: true },
    { label: 'Forward the OTP to a friend for advice', is_correct: false },
    { label: 'Reply with personal information to verify identity', is_correct: false },
  ],
  's-2': [
    { label: 'Pay immediately — the deal is too good to miss', is_correct: false },
    { label: 'Search for reviews of the website and verify before paying', is_correct: true },
    { label: 'Pay but ask for a receipt', is_correct: false },
    { label: 'Share the deal with friends so they can also buy', is_correct: false },
  ],
  's-3': [
    { label: 'Create a fake account to get back at them', is_correct: false },
    { label: 'Report the account, take screenshots, and file a cyber crime complaint', is_correct: true },
    { label: 'Delete your own Instagram account', is_correct: false },
    { label: 'Confront the classmate physically', is_correct: false },
  ],
  's-4': [
    { label: 'Accept the store\'s decision — warranty is optional', is_correct: false },
    { label: 'File a complaint with the Consumer Disputes Redressal Commission', is_correct: true },
    { label: 'Buy a new phone and forget about it', is_correct: false },
    { label: 'Post angry reviews without trying legal remedies', is_correct: false },
  ],
  's-5': [
    { label: 'Pay the service charge — it is mandatory', is_correct: false },
    { label: 'Ask to remove it; service charge is voluntary per government guidelines', is_correct: true },
    { label: 'Leave without paying the food bill', is_correct: false },
    { label: 'Argue loudly with the manager', is_correct: false },
  ],
  's-6': [
    { label: 'Pay cash on the spot to settle it quickly', is_correct: false },
    { label: 'Request a written challan and pay through official channels', is_correct: true },
    { label: 'Argue with the officer and drive away', is_correct: false },
    { label: 'Bribe the officer with a smaller amount', is_correct: false },
  ],
  's-7': [
    { label: 'Give up — you cannot challenge government decisions', is_correct: false },
    { label: 'Request written reasons and approach the High Court if denial is arbitrary', is_correct: true },
    { label: 'Protest anyway without permission', is_correct: false },
    { label: 'File an RTI but do nothing else', is_correct: false },
  ],
  's-8': [
    { label: 'Quit the job silently', is_correct: false },
    { label: 'File a written complaint with the ICC under the POSH Act', is_correct: true },
    { label: 'Post about it on social media naming the colleague', is_correct: false },
    { label: 'Wait and hope it stops on its own', is_correct: false },
  ],
};

export const STATIC_QUIZZES: Quiz[] = [
  {
    id: 'q-cyber',
    topic_id: 't-cyber',
    title: 'Cyber Safety Quiz',
    description: 'Test your knowledge of online safety, phishing, and digital fraud prevention.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-consumer',
    topic_id: 't-consumer',
    title: 'Consumer Rights Quiz',
    description: 'Check your understanding of consumer protection and your rights as a buyer.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-road',
    topic_id: 't-road',
    title: 'Road & Traffic Laws Quiz',
    description: 'How well do you know traffic rules and your rights on the road?',
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-fundamental',
    topic_id: 't-fundamental',
    title: 'Fundamental Rights Quiz',
    description: 'Test your knowledge of the fundamental rights in the Constitution of India.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'q-women',
    topic_id: 't-women',
    title: "Women's Safety Quiz",
    description: 'Understand the legal protections available for women in India.',
    created_at: new Date().toISOString(),
  },
];

export const STATIC_QUIZ_QUESTIONS: Record<
  string,
  { question: string; explanation: string; options: { label: string; is_correct: boolean }[] }[]
> = {
  'q-cyber': [
    {
      question: 'A caller claims to be from your bank and asks for your OTP. What should you do?',
      explanation: 'Banks never ask for OTPs. The RBI has explicitly stated this. Never share your OTP with anyone.',
      options: [
        { label: 'Share the OTP since the caller says they are from the bank', is_correct: false },
        { label: 'Hang up and call the bank using the official number', is_correct: true },
        { label: 'Share half the OTP for partial verification', is_correct: false },
        { label: 'Ask the caller to email you before sharing', is_correct: false },
      ],
    },
    {
      question: 'Which of these is the safest practice for online passwords?',
      explanation: 'Using unique passwords for different accounts prevents a single breach from compromising all your accounts.',
      options: [
        { label: 'Use the same password everywhere so you remember it', is_correct: false },
        { label: 'Use different passwords for each account and a password manager', is_correct: true },
        { label: 'Write all passwords in a note on your phone', is_correct: false },
        { label: 'Use your birthdate — it is easy to remember', is_correct: false },
      ],
    },
    {
      question: 'You receive a link claiming "You won a lottery!" What is the best action?',
      explanation: 'Phishing links often disguise themselves as prize notifications. Never click suspicious links or share personal data.',
      options: [
        { label: 'Click the link to claim your prize', is_correct: false },
        { label: 'Delete the message and report it as phishing', is_correct: true },
        { label: 'Forward it to friends to see if they won too', is_correct: false },
        { label: 'Reply with your bank details to receive the money', is_correct: false },
      ],
    },
    {
      question: 'What does two-factor authentication (2FA) do?',
      explanation: '2FA adds an extra layer of security by requiring a second verification step beyond your password.',
      options: [
        { label: 'Makes your password unnecessary', is_correct: false },
        { label: 'Adds a second verification step for account access', is_correct: true },
        { label: 'Blocks all internet traffic to your device', is_correct: false },
        { label: 'Slows down your internet connection', is_correct: false },
      ],
    },
    {
      question: 'If you become a victim of online fraud, where can you report it?',
      explanation: 'The National Cyber Crime Reporting Portal (cybercrime.gov.in) is the official platform for reporting cyber crimes in India.',
      options: [
        { label: 'Nowhere — online fraud cannot be reported', is_correct: false },
        { label: 'At cybercrime.gov.in — the National Cyber Crime Reporting Portal', is_correct: true },
        { label: 'Only on social media', is_correct: false },
        { label: 'To your friends and family', is_correct: false },
      ],
    },
  ],
  'q-consumer': [
    {
      question: 'Under the Consumer Protection Act, 2019, what rights do you have for a defective product?',
      explanation: 'The Act provides the right to repair, replacement, or refund for defective products within the warranty period.',
      options: [
        { label: 'No rights — you bought it, it is your problem', is_correct: false },
        { label: 'Right to repair, replacement, or refund', is_correct: true },
        { label: 'Right to a public apology only', is_correct: false },
        { label: 'Right to a 50% discount on next purchase', is_correct: false },
      ],
    },
    {
      question: 'Is a restaurant\'s service charge mandatory?',
      explanation: 'The Department of Consumer Affairs has clarified that service charges are voluntary. Customers can choose not to pay them.',
      options: [
        { label: 'Yes, it is legally mandatory', is_correct: false },
        { label: 'No, it is voluntary as per government guidelines', is_correct: true },
        { label: 'Only on weekends', is_correct: false },
        { label: 'Only if the bill is above Rs. 500', is_correct: false },
      ],
    },
    {
      question: 'What is the national consumer helpline number?',
      explanation: '1915 is the national consumer helpline number. You can also file complaints at consumerhelpline.gov.in.',
      options: [
        { label: '100', is_correct: false },
        { label: '1915', is_correct: true },
        { label: '1091', is_correct: false },
        { label: '112', is_correct: false },
      ],
    },
    {
      question: 'Within how many days should a seller respond to a consumer complaint?',
      explanation: 'Under the Consumer Protection Act, a seller should respond to a written complaint within 30 days.',
      options: [
        { label: '7 days', is_correct: false },
        { label: '30 days', is_correct: true },
        { label: '90 days', is_correct: false },
        { label: 'No time limit exists', is_correct: false },
      ],
    },
    {
      question: 'What is "unfair trade practice" under consumer law?',
      explanation: 'Unfair trade practices include false advertising, misleading claims, and deceptive sales tactics that exploit consumers.',
      options: [
        { label: 'Selling products at a discount', is_correct: false },
        { label: 'False advertising and misleading consumers', is_correct: true },
        { label: 'Opening a shop near a competitor', is_correct: false },
        { label: 'Charging taxes on products', is_correct: false },
      ],
    },
  ],
  'q-road': [
    {
      question: 'Can traffic police demand cash payment for a fine on the spot?',
      explanation: 'No. Fines must be paid through official channels such as e-challan, police station, or court. Cash payment on the spot is not required.',
      options: [
        { label: 'Yes, cash payment on the spot is required', is_correct: false },
        { label: 'No, fines must be paid through official channels', is_correct: true },
        { label: 'Only if the fine is below Rs. 500', is_correct: false },
        { label: 'Only during night hours', is_correct: false },
      ],
    },
    {
      question: 'What is the legal drinking age limit for driving in India?',
      explanation: 'India has a zero-tolerance policy for drinking and driving. Any detectable alcohol level is a violation under the Motor Vehicles Act.',
      options: [
        { label: 'Below 0.03% BAC', is_correct: false },
        { label: 'Zero — any detectable alcohol is a violation', is_correct: true },
        { label: 'Below 0.08% BAC', is_correct: false },
        { label: 'One drink is fine', is_correct: false },
      ],
    },
    {
      question: 'What must you carry while driving a two-wheeler?',
      explanation: 'A valid driving license, registration certificate, insurance, and a helmet (for the rider and pillion) are mandatory.',
      options: [
        { label: 'Only a helmet', is_correct: false },
        { label: 'Valid license, RC, insurance, and helmet', is_correct: true },
        { label: 'Only the registration certificate', is_correct: false },
        { label: 'Nothing — documents are optional', is_correct: false },
      ],
    },
    {
      question: 'What should you do if you are involved in a road accident?',
      explanation: 'Stop, help the injured, call 112 (emergency), and inform the police. Leaving the scene is a punishable offense.',
      options: [
        { label: 'Leave the scene immediately', is_correct: false },
        { label: 'Stop, help the injured, call 112, and inform police', is_correct: true },
        { label: 'Take photos and leave', is_correct: false },
        { label: 'Argue with the other driver', is_correct: false },
      ],
    },
    {
      question: 'Can you contest a traffic challan in court?',
      explanation: 'Yes. You have the right to contest a traffic challan in the traffic court. You are presumed innocent until proven guilty.',
      options: [
        { label: 'No, challans cannot be contested', is_correct: false },
        { label: 'Yes, you can contest it in traffic court', is_correct: true },
        { label: 'Only if the fine is above Rs. 1000', is_correct: false },
        { label: 'Only if you have a lawyer', is_correct: false },
      ],
    },
  ],
  'q-fundamental': [
    {
      question: 'Which Article of the Constitution guarantees the Right to Equality?',
      explanation: 'Article 14 guarantees equality before law and equal protection of laws to all persons within Indian territory.',
      options: [
        { label: 'Article 19', is_correct: false },
        { label: 'Article 14', is_correct: true },
        { label: 'Article 21', is_correct: false },
        { label: 'Article 32', is_correct: false },
      ],
    },
    {
      question: 'Which Article guarantees the Right to Life and Personal Liberty?',
      explanation: 'Article 21 guarantees that no person shall be deprived of life or personal liberty except according to procedure established by law.',
      options: [
        { label: 'Article 14', is_correct: false },
        { label: 'Article 21', is_correct: true },
        { label: 'Article 25', is_correct: false },
        { label: 'Article 15', is_correct: false },
      ],
    },
    {
      question: 'Which Article guarantees Freedom of Speech and Expression?',
      explanation: 'Article 19(1)(a) guarantees freedom of speech and expression, subject to reasonable restrictions.',
      options: [
        { label: 'Article 21', is_correct: false },
        { label: 'Article 19', is_correct: true },
        { label: 'Article 14', is_correct: false },
        { label: 'Article 22', is_correct: false },
      ],
    },
    {
      question: 'What is the Right to Constitutional Remedies (Article 32)?',
      explanation: 'Article 32 allows citizens to approach the Supreme Court directly if their fundamental rights are violated. Dr. Ambedkar called it the "heart and soul" of the Constitution.',
      options: [
        { label: 'Right to property', is_correct: false },
        { label: 'Right to approach the Supreme Court for rights enforcement', is_correct: true },
        { label: 'Right to education', is_correct: false },
        { label: 'Right to vote', is_correct: false },
      ],
    },
    {
      question: 'Which fundamental right was added by the 86th Amendment?',
      explanation: 'The 86th Amendment Act, 2002 added Article 21A, making the Right to Education a fundamental right for children aged 6-14.',
      options: [
        { label: 'Right to Property', is_correct: false },
        { label: 'Right to Education (Article 21A)', is_correct: true },
        { label: 'Right to Work', is_correct: false },
        { label: 'Right to Health', is_correct: false },
      ],
    },
  ],
  'q-women': [
    {
      question: 'What does the POSH Act, 2013 deal with?',
      explanation: 'The Sexual Harassment of Women at Workplace (POSH) Act, 2013 provides protection against sexual harassment at workplaces.',
      options: [
        { label: 'Property rights of women', is_correct: false },
        { label: 'Sexual harassment at the workplace', is_correct: true },
        { label: 'Domestic violence', is_correct: false },
        { label: 'Child marriage', is_correct: false },
      ],
    },
    {
      question: 'What is the Women\'s helpline number in India?',
      explanation: '181 is the 24x7 women\'s helpline. 1091 is the women\'s police helpline. 112 is the general emergency number.',
      options: [
        { label: '100', is_correct: false },
        { label: '181', is_correct: true },
        { label: '1071', is_correct: false },
        { label: '1900', is_correct: false },
      ],
    },
    {
      question: 'What does the Domestic Violence Act, 2005 protect?',
      explanation: 'The Protection of Women from Domestic Violence Act, 2005 protects women from physical, emotional, sexual, and economic abuse in domestic relationships.',
      options: [
        { label: 'Only physical violence', is_correct: false },
        { label: 'Physical, emotional, sexual, and economic abuse', is_correct: true },
        { label: 'Only married women', is_correct: false },
        { label: 'Only women in workplaces', is_correct: false },
      ],
    },
    {
      question: 'Is dowry legal in India?',
      explanation: 'The Dowry Prohibition Act, 1961 makes giving and taking dowry a punishable offense. Despite the law, the practice persists in some communities.',
      options: [
        { label: 'Yes, with restrictions', is_correct: false },
        { label: 'No, it is illegal under the Dowry Prohibition Act, 1961', is_correct: true },
        { label: 'Only for certain communities', is_correct: false },
        { label: 'Only if the amount is below Rs. 50,000', is_correct: false },
      ],
    },
    {
      question: 'What is the legal minimum age for marriage for women in India?',
      explanation: 'As per the Prohibition of Child Marriage Act, 2006, the legal minimum age for marriage is 18 for women and 21 for men.',
      options: [
        { label: '16', is_correct: false },
        { label: '18', is_correct: true },
        { label: '21', is_correct: false },
        { label: 'No legal minimum exists', is_correct: false },
      ],
    },
  ],
};

export const STATIC_BADGES: Badge[] = [
  {
    id: 'b-first-step',
    name: 'First Step',
    description: 'Complete your first activity on LawLink',
    icon: 'Footprints',
    criteria: 'first_activity',
    color: 'blue',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-cyber-guardian',
    name: 'Cyber Guardian',
    description: 'Complete the Cyber Safety topic',
    icon: 'ShieldCheck',
    criteria: 'topic_complete:t-cyber',
    color: 'cyan',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-quiz-starter',
    name: 'Quiz Starter',
    description: 'Complete your first quiz',
    icon: 'Brain',
    criteria: 'first_quiz',
    color: 'green',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 5 activities',
    icon: 'Search',
    criteria: '5_activities',
    color: 'amber',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-legal-explorer',
    name: 'Legal Explorer',
    description: 'Complete 3 topics',
    icon: 'Compass',
    criteria: '3_topics',
    color: 'indigo',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-perfect-score',
    name: 'Perfect Score',
    description: 'Score 100% on a quiz',
    icon: 'Trophy',
    criteria: 'perfect_score',
    color: 'yellow',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-consistency',
    name: 'Consistency Champion',
    description: 'Maintain a 7-day learning streak',
    icon: 'Flame',
    criteria: '7_day_streak',
    color: 'orange',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-scenario-master',
    name: 'Scenario Master',
    description: 'Complete 5 scenarios correctly',
    icon: 'Target',
    criteria: '5_scenarios',
    color: 'rose',
    created_at: new Date().toISOString(),
  },
];

export const STATIC_RESOURCES: Resource[] = [
  {
    id: 'r-1',
    name: 'National Cyber Crime Reporting Portal',
    category: 'Cybercrime',
    description: 'Official portal to report cyber crimes, online fraud, and social media-related crimes in India.',
    contact: '1930 (Cyber Crime Helpline)',
    website: 'cybercrime.gov.in',
    source: 'Ministry of Home Affairs, Government of India',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-2',
    name: 'National Consumer Helpline',
    category: 'Consumer Complaints',
    description: 'File consumer complaints and seek guidance on consumer rights issues.',
    contact: '1915',
    website: 'consumerhelpline.gov.in',
    source: 'Department of Consumer Affairs, Government of India',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-3',
    name: 'Women Helpline (181)',
    category: "Women's Safety",
    description: '24x7 helpline for women in distress providing support, information, and referral services.',
    contact: '181',
    website: 'nhm.gov.in',
    source: 'Ministry of Women and Child Development',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-4',
    name: 'Emergency Response Support System',
    category: 'Emergency',
    description: 'Single emergency number for police, fire, ambulance, and disaster response.',
    contact: '112',
    website: '112.gov.in',
    source: 'Ministry of Home Affairs, Government of India',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-5',
    name: 'National Legal Services Authority (NALSA)',
    category: 'Legal Aid',
    description: 'Provides free legal aid and services to eligible citizens including women, children, and marginalized groups.',
    contact: '15100 (Legal Aid Helpline)',
    website: 'nalsa.gov.in',
    source: 'Supreme Court of India',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-6',
    name: 'Anti-Ragging Helpline',
    category: 'Student Support',
    description: 'Report ragging incidents in colleges and universities. Mandatory under UGC regulations.',
    contact: '1800-180-5522',
    website: 'antiragging.in',
    source: 'University Grants Commission (UGC)',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-7',
    name: 'Parivahan Sewa — Traffic Services',
    category: 'Road & Traffic',
    description: 'Access driving license services, vehicle registration, e-challan payment, and traffic rules information.',
    contact: null,
    website: 'parivahan.gov.in',
    source: 'Ministry of Road Transport and Highways',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-8',
    name: 'POSH Complaint Portal',
    category: "Women's Safety",
    description: 'Information and resources for filing workplace sexual harassment complaints under the POSH Act, 2013.',
    contact: null,
    website: 'shebox.nic.in',
    source: 'Ministry of Women and Child Development',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-9',
    name: 'Cyber Crime Virtual Cyber Cell',
    category: 'Cybercrime',
    description: 'State-level virtual cyber cells for reporting and investigating cyber crime complaints.',
    contact: '1930',
    website: 'cybercrime.gov.in',
    source: 'State Police Cyber Crime Wings',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-10',
    name: 'MyGov — Citizen Services Portal',
    category: 'Government Services',
    description: 'Centralized portal for government services, schemes, and citizen engagement.',
    contact: null,
    website: 'mygov.in',
    source: 'Government of India',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-11',
    name: 'District Legal Services Authority',
    category: 'Legal Aid',
    description: 'Local legal aid services including free legal counsel, Lok Adalats, and mediation. Available at district level.',
    contact: '15100',
    website: 'nalsa.gov.in',
    source: 'State Legal Services Authorities',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r-12',
    name: 'Childline India',
    category: 'Student Support',
    description: '24x7 helpline for children in need of care and protection. Report child abuse, labor, and missing children.',
    contact: '1098',
    website: 'childlineindia.org.in',
    source: 'Ministry of Women and Child Development',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
];

// Demo leaderboard data for when there are not enough real users.
export const DEMO_LEADERBOARD = [
  { display_name: 'Priya S.', xp: 2150, level: 6, badge_count: 8 },
  { display_name: 'Arjun M.', xp: 1850, level: 6, badge_count: 7 },
  { display_name: 'Sneha R.', xp: 1320, level: 5, badge_count: 6 },
  { display_name: 'Vikram K.', xp: 980, level: 5, badge_count: 5 },
  { display_name: 'Ananya P.', xp: 720, level: 4, badge_count: 5 },
  { display_name: 'Rohan D.', xp: 540, level: 4, badge_count: 4 },
  { display_name: 'Kavya N.', xp: 380, level: 3, badge_count: 3 },
  { display_name: 'Karthik V.', xp: 210, level: 2, badge_count: 2 },
];

// Learn content for topics — short explanations, do/don'ts, examples.
export const LEARN_CONTENT: Record<
  string,
  {
    sections: { title: string; content: string; type?: 'info' | 'warning' | 'tip' }[];
    dos: string[];
    donts: string[];
  }
> = {
  't-cyber': {
    sections: [
      {
        title: 'What is Cybercrime?',
        content:
          'Cybercrime refers to criminal activities carried out using computers or the internet. This includes phishing, identity theft, online fraud, cyberbullying, and hacking. In India, cybercrimes are governed by the Information Technology Act, 2000.',
        type: 'info',
      },
      {
        title: 'Common Types of Online Fraud',
        content:
          'Phishing (fake emails/messages asking for info), OTP fraud (tricking you into sharing OTPs), UPI fraud (scanning malicious QR codes), and fake shopping websites offering unbelievable deals.',
        type: 'info',
      },
      {
        title: 'Your Rights as a Digital Citizen',
        content:
          'You have the right to report cyber crimes, seek compensation for damages, and access the National Cyber Crime Reporting Portal. The IT Act provides legal remedies and penalties for cyber offenders.',
        type: 'tip',
      },
      {
        title: 'Warning: Never Share These',
        content:
          'Never share your OTP, CVV, net banking password, or UPI PIN with anyone — not even bank officials. Banks never ask for these details.',
        type: 'warning',
      },
    ],
    dos: [
      'Use strong, unique passwords for each account',
      'Enable two-factor authentication (2FA)',
      'Verify website URLs before entering payment details',
      'Report suspicious messages and calls',
      'Keep your devices updated with security patches',
    ],
    donts: [
      'Never share OTPs, PINs, or passwords with anyone',
      'Do not click on suspicious links in messages or emails',
      'Do not scan unknown QR codes',
      'Do not use public Wi-Fi for banking transactions',
      'Do not install apps from unknown sources',
    ],
  },
  't-consumer': {
    sections: [
      {
        title: 'Consumer Protection Act, 2019',
        content:
          'The Consumer Protection Act, 2019 protects buyers against unfair trade practices, defective products, and deficient services. It established Consumer Disputes Redressal Commissions at district, state, and national levels.',
        type: 'info',
      },
      {
        title: 'Your Rights as a Consumer',
        content:
          'Right to safety, right to be informed, right to choose, right to be heard, right to seek redressal, and right to consumer education. These are the six consumer rights recognized in India.',
        type: 'info',
      },
      {
        title: 'How to File a Complaint',
        content:
          'Send a written complaint to the seller. If unresolved within 30 days, file a complaint with the Consumer Disputes Redressal Commission. You can also call 1915 or visit consumerhelpline.gov.in.',
        type: 'tip',
      },
    ],
    dos: [
      'Always take a bill or receipt for purchases',
      'Read warranty terms carefully',
      'Keep packaging and proof of purchase',
      'File complaints within the limitation period',
    ],
    donts: [
      'Do not accept verbal promises — get them in writing',
      'Do not delay filing complaints',
      'Do not pay for "free" services',
      'Do not ignore defective products',
    ],
  },
  't-road': {
    sections: [
      {
        title: 'Motor Vehicles Act, 1988',
        content:
          'The Motor Vehicles Act governs road transport, traffic rules, and penalties in India. It was amended in 2019 with stricter penalties for traffic violations including drunk driving, overspeeding, and not wearing helmets/seatbelts.',
        type: 'info',
      },
      {
        title: 'Your Rights During a Traffic Stop',
        content:
          'You have the right to a written challan, the right to contest the charge in court, and the right to note the officer\'s badge number. You cannot be forced to pay cash on the spot.',
        type: 'info',
      },
      {
        title: 'What to Do After an Accident',
        content:
          'Stop immediately, help the injured, call 112, and inform the police. Leaving an accident scene is a punishable offense. File an FIR and inform your insurance company.',
        type: 'warning',
      },
    ],
    dos: [
      'Always wear a helmet/seatbelt',
      'Carry valid documents (DL, RC, insurance, PUC)',
      'Follow speed limits and traffic signals',
      'Pay fines through official e-challan',
    ],
    donts: [
      'Never drink and drive',
      'Do not use mobile phones while driving',
      'Do not pay cash bribes to traffic police',
      'Do not leave an accident scene',
    ],
  },
  't-fundamental': {
    sections: [
      {
        title: 'What Are Fundamental Rights?',
        content:
          'Fundamental Rights are guaranteed by Part III (Articles 12-35) of the Constitution of India. They are enforceable by courts and are essential for the development of individuals.',
        type: 'info',
      },
      {
        title: 'The Six Fundamental Rights',
        content:
          '1. Right to Equality (Articles 14-18), 2. Right to Freedom (Articles 19-22), 3. Right against Exploitation (Articles 23-24), 4. Right to Freedom of Religion (Articles 25-28), 5. Cultural and Educational Rights (Articles 29-30), 6. Right to Constitutional Remedies (Article 32).',
        type: 'info',
      },
      {
        title: 'Right to Constitutional Remedies',
        content:
          'Article 32 allows you to approach the Supreme Court directly if your fundamental rights are violated. Dr. B.R. Ambedkar called it the "heart and soul" of the Constitution.',
        type: 'tip',
      },
    ],
    dos: [
      'Know your six fundamental rights',
      'Exercise your right to vote and participate',
      'Speak up when rights are violated',
      'Use legal remedies when needed',
    ],
    donts: [
      'Do not waive your rights unknowingly',
      'Do not take the law into your own hands',
      'Do not infringe on others\' rights',
      'Do not ignore violations of your rights',
    ],
  },
};

// AI assistant mock responses
export const AI_RESPONSES: Record<string, string> = {
  otp_fraud:
    'OTP fraud is one of the most common cybercrimes in India. Here\'s what you should know:\n\n1. Never share your OTP with anyone — banks never ask for it.\n2. If someone asks for your OTP, it is almost certainly a scam.\n3. If you\'ve already shared it, contact your bank immediately using the official number.\n4. File a complaint at cybercrime.gov.in or call 1930.\n\nRemember: The RBI has explicitly stated that banks never ask for OTPs.',
  consumer_rights:
    'As a consumer in India, you are protected by the Consumer Protection Act, 2019. Here are your key rights:\n\n1. Right to safety — protection from hazardous products.\n2. Right to be informed — full information about products.\n3. Right to choose — freedom to select products.\n4. Right to seek redressal — compensation for defective products.\n\nTo file a complaint: Call 1915 or visit consumerhelpline.gov.in.',
  fundamental_rights:
    'The Constitution of India guarantees six fundamental rights:\n\n1. Right to Equality (Articles 14-18)\n2. Right to Freedom (Articles 19-22)\n3. Right against Exploitation (Articles 23-24)\n4. Right to Freedom of Religion (Articles 25-28)\n5. Cultural and Educational Rights (Articles 29-30)\n6. Right to Constitutional Remedies (Article 32)\n\nThese are enforceable by courts and are essential for individual dignity and development.',
  women_safety:
    'India has several laws protecting women:\n\n1. POSH Act, 2013 — Against workplace sexual harassment. File complaints with the Internal Complaints Committee.\n2. Domestic Violence Act, 2005 — Against physical, emotional, or economic abuse.\n3. Dowry Prohibition Act, 1961 — Against giving/receiving dowry.\n\nHelplines: 181 (Women\'s Helpline), 1091 (Women\'s Police Helpline), 112 (Emergency).',
  default:
    'I\'m LawLink Assistant, here to help you understand general legal concepts and navigate legal literacy topics.\n\nI can help you with:\n• Understanding cyber safety and online fraud prevention\n• Consumer rights and how to file complaints\n• Fundamental rights guaranteed by the Constitution\n• Women\'s safety laws and helplines\n• Road and traffic laws\n• Finding trusted legal resources\n\nWhat topic would you like to explore? You can ask about specific scenarios, legal concepts, or request guidance on next steps.',
};

export function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('otp') || q.includes('fraud') || q.includes('scam') || q.includes('phishing')) return AI_RESPONSES.otp_fraud;
  if (q.includes('consumer') || q.includes('refund') || q.includes('product') || q.includes('warranty')) return AI_RESPONSES.consumer_rights;
  if (q.includes('fundamental') || q.includes('constitution') || q.includes('rights') || q.includes('article')) return AI_RESPONSES.fundamental_rights;
  if (q.includes('women') || q.includes('harassment') || q.includes('domestic') || q.includes('posh')) return AI_RESPONSES.women_safety;
  return AI_RESPONSES.default;
}

export const LANGUAGES = [
  { code: 'en', label: 'English', status: 'available' },
  { code: 'hi', label: 'हिंदी (Hindi)', status: 'coming_soon' },
  { code: 'te', label: 'తెలుగు (Telugu)', status: 'coming_soon' },
];
