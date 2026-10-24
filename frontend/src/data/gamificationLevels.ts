export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
  explanation: string
}

export interface LevelQuiz {
  skillName: string
  scenario: string
  question: string
  options: QuizOption[]
  gapFeedback: {
    headline: string
    explanation: string
    missingSkill: string
    roadmapUrl: string
    roadmapButtonText: string
  }
}

export interface LevelItem {
  id: number
  title: string
  subtitle: string
  badge: string
  themeColor: string
  gradient: string
  borderGlow: string
  iconName: 'Sparkles' | 'Target' | 'Zap' | 'BookOpen' | 'ShieldCheck' | 'Trophy' | 'Briefcase' | 'GraduationCap' | 'Award' | 'Activity' | 'Flame' | 'Clock'
  xp: number
  time: string
  whatToDo: string[]
  deliverable: string
  riskCut: string
  hasQuiz: boolean
  quiz?: LevelQuiz
  actionLink?: {
    label: string
    to: string
  }
}

export interface PersonaLevelConfig {
  trackName: string
  trackDescription: string
  targetElevation: string
  salaryTarget: string
  levels: LevelItem[]
}

export const GAMIFICATION_TRACKS: Record<string, PersonaLevelConfig> = {
  // ── 1. STAGNANT (PROMOTION TRACK) ─────────────────────────────────
  stagnant_promotion: {
    trackName: 'Internal Promotion & Appraisal Jump',
    trackDescription: 'Climb from stagnant maintenance/support to Senior Lead with a 40%+ appraisal jump.',
    targetElevation: 'Technical Lead / Senior Band',
    salaryTarget: '₹16 - ₹22 LPA',
    levels: [
      {
        id: 1,
        title: 'Promotion Readiness & Architectural Core Check',
        subtitle: 'Verify foundational distributed system decisions & technical leadership',
        badge: 'LEVEL 1 • PROMOTION QUIZ',
        themeColor: 'from-pink-500 to-rose-600',
        gradient: 'bg-gradient-to-tr from-pink-500 to-rose-600',
        borderGlow: 'border-pink-500/80 shadow-pink-500/40',
        iconName: 'Sparkles',
        xp: 150,
        time: '3 Mins',
        whatToDo: [
          'Take the Level 1 Promotion Readiness Quiz assessing distributed system resilience and technical ownership.',
          'Answer correctly to verify that you think like a Senior Engineer / Lead rather than an individual task executor.',
          'If your answer exposes an architectural gap, inspect your personalized roadmap on the My Skills page to bridge it.',
        ],
        deliverable: '100% Score on High-Concurrency Architecture Scenario',
        riskCut: '-8% Stagnation Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'System Architecture & Resiliency Design',
          scenario:
            'Your production microservice experiences unpredictable 10x traffic spikes during flash sales, causing database CPU to hit 98% and cascading downstream API timeouts.',
          question:
            'As an aspiring Senior Lead aiming for promotion, which architectural pattern should you propose to the committee as the primary resiliency fix?',
          options: [
            {
              id: 'a',
              text: 'Vertically scale up the database RAM/CPU on AWS RDS indefinitely whenever traffic spikes.',
              isCorrect: false,
              explanation: 'Vertical scaling is expensive, has strict hardware ceilings, and doesn’t solve cascading downstream timeouts.',
            },
            {
              id: 'b',
              text: 'Implement asynchronous message queuing (Kafka/SQS) with consumer rate-limiting and a distributed Redis write-behind cache.',
              isCorrect: true,
              explanation: 'Correct! Decoupling ingestion from database persistence with backpressure buffers spikes and guarantees zero downtime.',
            },
            {
              id: 'c',
              text: 'Instruct the frontend team to throttle user requests by showing error modals to 50% of incoming users.',
              isCorrect: false,
              explanation: 'Degrading user experience without backend architectural decoupling harms business conversion and reflects poor engineering.',
            },
            {
              id: 'd',
              text: 'Increase HTTP request timeouts to 60 seconds so connections wait patiently for the database.',
              isCorrect: false,
              explanation: 'Increasing timeouts leads to connection pool exhaustion and thread starvation, triggering total system outage.',
            },
          ],
          gapFeedback: {
            headline: 'Architectural Skill Gap Detected for Senior Promotion',
            explanation:
              'Promotion committees and VP panels evaluate engineers on their ability to decouple distributed systems and prevent cascading outages. Your response indicates you need hands-on practice in Event-Driven Architecture, Caching, and Kafka.',
            missingSkill: 'System Architecture & Event-Driven Resiliency',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Open My Skills Roadmap to Bridge Deficit',
          },
        },
      },
      {
        id: 2,
        title: 'High-Visibility Team Impact PoC',
        subtitle: 'Deliver a quantifiable cost-reduction or GenAI automation PoC in your current project',
        badge: 'LEVEL 2 • BUSINESS IMPACT',
        themeColor: 'from-amber-500 to-orange-600',
        gradient: 'bg-gradient-to-tr from-amber-500 to-orange-600',
        borderGlow: 'border-amber-500/80 shadow-amber-500/40',
        iconName: 'Zap',
        xp: 200,
        time: '2 Weeks',
        whatToDo: [
          'Identify a repetitive manual bottleneck or legacy support workflow in your current team.',
          'Build and deploy a small GenAI workflow or automated CI/CD script saving at least 15 hours/week.',
          'Document measurable before/after metrics (e.g., ticket resolution time slashed by 40%).',
        ],
        deliverable: 'Executive 1-Pager Impact Brief with quantifiable savings metrics',
        riskCut: '-12% Career Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'Production PoC & LLM Caching Strategy',
          scenario:
            'Your engineering head requests an internal GenAI assistant PoC for 450 customer support reps. Raw LLM API calls cost $4,800/month with 1.8s average latency.',
          question:
            'Which architecture achieves sub-100ms response times and slashes monthly API billing by over 65%?',
          options: [
            {
              id: 'a',
              text: 'Implement Semantic Vector Caching with Redis & pgvector before querying the external LLM provider.',
              isCorrect: true,
              explanation:
                'Correct! Semantic caching intercepts repeated and semantically similar queries locally, delivering sub-50ms responses and 70% cost reduction.',
            },
            {
              id: 'b',
              text: 'Downgrade all queries to a free open-source model running on a shared single-core developer laptop.',
              isCorrect: false,
              explanation:
                'Local single-core execution lacks GPU acceleration and will crash under 450 concurrent users.',
            },
            {
              id: 'c',
              text: 'Store user questions in MySQL and instruct reps to only ask queries that match exact keyword strings.',
              isCorrect: false,
              explanation:
                'Exact string matching fails for conversational English/Hinglish queries and destroys user experience.',
            },
            {
              id: 'd',
              text: 'Instruct the support team to limit their queries to 2 requests per employee per day.',
              isCorrect: false,
              explanation:
                'Artificial rationing defeats the business value of GenAI automation and fails promotion expectations.',
            },
          ],
          gapFeedback: {
            headline: 'PoC Architecture & LLM Caching Gap Detected',
            explanation:
              'Senior Lead promotions require demonstrating quantifiable business efficiency and production caching. Check the My Skills roadmap to master Vector Embeddings & Redis Semantic Caching.',
            missingSkill: 'Semantic Caching & Vector Database Design',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Explore Vector & Caching Skills',
          },
        },
        actionLink: {
          label: 'View Curated PoC Roadmaps',
          to: '/path',
        },
      },
      {
        id: 3,
        title: 'Manager 1:1 Appraisal Dossier',
        subtitle: 'Rehearse your promotion defense and dismantle "budget freeze" counter-arguments',
        badge: 'LEVEL 3 • NEGOTIATION',
        themeColor: 'from-blue-600 to-indigo-700',
        gradient: 'bg-gradient-to-tr from-blue-600 to-indigo-700',
        borderGlow: 'border-blue-500/80 shadow-blue-500/40',
        iconName: 'Target',
        xp: 250,
        time: '1 Week',
        whatToDo: [
          'Open the interactive Manager 1:1 Simulator in your dashboard.',
          'Practice negotiating your appraisal jump with real-world Indian IT appraisal objections.',
          'Present your high-visibility PoC data as non-refutable business leverage.',
        ],
        deliverable: 'Completed Manager 1:1 Negotiation Simulation with 80%+ Confidence Score',
        riskCut: '-15% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Launch Manager 1:1 Simulator',
          to: '/features/manager-1on1',
        },
      },
      {
        id: 4,
        title: 'Notice Trap Breaker & Retention Leverage',
        subtitle: 'Calculate buyout payback and establish market parity leverage to enforce band jump',
        badge: 'LEVEL 4 • RETENTION POWER',
        themeColor: 'from-purple-600 to-fuchsia-700',
        gradient: 'bg-gradient-to-tr from-purple-600 to-fuchsia-700',
        borderGlow: 'border-purple-500/80 shadow-purple-500/40',
        iconName: 'Clock',
        xp: 300,
        time: '3 Days',
        whatToDo: [
          'Run the Notice Period Buyout Simulator to benchmark your external market parity.',
          'Demonstrate that external market replacement cost for your skills is 50% higher than your promotion delta.',
          'Lock in department head written agreement before the annual appraisal window closes.',
        ],
        deliverable: 'Signed Appraisal / Band Elevation Letter with HR',
        riskCut: '-20% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Run Notice Buyout Simulator',
          to: '/features/notice-buyout',
        },
      },
      {
        id: 5,
        title: 'Senior Band Elevation & ₹18+ LPA Promotion 🏆',
        subtitle: 'Formal committee sign-off, title elevation to Lead/Senior, +45% salary hike',
        badge: 'BOSS LEVEL 🏆 • PROMOTION UNLOCKED',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600',
        borderGlow: 'border-emerald-400 shadow-emerald-400/50',
        iconName: 'Trophy',
        xp: 500,
        time: 'Unlocked',
        whatToDo: [
          'Receive formal HR revision letter confirming Senior / Lead designation.',
          'Mint your digitally verified Skill Passport showcasing verified architecture and PoC credentials.',
          'Take on official mentorship of 2 junior engineers to cement your leadership footing.',
        ],
        deliverable: 'Verified Skill Passport & Revised Band Compensation',
        riskCut: '-35% Risk Neutralized',
        hasQuiz: true,
        quiz: {
          skillName: 'Senior Engineering Leadership & Business Impact',
          scenario:
            'In your final executive promotion evaluation, the VP asks: "Technical skills aside, what concrete ownership have you demonstrated that justifies bumping you into the Senior Lead band?"',
          question:
            'Which metric-grounded pitch demonstrates undeniable readiness for Senior Lead elevation?',
          options: [
            {
              id: 'a',
              text: 'I led the semantic caching PoC saving ₹34L/yr in cloud spend, mentored 3 juniors, and resolved all 12 critical P1 production defects ahead of SLA.',
              isCorrect: true,
              explanation:
                'Outstanding! Quantifiable financial impact, team mentorship, and mission-critical production ownership define a true Senior Lead.',
            },
            {
              id: 'b',
              text: 'I have spent 4 years in this exact role and company policy states everyone gets promoted after 3 years.',
              isCorrect: false,
              explanation:
                'Tenure-based demands backfire with modern leadership panels who seek merit and output rather than clock-in time.',
            },
            {
              id: 'c',
              text: 'I always clear my assigned Jira tickets before 6 PM and never complain about night deployments.',
              isCorrect: false,
              explanation:
                'Executing assigned tasks reflects junior/mid individual contributor behavior, not Senior technical leadership.',
            },
            {
              id: 'd',
              text: 'A recruiter on LinkedIn told me that other companies pay ₹20 LPA for my stack.',
              isCorrect: false,
              explanation:
                'External recruiter claims without demonstrated internal business value damage credibility in appraisal panels.',
            },
          ],
          gapFeedback: {
            headline: 'Engineering Leadership & Business Metric Synthesis Gap',
            explanation:
              'Senior Lead panels evaluate your ability to link technical contributions directly to cost, reliability, and team velocity. Review My Skills to learn Engineering Metrics & Leadership framing.',
            missingSkill: 'Technical Leadership & ROI Justification',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Review Leadership & Architecture Skills',
          },
        },
        actionLink: {
          label: 'Mint Verified Skill Passport',
          to: '/passport',
        },
      },
    ],
  },

  // ── 2. STAGNANT (SWITCH TRACK) ─────────────────────────────────────
  stagnant_switch: {
    trackName: 'Job Switch & 45%+ Market Jump',
    trackDescription: 'Escape legacy maintenance company traps into modern high-paying tech firms and GCCs.',
    targetElevation: 'Senior Software / Cloud Engineer',
    salaryTarget: '₹18 - ₹25 LPA',
    levels: [
      {
        id: 1,
        title: 'Modern Stack Verification Check',
        subtitle: 'Benchmark your proficiency in GenAI RAG, Vector Search & Cloud Microservices',
        badge: 'LEVEL 1 • MARKET TECH QUIZ',
        themeColor: 'from-sky-500 to-blue-700',
        gradient: 'bg-gradient-to-tr from-sky-500 to-blue-700',
        borderGlow: 'border-sky-500/80 shadow-sky-500/40',
        iconName: 'Sparkles',
        xp: 150,
        time: '3 Mins',
        whatToDo: [
          'Take the Level 1 Market Stack Quiz evaluating modern GenAI integration and API microservices.',
          'Demonstrate that your coding skills extend beyond legacy internal tooling.',
          'If you face gaps, follow the direct link to the My Skills page to explore curated roadmaps.',
        ],
        deliverable: '100% Score on Modern Vector Search / RAG Scenario',
        riskCut: '-8% Market Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'GenAI RAG & Modern Cloud Architecture',
          scenario:
            'An external high-growth product company is interviewing you for a Senior Engineer role. They want an enterprise chatbot to accurately query 50,000 PDF technical manuals with zero hallucinations and sub-second latency.',
          question:
            'Which architecture demonstrates modern production-grade design for this switch role?',
          options: [
            {
              id: 'a',
              text: 'Fine-tune an open-source 70B LLM on the raw text of all 50,000 PDFs every night on a single GPU server.',
              isCorrect: false,
              explanation: 'Fine-tuning is extremely slow, prone to hallucination, and cannot cite dynamic document versions.',
            },
            {
              id: 'b',
              text: 'Implement a Hybrid RAG pipeline with chunking, Vector Embeddings (HNSW index), BM25 keyword re-ranking, and contextual compression.',
              isCorrect: true,
              explanation: 'Correct! Hybrid Retrieval-Augmented Generation (RAG) with vector similarity + lexical re-ranking delivers accurate, fast, source-grounded answers.',
            },
            {
              id: 'c',
              text: 'Feed all 50,000 PDFs into a single prompt context window using a 2M token model for every user query.',
              isCorrect: false,
              explanation: 'Passing massive documents per query is prohibitively expensive, creates 15+ second latency, and causes information loss.',
            },
            {
              id: 'd',
              text: 'Store the text in a regular MySQL table with LIKE queries and string matching.',
              isCorrect: false,
              explanation: 'Standard SQL LIKE queries lack semantic understanding, synonyms, and embeddings required for AI workflows.',
            },
          ],
          gapFeedback: {
            headline: 'Modern Tech Skill Deficit Detected for Market Switch',
            explanation:
              'Top tier product firms and GCCs paying 18+ LPA test practical GenAI, Vector Databases (Pinecone/Milvus/pgvector), and RAG pipelines. Your profile needs these modern credentials.',
            missingSkill: 'GenAI RAG & Vector Embeddings',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Open My Skills Roadmap to Bridge Deficit',
          },
        },
      },
      {
        id: 2,
        title: '90-Day Notice Period Buyout Playbook',
        subtitle: 'Target buyout-friendly hiring companies to bypass 3-month joining delays',
        badge: 'LEVEL 2 • BUYOUT READINESS',
        themeColor: 'from-amber-500 to-orange-600',
        gradient: 'bg-gradient-to-tr from-amber-500 to-orange-600',
        borderGlow: 'border-amber-500/80 shadow-amber-500/40',
        iconName: 'Clock',
        xp: 200,
        time: '1 Week',
        whatToDo: [
          'Calculate your exact notice buyout amount in the simulator (+₹8.4L net profit potential).',
          'Filter the Jobs directory for companies with active 30-day notice buyout policies.',
          'Prepare your official handover checklist to legally shorten your serving window.',
        ],
        deliverable: 'Buyout ROI Calculation & Verified Buyout Employer Shortlist',
        riskCut: '-12% Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'Enterprise Notice Buyout & Negotiation Strategy',
          scenario:
            'You receive an offer from a top product firm with a 45-day joining deadline, but your current Indian IT services firm has a strict 90-day notice policy.',
          question:
            'How should you legally negotiate your notice period to avoid losing the offer?',
          options: [
            {
              id: 'a',
              text: 'Negotiate a joining bonus buyout with the new company and request adjustment of accumulated paid leaves (PLs) with current HR.',
              isCorrect: true,
              explanation:
                'Correct! Most hiring companies happily sponsor notice buyout joining bonuses, and paid-leave adjustment legally reduces serving days.',
            },
            {
              id: 'b',
              text: 'Immediately stop reporting to work tomorrow without formal resignation or handover.',
              isCorrect: false,
              explanation:
                'Absconding leads to blacklisting, withholding of Provident Fund (EPFO), and refusal of formal relieving letters.',
            },
            {
              id: 'c',
              text: 'Lie to the new company that you only have 30 days notice and hope they do not verify background checks.',
              isCorrect: false,
              explanation:
                'Background verification (BGV) will catch discrepancies immediately and result in immediate offer revocation.',
            },
            {
              id: 'd',
              text: 'Decline the new offer immediately and stay in your current role indefinitely.',
              isCorrect: false,
              explanation:
                'Declining without negotiating cements career stagnation and denies you a 45%+ salary jump.',
            },
          ],
          gapFeedback: {
            headline: 'Notice Period Negotiation Strategy Gap',
            explanation:
              'Indian tech talent loses 40% of switch offers to 90-day notice traps. Use the Notice Buyout Simulator on your dashboard to calculate exact buyout numbers.',
            missingSkill: 'Notice Period Legal Rights & Buyout Leverage',
            roadmapUrl: '/features/notice-buyout',
            roadmapButtonText: 'Open Notice Buyout Simulator',
          },
        },
        actionLink: {
          label: 'Run Notice Buyout Simulator',
          to: '/features/notice-buyout',
        },
      },
      {
        id: 3,
        title: 'Modern High-Yield Resume & GitHub Proofs',
        subtitle: 'Translate legacy maintenance into measurable modernization bullet points',
        badge: 'LEVEL 3 • RESUME AUDIT',
        themeColor: 'from-purple-600 to-indigo-700',
        gradient: 'bg-gradient-to-tr from-purple-600 to-indigo-700',
        borderGlow: 'border-purple-500/80 shadow-purple-500/40',
        iconName: 'BookOpen',
        xp: 250,
        time: '3 Days',
        whatToDo: [
          'Reformat your resume using the ATS Tailor with high-demand modern keywords.',
          'Deploy 1 live project demo on Vercel/AWS showing real API integration.',
          'Audit your skills gap on the My Skills page against your target role.',
        ],
        deliverable: 'ATS 90+ Score Resume with Deployed GitHub Project Proof',
        riskCut: '-18% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Audit Skills on My Skills',
          to: '/skills',
        },
      },
      {
        id: 4,
        title: 'High-Yield Interview Sprints',
        subtitle: 'Secure 3+ concurrent interview loops at top GCCs and product companies',
        badge: 'LEVEL 4 • INTERVIEWS',
        themeColor: 'from-rose-500 to-red-600',
        gradient: 'bg-gradient-to-tr from-rose-500 to-red-600',
        borderGlow: 'border-rose-500/80 shadow-rose-500/40',
        iconName: 'Target',
        xp: 300,
        time: '2 Weeks',
        whatToDo: [
          'Apply to verified high-growth roles in the Jobs & Salary section.',
          'Practice 2-round system design and coding mock interviews.',
          'Secure at least 2 competitive offers to build counter-bidding leverage.',
        ],
        deliverable: 'Multiple First-Round Technical Clearances',
        riskCut: '-25% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Explore Switch Openings in Jobs',
          to: '/jobs',
        },
      },
      {
        id: 5,
        title: 'Offer Acceptance & 45%+ Market Jump 🏆',
        subtitle: 'Sign high-paying offer with notice buyout sponsorship and transition',
        badge: 'BOSS LEVEL 🏆 • SWITCH COMPLETED',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600',
        borderGlow: 'border-emerald-400 shadow-emerald-400/50',
        iconName: 'Trophy',
        xp: 500,
        time: 'Unlocked',
        whatToDo: [
          'Verify your net take-home using the Real Salary Calculator (rent & living adjusted).',
          'Sign formal offer letter with signing bonus and notice period reimbursement clause.',
          'Transition seamlessly into your new senior tech position.',
        ],
        deliverable: 'Signed High-Growth Offer Letter (+45% CTC)',
        riskCut: '-40% Risk Cleared',
        hasQuiz: true,
        quiz: {
          skillName: 'Multi-Offer Leverage & Compensation Maximization',
          scenario:
            'You hold an offer for ₹17 LPA from Company A and are in the final HR round with Company B for ₹22 LPA. Company A HR insists you accept within 24 hours.',
          question:
            'What is the most effective tactical response to maximize compensation without losing either offer?',
          options: [
            {
              id: 'a',
              text: 'Request a 3-day extension from Company A citing family consultation, while notifying Company B HR of the active competing offer to expedite their formal letter.',
              isCorrect: true,
              explanation:
                'Spot on! Genuine competing deadlines accelerate HR approval pipelines and create bidding leverage without burning bridges.',
            },
            {
              id: 'b',
              text: 'Accept Company A immediately, sign their bond, and ghost Company B completely.',
              isCorrect: false,
              explanation:
                'Accepting prematurely throws away ₹5 LPA in compensation and long-term career growth.',
            },
            {
              id: 'c',
              text: 'Insult Company A HR and accuse them of pressuring you maliciously.',
              isCorrect: false,
              explanation:
                'Emotional hostility damages professional reputation and leads to instant offer cancellation.',
            },
            {
              id: 'd',
              text: 'Post both unredacted offer letters on public social media to ask strangers for votes.',
              isCorrect: false,
              explanation:
                'Violates confidentiality agreements (NDA) and can lead to legal rescinding of both offers.',
            },
          ],
          gapFeedback: {
            headline: 'Offer Leverage & Compensation Tactics Gap',
            explanation:
              'Senior tech switches require confident negotiation and market parity knowledge. Explore the Real Salary Calculator on Jobs to plan in-hand numbers.',
            missingSkill: 'Salary Negotiation & Offer Leverage Strategy',
            roadmapUrl: '/jobs',
            roadmapButtonText: 'Explore Real Salary & Jobs Tools',
          },
        },
        actionLink: {
          label: 'Calculate In-Hand Real Salary',
          to: '/jobs',
        },
      },
    ],
  },

  // ── 3. RETURNER PERSONA ───────────────────────────────────────────
  returner: {
    trackName: 'Career-Break Re-Entry & Parity Track',
    trackDescription: 'Reclaim full seniority with zero break penalty through verified GenAI delta upskilling.',
    targetElevation: 'GenAI / Full-Stack Engineer',
    salaryTarget: '₹14 - ₹18 LPA',
    levels: [
      {
        id: 1,
        title: 'Durable Foundation Verification',
        subtitle: 'Validate core backend architecture & problem-solving syntax after career pause',
        badge: 'LEVEL 1 • CONFIDENCE CHECK',
        themeColor: 'from-teal-500 to-emerald-600',
        gradient: 'bg-gradient-to-tr from-teal-500 to-emerald-600',
        borderGlow: 'border-teal-500/80 shadow-teal-500/40',
        iconName: 'Sparkles',
        xp: 150,
        time: '3 Mins',
        whatToDo: [
          'Take the Level 1 Returner Confidence Quiz validating foundational backend logic.',
          'Reassure your muscle memory that core programming syntax is permanent.',
          'If you need a refresher on modern delta skills, visit the My Skills roadmap page.',
        ],
        deliverable: '100% Score on Core Backend & API Design Scenario',
        riskCut: '-10% Gap Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'Modern Backend APIs & RESTful Standards',
          scenario:
            'You are returning to engineering after a break. A hiring manager asks how you would design an idempotent payment processing endpoint to prevent duplicate credit card deductions during network retries.',
          question:
            'What is the industry-standard architectural mechanism to ensure idempotency?',
          options: [
            {
              id: 'a',
              text: 'Block the user’s IP address for 5 minutes after the first click.',
              isCorrect: false,
              explanation: 'IP blocking breaks shared NAT/corporate networks and does not prevent API replay attacks.',
            },
            {
              id: 'b',
              text: 'Require a unique client-generated Idempotency-Key in the HTTP header, cached in Redis with transaction state.',
              isCorrect: true,
              explanation: 'Correct! An Idempotency-Key guarantees that duplicate network retries return the original cached response without re-executing payment.',
            },
            {
              id: 'c',
              text: 'Disable the submit button with JavaScript on the frontend page.',
              isCorrect: false,
              explanation: 'Frontend disabling is easily bypassed by direct API calls, network retries, or page refreshes.',
            },
            {
              id: 'd',
              text: 'Allow duplicate charges and handle refunds manually through customer support.',
              isCorrect: false,
              explanation: 'Manual refunds cause catastrophic operational overhead and severe trust erosion.',
            },
          ],
          gapFeedback: {
            headline: 'Returner Delta Skills Gap Detected',
            explanation:
              'Your foundational backend knowledge is solid, but modern cloud engineering demands familiarity with modern idempotency, tokenization, and distributed caching.',
            missingSkill: 'Modern Cloud Backend & API Standards',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Explore My Skills Gap Analysis',
          },
        },
      },
      {
        id: 2,
        title: '5-Minute Code Muscle Memory Gym',
        subtitle: 'Practice daily Python/TypeScript syntax drills to reactivate coding agility',
        badge: 'LEVEL 2 • CODE GYM',
        themeColor: 'from-orange-500 to-amber-600',
        gradient: 'bg-gradient-to-tr from-orange-500 to-amber-600',
        borderGlow: 'border-orange-500/80 shadow-orange-500/40',
        iconName: 'Flame',
        xp: 200,
        time: '5 Mins/day',
        whatToDo: [
          'Complete 5 consecutive daily syntax warm-ups in the Code Muscle Gym.',
          'Rebuild confidence in rapid keyboard typing, error debugging, and modern idioms.',
          'Earn your 5-Day Continuous Practice Streak badge.',
        ],
        deliverable: '5-Day Muscle Memory Streak Log',
        riskCut: '-15% Gap Penalty',
        hasQuiz: true,
        quiz: {
          skillName: 'Modern Asynchronous Syntax & Error Handling',
          scenario:
            'You are refactoring an async service after a hiatus. An unhandled Promise rejection is crashing the Node.js/Python microservice during peak traffic.',
          question:
            'What is the modern standard design to handle async background workers safely without crashing the main process?',
          options: [
            {
              id: 'a',
              text: 'Wrap async tasks in Promise.allSettled() or structured try/except blocks with centralized error logging to Sentry/CloudWatch.',
              isCorrect: true,
              explanation:
                'Spot on! Promise.allSettled() ensures all operations complete regardless of individual rejections, avoiding unhandled crashes.',
            },
            {
              id: 'b',
              text: 'Remove async/await completely and rewrite everything as synchronous blocking code.',
              isCorrect: false,
              explanation:
                'Synchronous blocking freezes the event loop and destroys throughput under concurrent user load.',
            },
            {
              id: 'c',
              text: 'Ignore the errors and restart the entire server on every exception using a shell loop.',
              isCorrect: false,
              explanation:
                'Crash-looping drops in-flight connections and violates production uptime SLAs.',
            },
            {
              id: 'd',
              text: 'Add empty catch blocks that swallow all exceptions silently.',
              isCorrect: false,
              explanation:
                'Swallowing errors hides data corruption and makes system state debugging impossible.',
            },
          ],
          gapFeedback: {
            headline: 'Modern Asynchronous Architecture Gap',
            explanation:
              'Returning to tech requires mastery of modern asynchronous patterns, circuit breakers, and observability. Refine your coding agility on My Skills.',
            missingSkill: 'Async Control Flow & Error Observability',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Review Modern Backend Skills',
          },
        },
        actionLink: {
          label: 'Open 5-Min Code Gym',
          to: '/features/muscle-memory',
        },
      },
      {
        id: 3,
        title: 'Skill-First Gap Rebuilder Resume',
        subtitle: 'Eliminate career-gap bias with an achievement-driven portfolio format',
        badge: 'LEVEL 3 • RESUME REBUILD',
        themeColor: 'from-blue-600 to-cyan-600',
        gradient: 'bg-gradient-to-tr from-blue-600 to-cyan-600',
        borderGlow: 'border-blue-500/80 shadow-blue-500/40',
        iconName: 'BookOpen',
        xp: 250,
        time: '2 Days',
        whatToDo: [
          'Rebuild resume highlighting durable past engineering + modern GenAI delta projects.',
          'Add verifiable GitHub repositories demonstrating modern Python / LangChain skills.',
          'Practice stigma-free answers for career-break interview queries.',
        ],
        deliverable: 'Bias-Free Skill-First Verified Resume',
        riskCut: '-20% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'View Skill Roadmaps',
          to: '/skills',
        },
      },
      {
        id: 4,
        title: 'Corporate Returnship Applications',
        subtitle: 'Apply to verified paid tech returnships from Amazon, Infosys, and Wells Fargo',
        badge: 'LEVEL 4 • RETURNSHIPS',
        themeColor: 'from-purple-600 to-pink-600',
        gradient: 'bg-gradient-to-tr from-purple-600 to-pink-600',
        borderGlow: 'border-purple-500/80 shadow-purple-500/40',
        iconName: 'Briefcase',
        xp: 300,
        time: '1 Week',
        whatToDo: [
          'Filter verified corporate returnship programs with ₹60k–₹1.25L/month stipends.',
          'Submit 3 targeted applications with your customized skill delta portfolio.',
          'Schedule returnship interview loops designed specifically for returning professionals.',
        ],
        deliverable: '3 Submitted Applications to Returner-Friendly Programs',
        riskCut: '-25% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'View Returnships Directory',
          to: '/features/returnships',
        },
      },
      {
        id: 5,
        title: 'Full Parity Corporate Re-Entry 🏆',
        subtitle: 'Accept a permanent offer with zero salary break discount',
        badge: 'BOSS LEVEL 🏆 • CAREER RECLAIMED',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600',
        borderGlow: 'border-emerald-400 shadow-emerald-400/50',
        iconName: 'Trophy',
        xp: 500,
        time: 'Unlocked',
        whatToDo: [
          'Verify offer parity using the Real Salary Calculator against market benchmarks.',
          'Mint your permanent Skill Passport credential with digitally signed milestones.',
          'Begin your new chapter as an empowered, modern software engineer.',
        ],
        deliverable: 'Signed Full-Parity Tech Offer (₹14 - ₹18 LPA)',
        riskCut: '-35% Gap Neutralized',
        hasQuiz: true,
        quiz: {
          skillName: 'Career-Break Narrative & Seniority Defense',
          scenario:
            'During a final managerial round, the interviewer asks: "You took a 2-year sabbatical. Why shouldn\'t we bring you in at a junior level until you prove yourself?"',
          question:
            'Which framing delivers maximum authority and protects your senior salary bracket?',
          options: [
            {
              id: 'a',
              text: 'Frame the sabbatical as a planned pause during which you deliberately upskilled in GenAI and modern cloud stacks, bringing fresh architectural clarity and proven 5+ years of durable systems ownership.',
              isCorrect: true,
              explanation:
                'Spot on! Confident reframing highlights that core architectural wisdom is permanent while modern delta skills are already proven by your live GitHub deliverables.',
            },
            {
              id: 'b',
              text: 'Apologize profusely for taking time off and agree to accept half the junior salary.',
              isCorrect: false,
              explanation:
                'Undervalues your past engineering experience and solidifies unfair career-break wage penalties.',
            },
            {
              id: 'c',
              text: 'Get defensive and tell the manager that asking about break history is illegal.',
              isCorrect: false,
              explanation:
                'Antagonistic responses destroy interview chemistry and forfeit the opportunity to showcase maturity.',
            },
            {
              id: 'd',
              text: 'Claim you were secretly running a stealth unicorn startup to hide the gap.',
              isCorrect: false,
              explanation:
                'Misrepresenting background fails background verification (BGV) and leads to immediate disqualification.',
            },
          ],
          gapFeedback: {
            headline: 'Interview Narrative & Seniority Defense Gap',
            explanation:
              'Senior returners win on composure, structured narrative delivery, and proven projects. Explore the Real Salary Calculator to benchmark your rightful market band.',
            missingSkill: 'Executive Interview Presence & Gap Defense',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Explore Soft Skills & Interview Prep',
          },
        },
        actionLink: {
          label: 'Mint Verified Skill Passport',
          to: '/passport',
        },
      },
    ],
  },

  // ── 4. STUDENT / FRESHER PERSONA ──────────────────────────────────
  student: {
    trackName: 'Campus-to-Corporate Placement Track',
    trackDescription: 'Bridge college theoretical syllabus into practical production skills before placement drives.',
    targetElevation: 'Associate Software / Cloud Engineer',
    salaryTarget: '₹8 - ₹12 LPA',
    levels: [
      {
        id: 1,
        title: 'Practical Industry Readiness Check',
        subtitle: 'Verify hands-on Git, REST APIs, and containerized Docker basics',
        badge: 'LEVEL 1 • PRACTICAL CHECK',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
        borderGlow: 'border-emerald-500/80 shadow-emerald-500/40',
        iconName: 'GraduationCap',
        xp: 150,
        time: '3 Mins',
        whatToDo: [
          'Take the Level 1 Practical Readiness Quiz testing hands-on Git & Docker production concepts.',
          'Demonstrate that you possess real coding skills beyond textbook rote theory.',
          'If you face deficits, use the direct link to the My Skills page to access SWAYAM / NPTEL modules.',
        ],
        deliverable: '100% Score on Practical Git & Containerization Scenario',
        riskCut: '-10% Fresher Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'Production Git & Docker Containers',
          scenario:
            'You are building a web application for campus placements. You commit a production database password into a public GitHub repository by mistake.',
          question:
            'What is the correct engineering procedure to remediate this credential leak?',
          options: [
            {
              id: 'a',
              text: 'Make a new commit deleting the password file and push it to main.',
              isCorrect: false,
              explanation: 'A new commit leaves the secret permanently visible in git commit history and diffs.',
            },
            {
              id: 'b',
              text: 'Immediately invalidate and rotate the database secret, remove the commit from git history via git filter-repo or BFG, and configure environment variables (.env).',
              isCorrect: true,
              explanation: 'Correct! Secret rotation is mandatory because bots scrape GitHub within seconds. Environment variables keep secrets out of source control.',
            },
            {
              id: 'c',
              text: 'Delete the entire GitHub repository and pretend nothing happened.',
              isCorrect: false,
              explanation: 'Deleting the repo does not revoke the compromised secret that automated scrapers may have already logged.',
            },
            {
              id: 'd',
              text: 'Add the file to .gitignore and push to main.',
              isCorrect: false,
              explanation: 'Adding an already-tracked file to .gitignore does not remove it from history.',
            },
          ],
          gapFeedback: {
            headline: 'Practical Industry Tooling Gap Detected',
            explanation:
              'College exams rarely test secret hygiene, Docker containers, and CI/CD pipelines, but top product recruiters look for these exact skills on Day 1.',
            missingSkill: 'Practical Git, Docker & Secret Security',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Open My Skills Roadmap for Freshers',
          },
        },
      },
      {
        id: 2,
        title: 'Production Capstone PoC Deployment',
        subtitle: 'Build and deploy a full-stack project with live URLs and CI/CD pipelines',
        badge: 'LEVEL 2 • LIVE PROJECT',
        themeColor: 'from-blue-600 to-indigo-600',
        gradient: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
        borderGlow: 'border-blue-500/80 shadow-blue-500/40',
        iconName: 'Zap',
        xp: 200,
        time: '2 Weeks',
        whatToDo: [
          'Build a functional application solving an actual user problem.',
          'Deploy on Vercel / Render / AWS with automated GitHub Actions.',
          'Include a clear README with architecture diagrams and API docs.',
        ],
        deliverable: 'Live Deployed Web Application URL + GitHub Repo',
        riskCut: '-15% Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'CI/CD Automated Deployment & Database Pooling',
          scenario:
            'You deploy your full-stack capstone on Vercel/Render connected to PostgreSQL. During your live recruiter demo, page loads crash with "FATAL: too many connections for role" error.',
          question:
            'How should an industry-ready fresher design database connectivity in a cloud/serverless architecture?',
          options: [
            {
              id: 'a',
              text: 'Configure connection pooling via PgBouncer / Supabase pooling mode so stateless serverless functions share managed connections rather than spawning raw TCP sockets.',
              isCorrect: true,
              explanation:
                'Spot on! Serverless lambdas scale rapidly and exhaust raw database connections without an intermediary connection pooler like PgBouncer.',
            },
            {
              id: 'b',
              text: 'Hardcode database max_connections = 999999 in postgresql.conf on your free tier instance.',
              isCorrect: false,
              explanation:
                'Exhausts server RAM immediately and leads to Linux OOM killer termination.',
            },
            {
              id: 'c',
              text: 'Keep a single persistent global variable in the client-side React frontend with raw credentials.',
              isCorrect: false,
              explanation:
                'Exposes database credentials publicly and violates fundamental security isolation.',
            },
            {
              id: 'd',
              text: 'Disable database transactions and write all user data to local browser localStorage instead.',
              isCorrect: false,
              explanation:
                'Data in localStorage is lost across devices and does not persist in multi-user applications.',
            },
          ],
          gapFeedback: {
            headline: 'Cloud Architecture & DB Pooling Gap Detected',
            explanation:
              'College projects often use localhost MySQL without concurrency limits. Top hiring teams look for cloud connection pooling and CI/CD pipelines. Explore the fresher roadmap on My Skills.',
            missingSkill: 'Cloud Connection Pooling & CI/CD Hygiene',
            roadmapUrl: '/skills',
            roadmapButtonText: 'View Fresher Cloud Skills',
          },
        },
        actionLink: {
          label: 'View Campus Roadmap',
          to: '/path',
        },
      },
      {
        id: 3,
        title: 'Senior Alumni Mock Review',
        subtitle: 'Book a 1-on-1 resume review and mock interview with recently placed seniors',
        badge: 'LEVEL 3 • MENTORSHIP',
        themeColor: 'from-purple-600 to-pink-600',
        gradient: 'bg-gradient-to-tr from-purple-600 to-pink-600',
        borderGlow: 'border-purple-500/80 shadow-purple-500/40',
        iconName: 'Award',
        xp: 250,
        time: '1 Week',
        whatToDo: [
          'Connect with verified alumni at Amazon, Razorpay, or TCS Digital.',
          'Simulate a 30-minute technical placement round.',
          'Implement actionable feedback to sharpen your project pitch.',
        ],
        deliverable: 'Mock Interview Evaluation Scorecard (Passed)',
        riskCut: '-20% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Connect with Seniors',
          to: '/features/senior-mentorship',
        },
      },
      {
        id: 4,
        title: 'Campus & Off-Campus Hiring Drives',
        subtitle: 'Target product hiring drives and off-campus high-paying CTC brackets',
        badge: 'LEVEL 4 • DRIVES',
        themeColor: 'from-amber-500 to-orange-600',
        gradient: 'bg-gradient-to-tr from-amber-500 to-orange-600',
        borderGlow: 'border-amber-500/80 shadow-amber-500/40',
        iconName: 'Target',
        xp: 300,
        time: '2 Weeks',
        whatToDo: [
          'Filter fresh graduate hiring opportunities in the Jobs directory.',
          'Submit verified GitHub links and Skill Passport directly to recruiters.',
          'Prepare for multi-round coding evaluations on LeetCode/HackerRank standards.',
        ],
        deliverable: '3 Completed Placement Coding Assessments',
        riskCut: '-25% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Explore Fresher Jobs',
          to: '/jobs',
        },
      },
      {
        id: 5,
        title: 'First Salaried Tech Offer (₹8 - ₹12 LPA) 🏆',
        subtitle: 'Sign high-paying placement offer and graduate with corporate security',
        badge: 'BOSS LEVEL 🏆 • PLACEMENT SECURED',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600',
        borderGlow: 'border-emerald-400 shadow-emerald-400/50',
        iconName: 'Trophy',
        xp: 500,
        time: 'Unlocked',
        whatToDo: [
          'Receive written offer letter confirming tech role and salary bracket.',
          'Mint your verified Skill Passport credential to showcase placement pedigree.',
          'Begin corporate orientation as an industry-ready software engineer.',
        ],
        deliverable: 'Signed Campus Placement Offer Letter',
        riskCut: '-35% Placement Risk Neutralized',
        hasQuiz: true,
        quiz: {
          skillName: 'Campus Offer Evaluation & Career Compounding',
          scenario:
            'You receive two campus offers: Company A is a mass service MNC offering ₹3.6 LPA with a mandatory 2-year service bond. Company B is a product-engineering startup offering ₹9.5 LPA in a modern cloud stack with no bond.',
          question:
            'What is the strategic career-growth decision for a high-potential engineering graduate?',
          options: [
            {
              id: 'a',
              text: 'Choose Company B because modern tech stack ownership, zero service bonds, and higher initial base pay accelerate career compounding and 3-year market value exponentially.',
              isCorrect: true,
              explanation:
                'Spot on! Starting at a higher base in product engineering without restrictive bonds sets a much higher compounding baseline for all future increments.',
            },
            {
              id: 'b',
              text: 'Choose Company A because a 2-year service bond guarantees you will never be allowed to leave even if you are unhappy.',
              isCorrect: false,
              explanation:
                'Service bonds restrict career mobility, enforce financial penalties, and stagnate early compensation.',
            },
            {
              id: 'c',
              text: 'Reject both offers and wait for an off-campus ₹50 LPA remote offer without submitting applications.',
              isCorrect: false,
              explanation:
                'Leaving placement season empty-handed creates unnecessary gap anxiety and employment risk.',
            },
            {
              id: 'd',
              text: 'Accept both offers and sign both company bonds simultaneously.',
              isCorrect: false,
              explanation:
                'Dual bond execution creates severe legal liabilities and blacklisting from campus placement cells.',
            },
          ],
          gapFeedback: {
            headline: 'Offer Evaluation & Career Strategy Gap',
            explanation:
              'Understanding compensation structures, bond clauses, and real in-hand net salary is crucial for graduating engineers. Check the Real Salary Calculator in Jobs.',
            missingSkill: 'Compensation Literacy & Offer Evaluation',
            roadmapUrl: '/jobs',
            roadmapButtonText: 'Calculate Real In-Hand Salary',
          },
        },
        actionLink: {
          label: 'Mint Verified Skill Passport',
          to: '/passport',
        },
      },
    ],
  },

  // ── 5. LAID-OFF PERSONA ───────────────────────────────────────────
  laid_off: {
    trackName: '0-Day Notice Immediate Re-Employment Track',
    trackDescription: 'Capitalize on zero-notice-period urgency to land lateral roles within 45 days with zero pay penalty.',
    targetElevation: 'Automation SDET / Cloud Engineer',
    salaryTarget: '₹14 - ₹20 LPA',
    levels: [
      {
        id: 1,
        title: 'Transferable Strengths & Immediate Fit Audit',
        subtitle: 'Verify rapid adaptability and testing / automation core skills',
        badge: 'LEVEL 1 • SKILL AUDIT',
        themeColor: 'from-blue-600 to-indigo-600',
        gradient: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
        borderGlow: 'border-blue-500/80 shadow-blue-500/40',
        iconName: 'Sparkles',
        xp: 150,
        time: '3 Mins',
        whatToDo: [
          'Take the Level 1 Immediate Fit Quiz assessing testing automation and CI/CD triage.',
          'Validate that your core skills transition seamlessly into active backfill openings.',
          'Visit My Skills if you need to quickly map adjacent strengths.',
        ],
        deliverable: '100% Score on Automation Pipeline Triage Scenario',
        riskCut: '-10% Stigma Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'CI/CD Pipeline Triage & Test Automation',
          scenario:
            'A production deployment pipeline fails at 8:00 PM due to a flaky integration test that intermittently times out against an external third-party SMS gateway.',
          question:
            'What immediate engineering resolution demonstrates high-seniority triage to prospective recruiters?',
          options: [
            {
              id: 'a',
              text: 'Delete the test completely from the repository so the pipeline turns green.',
              isCorrect: false,
              explanation: 'Deleting tests hides defects and causes severe regressions in production.',
            },
            {
              id: 'b',
              text: 'Implement mock wire-mock stubs for third-party dependencies in integration tests, and isolate real gateway calls into scheduled synthetic smoke checks.',
              isCorrect: true,
              explanation: 'Correct! Unit and integration tests should never rely on non-deterministic external networks. Mocking guarantees fast, deterministic CI/CD runs.',
            },
            {
              id: 'c',
              text: 'Rerun the failed pipeline 10 times in a row hoping it passes by chance.',
              isCorrect: false,
              explanation: 'Blindly rerunning flaky pipelines wastes server costs and indicates a lack of debugging ownership.',
            },
            {
              id: 'd',
              text: 'Bypass the test checks and push straight to production manually.',
              isCorrect: false,
              explanation: 'Bypassing quality gates creates production vulnerability and violates compliance standards.',
            },
          ],
          gapFeedback: {
            headline: 'Immediate Joiner Automation Skill Gap',
            explanation:
              'Companies hiring immediate joiners expect fast, decisive CI/CD pipeline ownership and deterministic testing.',
            missingSkill: 'CI/CD Test Automation & Mocking',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Open My Skills Roadmap',
          },
        },
      },
      {
        id: 2,
        title: 'Financial Runway & Emergency Buffer Optimization',
        subtitle: 'Extend your liquid savings runway from 3 to 6+ months to negotiate from strength',
        badge: 'LEVEL 2 • RUNWAY SAFETY',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
        borderGlow: 'border-emerald-500/80 shadow-emerald-500/40',
        iconName: 'ShieldCheck',
        xp: 200,
        time: '1 Day',
        whatToDo: [
          'Open the Financial Runway Calculator to audit monthly burn and severance reserves.',
          'Pause non-essential subscriptions to unlock 1.8 additional months of negotiation runway.',
          'Set your minimum acceptable compensation floor.',
        ],
        deliverable: 'Personalized Runway Strategy with 5+ Months Cushion',
        riskCut: '-15% Financial Stress Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'Emergency Runway & Offer Leverage Management',
          scenario:
            'You were impacted by layoffs and hold 4 months of liquid reserves. A recruiter says: "Since you are currently not employed, our policy caps the offer at 25% below your previous CTC."',
          question:
            'What is the highest-leverage factual counter to reject the lowball offer effectively?',
          options: [
            {
              id: 'a',
              text: 'Highlight that 0-day immediate joining saves the employer 60-90 days of project downtime and costly contractor fees, positioning immediate availability as a premium cost-saving asset while anchoring to market parity.',
              isCorrect: true,
              explanation:
                'Spot on! Immediate availability saves companies ₹2–5L in vacant-seat opportunity costs, which is an enterprise leverage point, not a penalty.',
            },
            {
              id: 'b',
              text: 'Immediately accept the lowball offer in a panic and sign a 3-year bond.',
              isCorrect: false,
              explanation:
                'Accepting lowballs damages your baseline salary trajectory for years to come.',
            },
            {
              id: 'c',
              text: 'Tell the recruiter your personal household expenses and beg for sympathy.',
              isCorrect: false,
              explanation:
                'Personal hardship appeals do not influence corporate compensation bands; business value does.',
            },
            {
              id: 'd',
              text: 'Hang up and post aggressive rants tagging the recruiter on social platforms.',
              isCorrect: false,
              explanation:
                'Emotional hostility damages professional reputation and burns industry bridges.',
            },
          ],
          gapFeedback: {
            headline: 'Runway Negotiation & Parity Defense Gap',
            explanation:
              'Negotiating without panic requires knowing your runway and cost-of-vacancy value. Use the Runway and Salary tools on Horizon to benchmark numbers.',
            missingSkill: 'Runway Calculation & Value-Anchored Negotiation',
            roadmapUrl: '/features/runway',
            roadmapButtonText: 'Open Runway Calculator',
          },
        },
        actionLink: {
          label: 'Open Runway Calculator',
          to: '/features/runway',
        },
      },
      {
        id: 3,
        title: '0-Day Notice Kanban Pipeline',
        subtitle: 'Leverage urgent backfill hiring priorities across 10+ target employers',
        badge: 'LEVEL 3 • JOB PIPELINE',
        themeColor: 'from-purple-600 to-indigo-600',
        gradient: 'bg-gradient-to-tr from-purple-600 to-indigo-600',
        borderGlow: 'border-purple-500/80 shadow-purple-500/40',
        iconName: 'Briefcase',
        xp: 250,
        time: '1 Week',
        whatToDo: [
          'Add 10 targeted companies to your Kanban pipeline board.',
          'Flag applications with "Immediate Available (0 Days Notice)" highlight tags.',
          'Track outreach, interview stages, and recruiter responses in real time.',
        ],
        deliverable: 'Active Kanban Board with 3+ Scheduled Interviews',
        riskCut: '-20% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Manage Job Kanban',
          to: '/features/job-tracker',
        },
      },
      {
        id: 4,
        title: 'Fast-Track 2-Round Interview Sprints',
        subtitle: 'Accelerate through fast-track hiring loops with proven engineering grit',
        badge: 'LEVEL 4 • INTERVIEW SPEED',
        themeColor: 'from-amber-500 to-orange-600',
        gradient: 'bg-gradient-to-tr from-amber-500 to-orange-600',
        borderGlow: 'border-amber-500/80 shadow-amber-500/40',
        iconName: 'Zap',
        xp: 300,
        time: '2 Weeks',
        whatToDo: [
          'Complete fast-track screening calls highlighting immediate start capability.',
          'Deliver practical take-home coding challenges within 24 hours.',
          'Secure initial written offer letters.',
        ],
        deliverable: '1 Verified Offer Letter in Hand',
        riskCut: '-25% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Explore Fast-Track Jobs',
          to: '/jobs',
        },
      },
      {
        id: 5,
        title: 'Offer Signoff & Immediate Transition 🏆',
        subtitle: 'Accept a market-rate offer with zero salary concession and restart your career',
        badge: 'BOSS LEVEL 🏆 • RE-EMPLOYED',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600',
        borderGlow: 'border-emerald-400 shadow-emerald-400/50',
        iconName: 'Trophy',
        xp: 500,
        time: 'Unlocked',
        whatToDo: [
          'Verify that compensation meets or beats your previous package.',
          'Sign offer letter and register your start date.',
          'Mint your verified Skill Passport credential.',
        ],
        deliverable: 'Signed Lateral Tech Offer (₹14 - ₹20 LPA)',
        riskCut: '-35% Risk Eliminated',
        hasQuiz: true,
        quiz: {
          skillName: 'Lateral Offer Evaluation & Zero-Penalty Signoff',
          scenario:
            'You receive an offer for ₹16 LPA starting on Monday, and are in final approval for ₹19.5 LPA at another company with approval expected in 4 days.',
          question:
            'What is the optimal tactical move to lock in downside protection while capturing upside compensation?',
          options: [
            {
              id: 'a',
              text: 'Request a 4-day start extension from Company A to complete onboarding documentation, while simultaneously informing Company B of your impending start date to trigger expedited offer release.',
              isCorrect: true,
              explanation:
                'Spot on! A brief standard paperwork extension maintains full goodwill with Company A while giving Company B the urgent trigger needed to release the higher offer.',
            },
            {
              id: 'b',
              text: 'Ghost both companies and restart job hunting from scratch.',
              isCorrect: false,
              explanation:
                'Ghosting forfeits both high-paying offers and destroys recruiter relationships.',
            },
            {
              id: 'c',
              text: 'Join Company A on Monday, then walk out after 2 hours without telling anyone.',
              isCorrect: false,
              explanation:
                'Absconding triggers negative EPF marks and permanent blacklisting across background verification databases.',
            },
            {
              id: 'd',
              text: 'Threaten Company A that you will sue them if they do not match Company B instantly.',
              isCorrect: false,
              explanation:
                'Confrontational threats result in immediate revocation of your active offer.',
            },
          ],
          gapFeedback: {
            headline: 'Offer Management & Risk Mitigation Gap',
            explanation:
              'Balancing competing offers requires disciplined timeline management and transparent recruiter communication. Explore the Jobs & Compensation tools.',
            missingSkill: 'Competing Offer Management & Timing',
            roadmapUrl: '/jobs',
            roadmapButtonText: 'Explore Jobs & Offers Hub',
          },
        },
        actionLink: {
          label: 'Mint Verified Skill Passport',
          to: '/passport',
        },
      },
    ],
  },

  // ── 6. GIG WORKER PERSONA ─────────────────────────────────────────
  gig: {
    trackName: 'Formal Corporate Career Transition Track',
    trackDescription: 'Convert operational discipline and SLA resilience into a formal salaried logistics / tech ops career.',
    targetElevation: 'Logistics Operations Specialist',
    salaryTarget: '₹4.5 - ₹7.0 LPA',
    levels: [
      {
        id: 1,
        title: 'Operational Excellence & Process Check',
        subtitle: 'Validate problem-solving, SLA compliance, and customer dispute resolution',
        badge: 'LEVEL 1 • OPS CHECK',
        themeColor: 'from-amber-500 to-orange-600',
        gradient: 'bg-gradient-to-tr from-amber-500 to-orange-600',
        borderGlow: 'border-amber-500/80 shadow-amber-500/40',
        iconName: 'Flame',
        xp: 150,
        time: '3 Mins',
        whatToDo: [
          'Take the Level 1 Operational Discipline Quiz testing routing optimization and customer dispute resolution.',
          'Demonstrate your readiness for salaried operations management.',
          'Explore corporate skills like Excel & SQL on the My Skills page if needed.',
        ],
        deliverable: '100% Score on Logistics Escalation Scenario',
        riskCut: '-10% Gig Insecurity Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'Operations SLA Management & Escalation',
          scenario:
            'During a rainy evening rush, 15 deliveries in your quick-commerce zone are delayed by 25 minutes due to road waterlogging, and customers begin calling customer support.',
          question:
            'As an Operations Team Lead, which protocol should you implement immediately?',
          options: [
            {
              id: 'a',
              text: 'Turn off your phone and let the automatic system handle the angry messages.',
              isCorrect: false,
              explanation: 'Ignoring operational delays leads to customer churn, driver distress, and merchant chargebacks.',
            },
            {
              id: 'b',
              text: 'Re-cluster routes by geo-hub, trigger proactive SMS delay notifications with rain vouchers, and adjust arrival SLAs in the dashboard to protect partner ratings.',
              isCorrect: true,
              explanation: 'Correct! Proactive communication with dynamic geo-rebalancing and SLA protection mitigates customer frustration and safeguards driver safety.',
            },
            {
              id: 'c',
              text: 'Demand that all riders drive twice as fast through the flooded areas.',
              isCorrect: false,
              explanation: 'Endangering delivery partners violates safety protocols and results in severe accidents and legal liability.',
            },
            {
              id: 'd',
              text: 'Cancel all orders immediately without informing the merchants.',
              isCorrect: false,
              explanation: 'Mass cancellations cause immediate revenue and food waste losses for restaurant partners.',
            },
          ],
          gapFeedback: {
            headline: 'Corporate Operations Tooling Gap',
            explanation:
              'Salaried logistics team leads need hands-on skills in Excel dashboards, basic SQL data querying, and SLA incident reporting.',
            missingSkill: 'Logistics SLA & Incident Management',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Open My Skills Roadmap for Ops',
          },
        },
      },
      {
        id: 2,
        title: 'Corporate Productivity Tools (Excel & SQL)',
        subtitle: 'Master basic spreadsheet formulas, pivot tables, and dispatch logs',
        badge: 'LEVEL 2 • CORPORATE TOOLS',
        themeColor: 'from-blue-600 to-indigo-600',
        gradient: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
        borderGlow: 'border-blue-500/80 shadow-blue-500/40',
        iconName: 'BookOpen',
        xp: 200,
        time: '1 Week',
        whatToDo: [
          'Complete introductory lessons on Excel formulas (VLOOKUP, SUMIFS, Pivot Tables).',
          'Practice building a mock hub delivery performance spreadsheet.',
          'Learn basic corporate email etiquette and ticket response templates.',
        ],
        deliverable: 'Completed Excel Hub Performance Report Template',
        riskCut: '-15% Risk',
        hasQuiz: true,
        quiz: {
          skillName: 'Excel Hub Analytics & SLA Reconciliation',
          scenario:
            'As an operations hub coordinator, you need to compute the on-time delivery percentage across 4 delivery zones handling 1,500 parcels in Excel.',
          question:
            'What is the standard corporate spreadsheet technique to summarize zone performance accurately?',
          options: [
            {
              id: 'a',
              text: 'Insert an Excel Pivot Table grouping by Delivery Zone and calculating the Average On-Time Delivery metric, or use =AVERAGEIFS().',
              isCorrect: true,
              explanation:
                'Spot on! Pivot tables and =AVERAGEIFS() dynamically aggregate thousands of rows in seconds without human calculation error.',
            },
            {
              id: 'b',
              text: 'Use a physical pocket calculator and type results manually into each cell.',
              isCorrect: false,
              explanation:
                'Manual calculations take hours, do not update when data changes, and are prone to severe calculation errors.',
            },
            {
              id: 'c',
              text: 'Guess approximate numbers based on memory.',
              isCorrect: false,
              explanation:
                'Falsifying ops metrics violates corporate compliance and leads to termination.',
            },
            {
              id: 'd',
              text: 'Delete rows where delivery was late so the percentage looks 100%.',
              isCorrect: false,
              explanation:
                'Tampering with dispatch logs destroys customer trust and violates audit guidelines.',
            },
          ],
          gapFeedback: {
            headline: 'Spreadsheet & Hub Data Analysis Gap',
            explanation:
              'Corporate tech ops requires confidence with Pivot Tables, VLOOKUP/XLOOKUP, and SLA dashboards. Practice on the My Skills page.',
            missingSkill: 'Corporate Spreadsheets & Ops Dashboards',
            roadmapUrl: '/skills',
            roadmapButtonText: 'Learn Ops Spreadsheet Skills',
          },
        },
        actionLink: {
          label: 'View Ops Skills on My Skills',
          to: '/skills',
        },
      },
      {
        id: 3,
        title: 'Verified Work & Income Certificate',
        subtitle: 'Generate digitally stamped proof of income & delivery tenure for corporate applications',
        badge: 'LEVEL 3 • PROOF PASSPORT',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
        borderGlow: 'border-emerald-500/80 shadow-emerald-500/40',
        iconName: 'Award',
        xp: 250,
        time: '1 Day',
        whatToDo: [
          'Open the Work & Income Proof generator in your dashboard.',
          'Generate your verified ₹28.5k/month certified income certificate.',
          'Attach your verified delivery rating (4.85+ stars) to validate discipline.',
        ],
        deliverable: 'Digitally Stamped PDF Work & Income Certificate',
        riskCut: '-20% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Get Stamped Work Proof PDF',
          to: '/features/work-proof',
        },
      },
      {
        id: 4,
        title: 'Salaried Corporate Ops Interviews',
        subtitle: 'Interview for formal salaried positions with fixed hours and health benefits',
        badge: 'LEVEL 4 • SALARIED INTERVIEWS',
        themeColor: 'from-purple-600 to-pink-600',
        gradient: 'bg-gradient-to-tr from-purple-600 to-pink-600',
        borderGlow: 'border-purple-500/80 shadow-purple-500/40',
        iconName: 'Briefcase',
        xp: 300,
        time: '2 Weeks',
        whatToDo: [
          'Apply for formal warehouse lead, logistics coordinator, and fleet manager openings.',
          'Present your stamped work proof and verified operational discipline.',
          'Negotiate fixed monthly base pay + ESI/PF health insurance coverage.',
        ],
        deliverable: '1 Verified Salaried Job Interview Loop',
        riskCut: '-25% Risk',
        hasQuiz: false,
        actionLink: {
          label: 'Explore Ops Openings in Jobs',
          to: '/jobs',
        },
      },
      {
        id: 5,
        title: 'Formal Salaried Corporate Offer 🏆',
        subtitle: 'Sign a salaried contract with PF, health insurance, and structured career ladders',
        badge: 'BOSS LEVEL 🏆 • CORPORATE SUCCESS',
        themeColor: 'from-emerald-500 to-teal-600',
        gradient: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600',
        borderGlow: 'border-emerald-400 shadow-emerald-400/50',
        iconName: 'Trophy',
        xp: 500,
        time: 'Unlocked',
        whatToDo: [
          'Accept formal offer letter with guaranteed monthly base salary.',
          'Enroll in corporate medical insurance and retirement fund (PF/ESI).',
          'Celebrate your successful transition into formal Indian corporate employment.',
        ],
        deliverable: 'Signed Formal Salaried Appointment Letter',
        riskCut: '-40% Insecurity Eliminated',
        hasQuiz: true,
        quiz: {
          skillName: 'Formal Corporate Contract & Benefits Literacy',
          scenario:
            'You are offered a formal Logistics Operations Team Lead position at ₹5.2 LPA with EPF and corporate medical cover. An informal vendor offers you ₹5.5 LPA in daily cash with zero contract or insurance.',
          question:
            'Why is the formal salaried contract objectively superior for long-term financial security?',
          options: [
            {
              id: 'a',
              text: 'A formal appointment letter provides mandatory employer EPF contribution, health insurance security, fixed working hours, and formal payslips required for bank loans and career promotion.',
              isCorrect: true,
              explanation:
                'Spot on! Formal payslips and PF contributions unlock institutional banking, medical protection, and an official corporate career path.',
            },
            {
              id: 'b',
              text: 'The informal cash vendor is better because zero documentation means you can quit any afternoon without telling anyone.',
              isCorrect: false,
              explanation:
                'Informal work lacks job security, medical safety nets, and official career progression.',
            },
            {
              id: 'c',
              text: 'Both offers are identical in every way.',
              isCorrect: false,
              explanation:
                'Informal cash work offers zero benefits, no severance, no insurance, and no EPF compounding.',
            },
            {
              id: 'd',
              text: 'Corporate appointments require you to work 24 hours a day with no leave.',
              isCorrect: false,
              explanation:
                'Formal corporate contracts have legally mandated working hours, paid leave, and holiday entitlements.',
            },
          ],
          gapFeedback: {
            headline: 'Corporate Benefits & Contract Literacy Gap',
            explanation:
              'Understanding formal benefits, in-hand deductions, and PF compounding empowers you during your career transition. Explore the Real Salary Calculator.',
            missingSkill: 'Corporate Benefits & Salary Literacy',
            roadmapUrl: '/jobs',
            roadmapButtonText: 'Calculate Real In-Hand CTC',
          },
        },
        actionLink: {
          label: 'Mint Verified Skill Passport',
          to: '/passport',
        },
      },
    ],
  },
}

export function getPersonaGamificationConfig(
  userType: string,
  stagnantGoal: 'promotion' | 'switch' = 'promotion',
): PersonaLevelConfig {
  if (userType === 'stagnant') {
    return stagnantGoal === 'switch'
      ? GAMIFICATION_TRACKS.stagnant_switch
      : GAMIFICATION_TRACKS.stagnant_promotion
  }
  return GAMIFICATION_TRACKS[userType] || GAMIFICATION_TRACKS.returner
}

export function getPersonaKey(
  userType: string,
  stagnantGoal: 'promotion' | 'switch' = 'promotion',
): string {
  if (userType === 'stagnant') {
    return `stagnant_${stagnantGoal}`
  }
  return userType || 'returner'
}
