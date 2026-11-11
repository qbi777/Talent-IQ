import { College, FacultyUser, Examination, StudentAttempt, ProctoringEvent } from '../types';

export const INITIAL_COLLEGES: College[] = [
  {
    id: 'COL001',
    name: 'SSN College of Engineering',
    code: '1315',
    district: 'Chengalpattu',
    city: 'Kalavakkam, Chennai OMR',
    established: 1996,
    type: 'Autonomous',
    naacGrade: 'A++',
    nirfRank: 45,
    website: 'https://www.ssn.edu.in',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 1840,
    averageScore: 84.6,
    assessmentsConducted: 42,
    departments: ['Computer Science', 'Information Technology', 'ECE', 'Mechanical', 'Biomedical']
  },
  {
    id: 'COL002',
    name: 'PSG College of Technology',
    code: '2006',
    district: 'Coimbatore',
    city: 'Peelamedu, Coimbatore',
    established: 1951,
    type: 'Autonomous',
    naacGrade: 'A++',
    nirfRank: 38,
    website: 'https://www.psgtech.edu',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 2150,
    averageScore: 86.2,
    assessmentsConducted: 56,
    departments: ['Computer Science', 'Robotics & Automation', 'Mechanical', 'Electrical', 'Biotech']
  },
  {
    id: 'COL003',
    name: 'College of Engineering, Guindy (Anna University)',
    code: '0001',
    district: 'Chennai',
    city: 'Guindy, Chennai',
    established: 1794,
    type: 'Government',
    naacGrade: 'A++',
    nirfRank: 13,
    website: 'https://ceg.annauniv.edu',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 3200,
    averageScore: 88.5,
    assessmentsConducted: 74,
    departments: ['Computer Science', 'Information Science', 'Civil', 'ECE', 'Printing Technology']
  },
  {
    id: 'COL004',
    name: 'Thiagarajar College of Engineering',
    code: '5008',
    district: 'Madurai',
    city: 'Thiruparankundram, Madurai',
    established: 1957,
    type: 'Autonomous',
    naacGrade: 'A+',
    nirfRank: 85,
    website: 'https://www.tce.edu',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 1420,
    averageScore: 81.3,
    assessmentsConducted: 31,
    departments: ['Computer Science', 'Data Science', 'Civil', 'Mechanical', 'Mechatronics']
  },
  {
    id: 'COL005',
    name: 'National Institute of Technology (NIT Trichy)',
    code: 'NIT01',
    district: 'Tiruchirappalli',
    city: 'Thuvakudi, Tiruchirappalli',
    established: 1964,
    type: 'Autonomous',
    naacGrade: 'A++',
    nirfRank: 9,
    website: 'https://www.nitt.edu',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 2890,
    averageScore: 91.4,
    assessmentsConducted: 68,
    departments: ['Computer Science', 'Instrumentation', 'ECE', 'Chemical', 'Production']
  },
  {
    id: 'COL006',
    name: 'Government College of Engineering, Salem',
    code: '2615',
    district: 'Salem',
    city: 'Karuppur, Salem',
    established: 1966,
    type: 'Government',
    naacGrade: 'A',
    nirfRank: 120,
    website: 'https://gcesalem.edu.in',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 980,
    averageScore: 78.4,
    assessmentsConducted: 22,
    departments: ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Metallurgical']
  },
  {
    id: 'COL007',
    name: 'V.O. Chidambaram College',
    code: 'VOC01',
    district: 'Thoothukudi',
    city: 'Millerpuram, Thoothukudi',
    established: 1951,
    type: 'Autonomous',
    naacGrade: 'A',
    website: 'https://voccollege.ac.in',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 750,
    averageScore: 76.9,
    assessmentsConducted: 18,
    departments: ['Computer Science', 'Commerce', 'Physics', 'Mathematics', 'Chemistry']
  },
  {
    id: 'COL008',
    name: 'Noorul Islam Centre for Higher Education',
    code: 'NICHE',
    district: 'Kanyakumari',
    city: 'Kumaracoil, Thuckalay',
    established: 1989,
    type: 'Deemed University',
    naacGrade: 'A',
    website: 'https://www.niuniv.com',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 820,
    averageScore: 77.2,
    assessmentsConducted: 19,
    departments: ['Computer Science', 'Marine Engineering', 'Aeronautical', 'Biomedical']
  },
  {
    id: 'COL009',
    name: 'Vellore Institute of Technology (VIT)',
    code: 'VIT01',
    district: 'Vellore',
    city: 'Katpadi, Vellore',
    established: 1984,
    type: 'Deemed University',
    naacGrade: 'A++',
    nirfRank: 11,
    website: 'https://vit.ac.in',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 4100,
    averageScore: 87.8,
    assessmentsConducted: 88,
    departments: ['Computer Science', 'Software Engineering', 'AI & Machine Learning', 'Bioengineering']
  },
  {
    id: 'COL010',
    name: 'SASTRA Deemed University',
    code: 'SAS01',
    district: 'Thanjavur',
    city: 'Tirumalaisamudram, Thanjavur',
    established: 1984,
    type: 'Deemed University',
    naacGrade: 'A++',
    nirfRank: 26,
    website: 'https://www.sastra.edu',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 1950,
    averageScore: 85.1,
    assessmentsConducted: 44,
    departments: ['Computer Science', 'Law & Governance', 'Bioinformatics', 'Mechanical']
  },
  {
    id: 'COL011',
    name: 'Kongu Engineering College',
    code: '2711',
    district: 'Erode',
    city: 'Perundurai, Erode',
    established: 1984,
    type: 'Autonomous',
    naacGrade: 'A++',
    nirfRank: 118,
    website: 'https://kongu.ac.in',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 1340,
    averageScore: 82.0,
    assessmentsConducted: 29,
    departments: ['Computer Science', 'Chemical Engineering', 'Food Technology', 'Automobile']
  },
  {
    id: 'COL012',
    name: 'Government College of Engineering, Tirunelveli',
    code: '4974',
    district: 'Tirunelveli',
    city: 'Tirunelveli',
    established: 1981,
    type: 'Government',
    naacGrade: 'A',
    website: 'https://gcetly.ac.in',
    participatingInPublicRankings: true,
    totalStudentsAssessed: 890,
    averageScore: 79.5,
    assessmentsConducted: 21,
    departments: ['Computer Science', 'Civil', 'ECE', 'Mechanical']
  }
];

export const INITIAL_FACULTY: FacultyUser[] = [
  {
    id: 'FAC001',
    collegeId: 'COL001',
    collegeName: 'SSN College of Engineering',
    name: 'Dr. S. Ramanathan, Ph.D.',
    email: 'ramanathan.s@ssn.edu.in',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Head of Department',
    googleDriveConnected: true,
    googleDriveEmail: 'ramanathan.ssn@gmail.com',
    status: 'Active',
    createdAt: '2026-08-15'
  },
  {
    id: 'FAC002',
    collegeId: 'COL002',
    collegeName: 'PSG College of Technology',
    name: 'Dr. Priya Sundaram',
    email: 'priya.sundaram@psgtech.edu',
    department: 'Information Technology',
    designation: 'Associate Professor',
    googleDriveConnected: true,
    googleDriveEmail: 'priya.sundaram.edu@gmail.com',
    status: 'Active',
    createdAt: '2026-09-01'
  },
  {
    id: 'FAC003',
    collegeId: 'COL003',
    collegeName: 'CEG Anna University',
    name: 'Prof. K. Venkatesh',
    email: 'venkatesh.k@annauniv.edu',
    department: 'Computer Technology',
    designation: 'Professor',
    googleDriveConnected: false,
    status: 'Active',
    createdAt: '2026-09-12'
  }
];

export const INITIAL_EXAMINATIONS: Examination[] = [
  {
    id: 'EXM-TN8F29K',
    collegeId: 'COL001',
    facultyId: 'FAC001',
    facultyName: 'Dr. S. Ramanathan, Ph.D.',
    collegeName: 'SSN College of Engineering',
    title: 'CS301: Advanced Data Structures & Algorithmic Problem Solving',
    subject: 'Computer Science & Engineering',
    description: 'Comprehensive mid-semester assessment covering Red-Black Trees, Dynamic Programming, Disjoint Sets, and Concurrency Tradeoffs.',
    durationMinutes: 45,
    totalMarks: 50,
    passPercentage: 50,
    instructions: [
      'Each question must be answered carefully. Tab-switching is continuously monitored by the proctoring engine.',
      'Leaving fullscreen or switching away to another browser tab triggers an automated malpractice flag.',
      'Auto-save is enabled every 15 seconds. Ensure your answer is written before proceeding.',
      'For descriptive and situational answers, AI-assisted rubric grading will evaluate technical depth, reasoning, and clarity.'
    ],
    maxAttempts: 1,
    resultsVisibleToStudents: true,
    monitoringSettings: {
      tabSwitchDetection: true,
      fullscreenRequired: true,
      cameraPresenceAlerts: true,
      maxTabSwitchesAllowed: 3
    },
    status: 'Active',
    scheduledDate: '2026-11-12',
    totalAttempts: 14,
    evaluatedAttempts: 14,
    averageScore: 39.8,
    highestScore: 48,
    lowestScore: 28,
    googleDocsPaperId: 'DOC_CS301_MIDTERM_2026',
    googleSheetsResultsId: 'SHEET_CS301_RESULTS_2026',
    createdAt: '2026-11-05',
    questions: [
      {
        id: 'Q1',
        type: 'multiple_choice',
        question: 'What is the tight worst-case time complexity of inserting an element into an AVL Tree with N nodes?',
        marks: 4,
        negativeMarks: 1,
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswer: 'O(log N)',
        explanation: 'In an AVL tree, self-balancing rotations (LL, RR, LR, RL) require at most two rotations taking O(1) time after traversing at most O(log N) height.'
      },
      {
        id: 'Q2',
        type: 'multiple_choice',
        question: 'Which of the following problems exhibits the Optimal Substructure property required for Dynamic Programming?',
        marks: 4,
        options: [
          'Longest Simple Path in an arbitrary unweighted graph',
          '0/1 Knapsack Problem',
          'Maximum Independent Set on general graphs in polynomial time',
          'Finding the median using Randomized Quickselect'
        ],
        correctAnswer: '0/1 Knapsack Problem',
        explanation: '0/1 Knapsack has optimal substructure: the optimal solution to the subproblem with capacity W - w_i is part of the optimal solution for capacity W.'
      },
      {
        id: 'Q3',
        type: 'short_answer',
        question: 'Explain the fundamental difference between Amortized Time Complexity and Worst-Case Time Complexity in Dynamic Array resizing.',
        marks: 8,
        expectedKeywords: ['aggregate', 'geometric expansion', 'constant time', 'single operation', 'guarantee', 'doubling'],
        modelAnswer: 'Worst-case time complexity guarantees the maximum time taken by any single operation (e.g. O(N) when copying during an array expansion). Amortized time complexity averages the total cost of a sequence of M operations over M (e.g. O(1) per append), because costly reallocations happen exponentially less often.',
        rubricCriteria: {
          relevance: 2,
          technicalAccuracy: 3,
          reasoning: 2,
          depth: 1
        }
      },
      {
        id: 'Q4',
        type: 'image_based',
        question: 'Inspect the provided tree structure below. Identify whether this tree satisfies the Red-Black Tree invariant rules, and state the exact rotation or recoloring required if a new red node is inserted as the left child of node 14.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        imageCaption: 'Binary Balanced Node Topology - Tree with Root [10: Black], Left [5: Black], Right [18: Black], with Subtrees.',
        marks: 14,
        expectedKeywords: ['recoloring', 'black height', 'consecutive red', 'uncle node', 'right rotation', 'invariant'],
        modelAnswer: 'If node 14 is inserted as a red node under right subtree, check the color of its uncle node. If uncle is red, recolor parent and uncle black and grandparent red. If uncle is black, perform appropriate trinode restructuring (RL or RR rotation) to maintain black-height balance without two adjacent red nodes.',
        rubricCriteria: {
          relevance: 3,
          technicalAccuracy: 5,
          reasoning: 4,
          depth: 2
        }
      },
      {
        id: 'Q5',
        type: 'situational',
        scenario: 'You are an engineer designing the in-memory cache eviction policy for an Anna University e-Governance portal experiencing 200,000 requests per minute during college counseling result declarations. The memory size is strictly capped at 16GB.',
        question: 'Propose an optimal cache eviction strategy (e.g., ARC, LFU, LRU with 2Q, or W-TinyLFU). Justify your architectural design against cache stampede and zipfian distribution patterns.',
        marks: 20,
        expectedKeywords: ['cache stampede', 'zipfian', 'frequency', 'recency', 'mutex lock', 'probabilistic', 'W-TinyLFU', 'bloom filter'],
        modelAnswer: 'A hybrid adaptive cache like W-TinyLFU or 2Q is optimal. Simple LRU suffers under scanning pollution, while LFU struggles with stale popular items. W-TinyLFU combines a small LRU window for recency with a Count-Min Sketch for frequency estimation. To prevent cache stampede during counseling results, employ mutex lock gating (single-flight / stale-while-revalidate) so only one thread queries the database upon cache miss while other requests receive cached or wait.',
        rubricCriteria: {
          relevance: 5,
          technicalAccuracy: 6,
          reasoning: 5,
          depth: 4
        }
      }
    ]
  },
  {
    id: 'EXM-TN9B42L',
    collegeId: 'COL002',
    facultyId: 'FAC002',
    facultyName: 'Dr. Priya Sundaram',
    collegeName: 'PSG College of Technology',
    title: 'IT402: Distributed Cloud Systems & Microservices',
    subject: 'Information Technology',
    description: 'System design, Raft consensus, CAP theorem trade-offs, and horizontal scalability.',
    durationMinutes: 60,
    totalMarks: 40,
    passPercentage: 50,
    instructions: [
      'Write clear, architecturally sound explanations.',
      'Tab switching will be recorded in proctoring logs.'
    ],
    maxAttempts: 1,
    resultsVisibleToStudents: false,
    monitoringSettings: {
      tabSwitchDetection: true,
      fullscreenRequired: true,
      cameraPresenceAlerts: false,
      maxTabSwitchesAllowed: 2
    },
    status: 'Active',
    scheduledDate: '2026-11-14',
    totalAttempts: 8,
    evaluatedAttempts: 8,
    averageScore: 32.5,
    highestScore: 38,
    lowestScore: 24,
    googleDocsPaperId: 'DOC_IT402_EXAM_2026',
    googleSheetsResultsId: 'SHEET_IT402_RESULTS_2026',
    createdAt: '2026-11-08',
    questions: [
      {
        id: 'Q201',
        type: 'multiple_choice',
        question: 'In the CAP theorem, why is a distributed database over an asynchronous network fundamentally unable to simultaneously guarantee both Consistency and Availability during a network partition?',
        marks: 5,
        options: [
          'Because network latency slows CPU clock ticks',
          'Because nodes on isolated partition sides cannot coordinate state without dropping updates or serving stale data',
          'Because relational SQL requires synchronous disk flushes',
          'Because TLS handshakes timeout during packet loss'
        ],
        correctAnswer: 'Because nodes on isolated partition sides cannot coordinate state without dropping updates or serving stale data',
        explanation: 'When network partitions occur (P), you must choose either to accept writes and sacrifice linearizability (AP) or reject writes to maintain consistency (CP).'
      },
      {
        id: 'Q202',
        type: 'descriptive',
        question: 'Compare Raft and Paxos consensus algorithms in terms of leader election, log replication, and operational maintainability.',
        marks: 15,
        expectedKeywords: ['leader election', 'strong leader', 'term number', 'heartbeat', 'log replication', 'understandability'],
        modelAnswer: 'Raft was explicitly designed for understandability. Raft uses a strong leader model where logs flow strictly from leader to followers, and leader election uses randomized election timers. Paxos can have multi-proposer or leaderless configurations (Multi-Paxos), making corner cases and implementation significantly more subtle.',
        rubricCriteria: {
          relevance: 4,
          technicalAccuracy: 5,
          reasoning: 3,
          depth: 3
        }
      },
      {
        id: 'Q203',
        type: 'situational',
        scenario: 'A state-wide college admission portal suffers a catastrophic regional outage in Chennai due to fiber cable severance during monsoon rains. The secondary database replica is located in Coimbatore.',
        question: 'Describe your automated failover strategy using DNS routing, split-brain avoidance, and data reconciliation.',
        marks: 20,
        expectedKeywords: ['split brain', 'quorum', 'health check', 'DNS TTL', 'replication lag', 'reconciliation', 'idempotency'],
        modelAnswer: 'Use an odd-numbered quorum witness (e.g., cloud witness or third region) to prevent split-brain. The Coimbatore replica must verify majority consensus before promoting to primary. Update Anycast/GeoDNS with low TTL to route traffic to Coimbatore. Post-incident, inspect wal log offsets to reconcile in-flight transactions.',
        rubricCriteria: {
          relevance: 5,
          technicalAccuracy: 6,
          reasoning: 5,
          depth: 4
        }
      }
    ]
  }
];

export const INITIAL_STUDENT_ATTEMPTS: StudentAttempt[] = [
  {
    id: 'ATT-101',
    examId: 'EXM-TN8F29K',
    collegeId: 'COL001',
    studentName: 'Kavitha Murugesan',
    studentRollNo: '312221104085',
    studentEmail: 'kavitha.m@ssn.edu.in',
    department: 'Computer Science & Engineering',
    startedAt: '2026-11-11T10:00:00Z',
    submittedAt: '2026-11-11T10:38:12Z',
    timeSpentSeconds: 2292,
    status: 'Evaluated',
    totalMarksAwarded: 48,
    totalMarksPossible: 50,
    percentage: 96,
    rank: 1,
    passed: true,
    tabSwitchCount: 0,
    malpracticeFlag: false,
    proctoringEvents: [],
    answers: {
      Q1: {
        questionId: 'Q1',
        type: 'multiple_choice',
        selectedOption: 'O(log N)',
        isCorrect: true,
        awardedMarks: 4,
        maxMarks: 4
      },
      Q2: {
        questionId: 'Q2',
        type: 'multiple_choice',
        selectedOption: '0/1 Knapsack Problem',
        isCorrect: true,
        awardedMarks: 4,
        maxMarks: 4
      },
      Q3: {
        questionId: 'Q3',
        type: 'short_answer',
        textAnswer: 'Amortized time averages out the high cost of infrequent doubling reallocations across M operations, yielding an effective O(1) cost per element. In contrast, worst-case complexity analyzes the maximum time a single worst-case operation takes (which is O(N) when the buffer reallocates and copies).',
        awardedMarks: 8,
        maxMarks: 8,
        aiEvaluation: {
          relevanceScore: 2,
          technicalAccuracyScore: 3,
          reasoningScore: 2,
          depthScore: 1,
          totalScore: 8,
          reasoningText: 'Exceptional precision in contrasting per-operation bounds against aggregate sequence amortization.',
          strengths: ['Identified O(N) copy penalty', 'Clear O(1) amortized explanation', 'Correct conceptual scope'],
          improvements: ['Can mention specific geometric factor (1.5x vs 2x) for real runtimes'],
          reviewRequired: false,
          evaluatedAt: '2026-11-11T10:39:00Z'
        }
      },
      Q4: {
        questionId: 'Q4',
        type: 'image_based',
        textAnswer: 'The tree is currently balanced. When inserting a new red node under 14, the uncle node color dictates the action: if the uncle is red, we perform recoloring (parent & uncle to black, grandparent to red) and propagate upward. If uncle is black, a double rotation (RL restructuring) is triggered to maintain consecutive red restriction and black-height balance.',
        awardedMarks: 13,
        maxMarks: 14,
        aiEvaluation: {
          relevanceScore: 3,
          technicalAccuracyScore: 5,
          reasoningScore: 3.5,
          depthScore: 1.5,
          totalScore: 13,
          reasoningText: 'Accurately handled uncle color bifurcations and specific Red-Black Tree invariant checks.',
          strengths: ['Correct distinction between recoloring and restructuring', 'Mentioned black height invariant'],
          improvements: ['Could sketch out the final tree order nodes explicitly'],
          reviewRequired: false,
          evaluatedAt: '2026-11-11T10:39:15Z'
        }
      },
      Q5: {
        questionId: 'Q5',
        type: 'situational',
        textAnswer: 'I recommend deploying W-TinyLFU inside a 16GB memory footprint. W-TinyLFU uses a small admissions filter (LRU window) taking ~1% memory to protect against sudden bursts, coupled with a Count-Min Sketch with 4-bit counters that estimate historical frequency without large pointer overhead. Under Zipfian traffic, popular student counseling roll lookups stay pinned. To tackle cache stampedes during concurrent 200k req/min spikes, we implement single-flight mutex grouping (or distributed locks with Redis/Redlock), so that only the first cache miss triggers the database query while identical concurrent requests await the broadcast response.',
        awardedMarks: 19,
        maxMarks: 20,
        aiEvaluation: {
          relevanceScore: 5,
          technicalAccuracyScore: 6,
          reasoningScore: 4.5,
          depthScore: 3.5,
          totalScore: 19,
          reasoningText: 'Superb, production-grade architecture proposal. Directly addresses both Zipfian distribution and cache stampede with single-flight mutexes.',
          strengths: ['Accurate Count-Min Sketch usage', 'Production-ready stampede mitigation', 'Tailored for 16GB constraint'],
          improvements: ['Could specify memory decay mechanism in Count-Min sketch'],
          reviewRequired: false,
          evaluatedAt: '2026-11-11T10:39:30Z'
        }
      }
    }
  },
  {
    id: 'ATT-102',
    examId: 'EXM-TN8F29K',
    collegeId: 'COL001',
    studentName: 'Arunmozhi Varman',
    studentRollNo: '312221104022',
    studentEmail: 'arunmozhi.v@ssn.edu.in',
    department: 'Computer Science & Engineering',
    startedAt: '2026-11-11T10:02:00Z',
    submittedAt: '2026-11-11T10:41:45Z',
    timeSpentSeconds: 2385,
    status: 'Evaluated',
    totalMarksAwarded: 44,
    totalMarksPossible: 50,
    percentage: 88,
    rank: 2,
    passed: true,
    tabSwitchCount: 1,
    malpracticeFlag: false,
    proctoringEvents: [
      {
        id: 'EVT-001',
        attemptId: 'ATT-102',
        studentRollNo: '312221104022',
        studentName: 'Arunmozhi Varman',
        eventType: 'tab_switched',
        timestamp: '2026-11-11T10:18:22Z',
        details: 'Student switched away from examination window for 6 seconds.',
        severity: 'low',
        reviewStatus: 'Cleared',
        facultyNotes: 'Brief momentary switch. No suspicious pattern observed.'
      }
    ],
    answers: {
      Q1: { questionId: 'Q1', type: 'multiple_choice', selectedOption: 'O(log N)', isCorrect: true, awardedMarks: 4, maxMarks: 4 },
      Q2: { questionId: 'Q2', type: 'multiple_choice', selectedOption: '0/1 Knapsack Problem', isCorrect: true, awardedMarks: 4, maxMarks: 4 },
      Q3: {
        questionId: 'Q3',
        type: 'short_answer',
        textAnswer: 'Amortized time is the average runtime over multiple insertions into a dynamic array. Even though one insertion takes O(N) because memory doubles, the overall average is O(1). Worst case is the maximum time for one single step.',
        awardedMarks: 7,
        maxMarks: 8,
        aiEvaluation: {
          relevanceScore: 2,
          technicalAccuracyScore: 2.5,
          reasoningScore: 1.5,
          depthScore: 1,
          totalScore: 7,
          reasoningText: 'Good understanding of amortized cost, clear distinction made.',
          strengths: ['Correct O(N) and O(1) values', 'Concise explanation'],
          improvements: ['Could elaborate on why doubling occurs exponentially less often'],
          reviewRequired: false,
          evaluatedAt: '2026-11-11T10:42:00Z'
        }
      },
      Q4: {
        questionId: 'Q4',
        type: 'image_based',
        textAnswer: 'Inserting red node 14 requires checking uncle node color. If uncle is red, color flip occurs. If uncle is black, we do rotation. Then check if root turned red and reset to black.',
        awardedMarks: 11,
        maxMarks: 14,
        aiEvaluation: {
          relevanceScore: 3,
          technicalAccuracyScore: 4,
          reasoningScore: 2.5,
          depthScore: 1.5,
          totalScore: 11,
          reasoningText: 'Correct sequence of checks, slight lack of rotation specifics.',
          strengths: ['Identified uncle check', 'Checked root color invariant'],
          improvements: ['Specify exact Left-Right rotation direction'],
          reviewRequired: false,
          evaluatedAt: '2026-11-11T10:42:10Z'
        }
      },
      Q5: {
        questionId: 'Q5',
        type: 'situational',
        textAnswer: 'I would use LRU with 2Q policy. 2Q separates recently accessed keys from frequently accessed ones using two FIFO/LRU queues. For 16GB, we assign 4GB to queue 1 and 12GB to queue 2. To solve cache stampede, we use Redis mutex lock with 5 second expiry so only one request hits MySQL database when thousands ask for same student mark.',
        awardedMarks: 18,
        maxMarks: 20,
        aiEvaluation: {
          relevanceScore: 4.5,
          technicalAccuracyScore: 5.5,
          reasoningScore: 4.5,
          depthScore: 3.5,
          totalScore: 18,
          reasoningText: 'Solid 2Q architecture with specific memory division and mutex locking.',
          strengths: ['Practical 2Q design', 'Clear stampede solution'],
          improvements: ['Could analyze Zipfian skew behavior in detail'],
          reviewRequired: false,
          evaluatedAt: '2026-11-11T10:42:25Z'
        }
      }
    }
  },
  {
    id: 'ATT-103',
    examId: 'EXM-TN8F29K',
    collegeId: 'COL001',
    studentName: 'Dinesh Karthik R.',
    studentRollNo: '312221104038',
    studentEmail: 'dinesh.k@ssn.edu.in',
    department: 'Computer Science & Engineering',
    startedAt: '2026-11-11T10:01:10Z',
    submittedAt: '2026-11-11T10:43:00Z',
    timeSpentSeconds: 2510,
    status: 'Review Required',
    totalMarksAwarded: 35,
    totalMarksPossible: 50,
    percentage: 70,
    rank: 3,
    passed: true,
    tabSwitchCount: 3,
    malpracticeFlag: true,
    proctoringEvents: [
      {
        id: 'EVT-002',
        attemptId: 'ATT-103',
        studentRollNo: '312221104038',
        studentName: 'Dinesh Karthik R.',
        eventType: 'tab_switched',
        timestamp: '2026-11-11T10:14:02Z',
        details: 'Exited test tab. Focus lost for 24 seconds.',
        severity: 'medium',
        reviewStatus: 'Pending',
        facultyNotes: ''
      },
      {
        id: 'EVT-003',
        attemptId: 'ATT-103',
        studentRollNo: '312221104038',
        studentName: 'Dinesh Karthik R.',
        eventType: 'fullscreen_exited',
        timestamp: '2026-11-11T10:25:40Z',
        details: 'Student pressed Esc to exit fullscreen mode.',
        severity: 'medium',
        reviewStatus: 'Pending',
        facultyNotes: ''
      },
      {
        id: 'EVT-004',
        attemptId: 'ATT-103',
        studentRollNo: '312221104038',
        studentName: 'Dinesh Karthik R.',
        eventType: 'tab_switched',
        timestamp: '2026-11-11T10:31:18Z',
        details: 'Exited test tab. Focus lost for 18 seconds.',
        severity: 'high',
        reviewStatus: 'Pending',
        facultyNotes: ''
      }
    ],
    answers: {
      Q1: { questionId: 'Q1', type: 'multiple_choice', selectedOption: 'O(log N)', isCorrect: true, awardedMarks: 4, maxMarks: 4 },
      Q2: { questionId: 'Q2', type: 'multiple_choice', selectedOption: 'O(1)', isCorrect: false, awardedMarks: 0, maxMarks: 4 },
      Q3: {
        questionId: 'Q3',
        type: 'short_answer',
        textAnswer: 'Amortized time is when you take all operations together and divide by total number. Worst case is just the slowest operation time in worst conditions.',
        awardedMarks: 5,
        maxMarks: 8,
        aiEvaluation: {
          relevanceScore: 1.5,
          technicalAccuracyScore: 1.5,
          reasoningScore: 1,
          depthScore: 1,
          totalScore: 5,
          reasoningText: 'Basic definition provided, but lacked dynamic array context and exponential reallocation explanation.',
          strengths: ['Understands averaging concept'],
          improvements: ['Connect directly to array resizing and memory reallocation'],
          reviewRequired: false,
          evaluatedAt: '2026-11-11T10:44:00Z'
        }
      },
      Q4: {
        questionId: 'Q4',
        type: 'image_based',
        textAnswer: 'In Red-Black trees, root is black and children of red must be black. If inserting 14, rotate left and change node color to keep tree balanced.',
        awardedMarks: 9,
        maxMarks: 14,
        aiEvaluation: {
          relevanceScore: 2.5,
          technicalAccuracyScore: 3,
          reasoningScore: 2,
          depthScore: 1.5,
          totalScore: 9,
          reasoningText: 'Mentioned fundamental invariants but failed to discuss the uncle node color dependency.',
          strengths: ['Identified basic red-black properties'],
          improvements: ['Must mention uncle node condition before selecting rotation vs recoloring'],
          reviewRequired: true,
          evaluatedAt: '2026-11-11T10:44:15Z'
        }
      },
      Q5: {
        questionId: 'Q5',
        type: 'situational',
        textAnswer: 'I would use LRU cache because it is simple and fast. When memory exceeds 16GB, throw away the least recently used keys. Also have a database replica so load is shared.',
        awardedMarks: 17,
        maxMarks: 20,
        aiEvaluation: {
          relevanceScore: 4,
          technicalAccuracyScore: 5,
          reasoningScore: 4,
          depthScore: 4,
          totalScore: 17,
          reasoningText: 'Functional recommendation, though standard LRU is vulnerable to scan pollution and cache stampedes during peaks.',
          strengths: ['Clear LRU explanation', 'Database replica consideration'],
          improvements: ['Address cache stampede prevention (locks/mutex) and Zipfian frequency'],
          reviewRequired: true,
          evaluatedAt: '2026-11-11T10:44:30Z'
        }
      }
    }
  },
  {
    id: 'ATT-104',
    examId: 'EXM-TN8F29K',
    collegeId: 'COL001',
    studentName: 'Shalini Sundar',
    studentRollNo: '312221104102',
    studentEmail: 'shalini.s@ssn.edu.in',
    department: 'Computer Science & Engineering',
    startedAt: '2026-11-11T10:00:45Z',
    submittedAt: '2026-11-11T10:37:20Z',
    timeSpentSeconds: 2195,
    status: 'Evaluated',
    totalMarksAwarded: 32,
    totalMarksPossible: 50,
    percentage: 64,
    rank: 4,
    passed: true,
    tabSwitchCount: 0,
    malpracticeFlag: false,
    proctoringEvents: [],
    answers: {
      Q1: { questionId: 'Q1', type: 'multiple_choice', selectedOption: 'O(log N)', isCorrect: true, awardedMarks: 4, maxMarks: 4 },
      Q2: { questionId: 'Q2', type: 'multiple_choice', selectedOption: '0/1 Knapsack Problem', isCorrect: true, awardedMarks: 4, maxMarks: 4 },
      Q3: {
        questionId: 'Q3',
        type: 'short_answer',
        textAnswer: 'Amortized time is O(1) for adding to array. Worst case is O(N) when array is full and needs copy to new memory space.',
        awardedMarks: 6,
        maxMarks: 8
      },
      Q4: {
        questionId: 'Q4',
        type: 'image_based',
        textAnswer: 'Check if parent is red. If red, do restructuring with rotations to preserve depth balance.',
        awardedMarks: 8,
        maxMarks: 14
      },
      Q5: {
        questionId: 'Q5',
        type: 'situational',
        textAnswer: 'Use LFU caching to keep high frequency items. Limit to 16GB with memcached cluster. Use locks on key creation to prevent duplicate calls.',
        awardedMarks: 10,
        maxMarks: 20
      }
    }
  }
];
