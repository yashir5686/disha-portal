import type { QuizQuestion } from "@/ai/flows/get-quiz-questions";
import type { PersonalizedStreamRecommendationOutput } from "@/ai/flows/personalized-stream-recommendation-from-quiz";

export const DEMO_USER_EMAIL = "yashir5686@gmail.com";

export const DEMO_QUESTIONS: QuizQuestion[] = [
    {
        id: "q1_scenario_project",
        type: "single-choice",
        question: "For a project, you'd rather...",
        options: [
            { id: "q1o1", value: "Build a physical model." },
            { id: "q1o2", value: "Write code to simulate it." },
            { id: "q1o3", value: "Research and write a report." },
            { id: "q1o4", value: "Organize the team's tasks." },
        ],
    },
    {
        id: "q2_scenario_problem",
        type: "single-choice",
        question: "When facing a tough math problem, you...",
        options: [
            { id: "q2o1", value: "Try different formulas." },
            { id: "q2o2", value: "Draw diagrams to visualize it." },
            { id: "q2o3", value: "Ask a friend for the answer." },
            { id: "q2o4", value: "Look for a similar solved example." },
        ],
    },
    {
        id: "q3_scenario_computer",
        type: "single-choice",
        question: "In the computer lab, you enjoy...",
        options: [
            { id: "q3o1", value: "Solving logic puzzles with code." },
            { idும்: "q3o2", value: "Designing a presentation." },
            { id: "q3o3", value: "Typing and formatting documents." },
            { id: "q3o4", value: "Troubleshooting hardware issues." },
        ],
    },
    {
        id: "q4_scenario_fair",
        type: "single-choice",
        question: "At a science fair, you're most drawn to...",
        options: [
            { id: "q4o1", value: "Projects with clever mechanisms." },
            { id: "q4o2", value: "Software and robotics projects." },
            { id: "q4o3", value: "Environmental science projects." },
            { id: "q4o4", value: "The way results are presented." },
        ],
    },
    {
        id: "q5_scenario_hobby",
        type: "single-choice",
        question: "As a hobby, you'd prefer...",
        options: [
            { id: "q5o1", value: "Assembling a PC or gadget." },
            { id: "q5o2", value: "Learning a new programming language." },
            { id: "q5o3", value: "Reading historical fiction." },
            { id: "q5o4", value: "Starting a small online business." },
        ],
    },
    {
        id: "q6_likert_problem",
        type: "single-choice",
        question: "I enjoy breaking complex problems into smaller, logical steps.",
        options: [
            { id: "q6o1", value: "Strongly Disagree" },
            { id: "q6o2", value: "Disagree" },
            { id: "q6o3", value: "Neutral" },
            { id: "q6o4", value: "Agree" },
            { id: "q6o5", value: "Strongly Agree" },
        ],
    },
    {
        id: "q7_likert_details",
        type: "single-choice",
        question: "I prefer clear, structured tasks over open-ended creative projects.",
        options: [
            { id: "q7o1", value: "Strongly Disagree" },
            { id: "q7o2", value: "Disagree" },
            { id: "q7o3", value: "Neutral" },
            { id: "q7o4", value: "Agree" },
            { id: "q7o5", value: "Strongly Agree" },
        ],
    },
    {
        id: "q8_likert_reverse",
        type: "single-choice",
        question: "I find long periods of writing and reading essays to be draining.",
        options: [
            { id: "q8o1", value: "Strongly Disagree" },
            { id: "q8o2", value: "Disagree" },
            { id: "q8o3", value: "Neutral" },
            { id: "q8o4", value: "Agree" },
            { id: "q8o5", value: "Strongly Agree" },
        ],
    },
    {
        id: "q9_likert_tech",
        type: "single-choice",
        question: "I am excited by the latest advancements in technology and AI.",
        options: [
            { id: "q9o1", value: "Strongly Disagree" },
            { id: "q9o2", value: "Disagree" },
            { id: "q9o3", value: "Neutral" },
            { id: "q9o4", value: "Agree" },
            { id: "q9o5", value: "Strongly Agree" },
        ],
    },
    {
        id: "q10_skill_logic",
        type: "single-choice",
        question: "To find a bug in a program, which is the best first step?",
        options: [
            { id: "q10o1", value: "Rewrite the entire code." },
            { id: "q10o2", value: "Add print statements to check values." },
            { id: "q10o3", value: "Ask someone else to fix it." },
            { id: "q10o4", value: "Change the variable names." },
        ],
    },
    {
        id: "q11_skill_data",
        type: "single-choice",
        question: "To show sales trends over a year, you should use a...",
        options: [
            { id: "q11o1", value: "Pie chart." },
            { id: "q11o2", value: "Line graph." },
            { id: "q11o3",_value: "Flowchart." },
            { id: "q11o4", value: "Simple list of numbers." },
        ],
    },
    {
        id: "q12_skill_ops",
        type: "single-choice",
        question: "Which is most efficient for sorting a large list of names?",
        options: [
            { id: "q12o1", value: "Doing it manually on paper." },
            { id: "q12o2", value: "Using a spreadsheet's sort function." },
            { id: "q12o3", value: "Reading them aloud." },
            { id: "q12o4", value: "Typing them in a plain text file." },
        ],
    },
];

export const DEMO_RECOMMENDATION: PersonalizedStreamRecommendationOutput = {
    recommendationTitle: "Your Recommended Career Path",
    recommendation: "B.Tech in Computer Science and Engineering",
    reasoning: "Your answers indicate a strong aptitude for logical thinking, problem-solving, and technology. You show a clear preference for structured tasks, coding, and understanding how systems work. These traits are an excellent match for the analytical and technical demands of Computer Science and Engineering.",
    interestAnalysis: [
        { area: "Investigative", score: 90, summary: "You enjoy solving complex problems and working with data and logic." },
        { area: "Realistic", score: 80, summary: "You have an interest in technology, machines, and building things." },
        { area: "Conventional", score: 75, summary: "You appreciate structure, data, and clear procedures." },
    ],
    degreeOptions: [
        {
            name: "B.Tech in Computer Science & Engineering (CSE)",
            description: "A comprehensive degree covering programming, algorithms, data structures, AI, and computer networks.",
            careerOptions: {
                privateJobs: ["Software Development Engineer", "Data Scientist", "AI/ML Engineer", "Cybersecurity Analyst"],
                govtJobs: ["Scientist at ISRO/DRDO", "Technical Officer in PSUs", "Cyber Security Officer in Govt."],
                higherEducation: ["M.Tech in CSE/AI", "MS from abroad", "MBA in Technology Management"],
                entrepreneurship: ["SaaS Product Startup", "AI-based Solutions Provider", "Cybersecurity Consultancy"],
            },
        },
        {
            name: "B.Tech in Information Technology (IT)",
            description: "Focuses on the application of computing technology to business and communication needs.",
            careerOptions: {
                privateJobs: ["IT Consultant", "Network Architect", "Cloud Engineer", "Database Administrator"],
                govtJobs: ["IT Officer in Banks (IBPS)", "NIC Scientist", "System Analyst in Govt. Depts."],
                higherEducation: ["M.Tech in IT/Networking", "Specialized certifications (e.g., CCNA, AWS)"],
                entrepreneurship: ["IT Support & Services company", "Cloud consulting firm"],
            },
        },
    ],
    collegeSuggestions: [
        { name: "Indian Institute of Technology (IIT) Bombay", location: "Mumbai, Maharashtra", entranceExam: "JEE Advanced" },
        { name: "National Institute of Technology (NIT) Tiruchirappalli", location: "Tiruchirappalli, Tamil Nadu", entranceExam: "JEE Main" },
        { name: "International Institute of Information Technology (IIIT) Hyderabad", location: "Hyderabad, Telangana", entranceExam: "IIIT-H UGEE / JEE Main" },
        { name: "Delhi Technological University (DTU)", location: "New Delhi, Delhi", entranceExam: "JEE Main" },
    ],
    alternativeRecommendations: [
        "Data Science and Analytics",
        "Robotics and Automation",
        "Electronics and Communication Engineering (ECE)",
    ],
    recommendedCourses: [
        {
            title: "Python for Everybody",
            platform: "Coursera",
            price: "Free to audit",
            link: "https://www.coursera.org/specializations/python",
        },
        {
            title: "Foundations of Data Science",
            platform: "NPTEL",
            price: "Free",
            link: "https://onlinecourses.nptel.ac.in/noc24_cs23/preview",
        },
        {
            title: "Introduction to Algorithms",
            platform: "MIT OpenCourseWare",
            price: "Free",
            link: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/",
        }
    ],
};
