export const collegeData = {
  generalInfo: {
    name: "Ramachandra College of Engineering",
    founded: 2007,
    location: "Eluru, Andhra Pradesh, India",
    motto: "Illuminating Paths to Knowledge",
    president: "Dr. M. Muralindar Rao",
    website: "www.rcee.com",
    accreditation:
      "National Board of Accreditation (NBA), All India Council for Technical Education (AICTE)",
    totalStudents: 15000,
    undergraduateStudents: 12000,
    graduateStudents: 3000,
    faculty: 50,
    studentFacultyRatio: "60:1",
    campusSize: "10 acres",
  },

  academics: {
    schools: [
      "School of Engineering",
      "Reasearch and Development",
      "School of Computer Science",
      "School of Business",
    ],
    popularMajors: [
      "Computer Science",
      "Engineering",
      "Artificial Intelligence & Data Science",
      "Cybersecurity",
      "Internet of Things",
      "Electronics and Communication",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Business Administration",
      "Management Studies",
    ],
    degreePrograms: {
      undergraduate: 75,
      graduate: 45,
    },
  },

  admissions: {
    applicationDeadlines: {
      fall: "July 24",
      spring: "September 12",
      transfer: "April 25",
    },
    acceptanceRate: "68%",
    averageGPA: 4.0,
    averageSAT: 1320,
    averageACT: 29,
    applicationFee: "₹150",
    contactEmail: "admissions@rcee.in",
    contactPhone: "(+91) 12345 67890",
  },

  tuition: {
    undergraduate: {
      inState: "₹52,000 per year",
      outOfState: "₹1,50,000 per year",
    },
    graduate: {
      inState: "₹30,000 per year",
      outOfState: "₹80,000 per year",
    },
    fees: "₹52,000 per year",
    financialAidPercentage: "72% of students receive aid",
    averageAid: "₹25,500",
  },

  housing: {
    residenceHalls: 12,
    roomTypes: ["Single", "Double", "Triple", "Suite"],
    mealPlans: ["19 meals/week", "14 meals/week", "10 meals/week"],
    housingCost: "$18,000 per academic year",
    freshmenRequirement: "Freshmen are required to live on campus",
  },

  campusLife: {
    studentOrganizations: 200,
    athleticsConference: "Intercollege Competition",
    sportsTeams: 18,
    recreationalFacilities: [
      "Fitness Center",
      "Track",
      "Basketball Courts",
      "Kho-Kho",
      "Badminton Courts",
      "Volleyball Courts",
      "Cricket Ground",
      "Football Ground",
      "Kabbadi Court",
    ],
    traditions: ["Founders Day", "Sankranthi", "College Fest", "Branch Events"],
    diningOptions: [
      "Main Dining Hall",
      "Student Union Food Court",
      "Food Trucks",
    ],
  },

  importantDates: {
    fallSemesterStart: "August 18",
    fallSemesterEnd: "January 29",
    springSemesterStart: "February 2",
    springSemesterEnd: "May 30",
    springBreak: "10-17",
    commencement: "June 15",
  },
};

export const quickReplies = [
  { id: "q1", text: "Admission Requirements", query: "What are the admission requirements?" },
  { id: "q2", text: "Application Deadlines", query: "When are the application deadlines?" },
  { id: "q3", text: "Tuition & Fees", query: "How much is tuition?" },
  { id: "q4", text: "Available Majors", query: "What majors do you offer?" },
  { id: "q5", text: "Campus Housing", query: "Tell me about campus housing" },
  { id: "q6", text: "Financial Aid", query: "How can I get financial aid?" },
];

export function getResponseForQuery(query) {
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes("admission") &&
    (lowerQuery.includes("requirement") || lowerQuery.includes("qualify"))
  ) {
    return `For undergraduate admission to ${collegeData.generalInfo.name}, we look for students with:
• Minimum GPA of ${collegeData.admissions.averageGPA} (average)
• SAT score around ${collegeData.admissions.averageSAT} or ACT score around ${collegeData.admissions.averageACT} (average)
• Strong personal statement
• Extracurricular activities
• Letters of recommendation

Our acceptance rate is ${collegeData.admissions.acceptanceRate}.`;
  }

  if (
    lowerQuery.includes("deadline") ||
    lowerQuery.includes("apply") ||
    (lowerQuery.includes("application") && lowerQuery.includes("due"))
  ) {
    return `Application deadlines for ${collegeData.generalInfo.name}:
• Fall semester: ${collegeData.admissions.applicationDeadlines.fall}
• Spring semester: ${collegeData.admissions.applicationDeadlines.spring}
• Transfer students: ${collegeData.admissions.applicationDeadlines.transfer}

The application fee is ${collegeData.admissions.applicationFee}.`;
  }

  if (
    lowerQuery.includes("tuition") ||
    lowerQuery.includes("cost") ||
    lowerQuery.includes("fee") ||
    lowerQuery.includes("expensive")
  ) {
    return `Tuition rates at ${collegeData.generalInfo.name}:

Undergraduate:
• In-state: ${collegeData.tuition.undergraduate.inState}
• Out-of-state: ${collegeData.tuition.undergraduate.outOfState}

Graduate:
• In-state: ${collegeData.tuition.graduate.inState}
• Out-of-state: ${collegeData.tuition.graduate.outOfState}

Additional fees: ${collegeData.tuition.fees}

${collegeData.tuition.financialAidPercentage} with an average aid package of ${collegeData.tuition.averageAid}.`;
  }

  if (
    lowerQuery.includes("major") ||
    lowerQuery.includes("program") ||
    lowerQuery.includes("degree") ||
    lowerQuery.includes("study")
  ) {
    return `${collegeData.generalInfo.name} offers:
• ${collegeData.academics.degreePrograms.undergraduate} undergraduate programs
• ${collegeData.academics.degreePrograms.graduate} graduate programs

Our most popular majors include: ${collegeData.academics.popularMajors.join(", ")}.

We have ${collegeData.academics.schools.length} schools/colleges including: ${collegeData.academics.schools.join(", ")}.`;
  }

  if (
    lowerQuery.includes("housing") ||
    lowerQuery.includes("dorm") ||
    lowerQuery.includes("live on campus") ||
    lowerQuery.includes("residence")
  ) {
    return `Campus housing at ${collegeData.generalInfo.name}:
• ${collegeData.housing.residenceHalls} residence halls
• Room types: ${collegeData.housing.roomTypes.join(", ")}
• Cost: ${collegeData.housing.housingCost}
• Meal plans: ${collegeData.housing.mealPlans.join(", ")}

Note: ${collegeData.housing.freshmenRequirement}.`;
  }

  if (
    lowerQuery.includes("financial aid") ||
    lowerQuery.includes("scholarship") ||
    lowerQuery.includes("afford") ||
    lowerQuery.includes("pay for")
  ) {
    return `Financial aid at ${collegeData.generalInfo.name}:
• ${collegeData.tuition.financialAidPercentage}
• Average aid package: ${collegeData.tuition.averageAid}

Types of aid available:
• Merit scholarships
• Need-based grants
• Federal and state loans
• Work-study opportunities

We recommend completing the FAFSA as early as possible. The priority deadline is March 1st.`;
  }

  if (
    lowerQuery.includes("campus life") ||
    lowerQuery.includes("student life") ||
    lowerQuery.includes("activities") ||
    lowerQuery.includes("clubs")
  ) {
    return `Campus life at ${collegeData.generalInfo.name} is vibrant with:
• ${collegeData.campusLife.studentOrganizations} student organizations
• ${collegeData.campusLife.sportsTeams} sports teams in the ${collegeData.campusLife.athleticsConference}
• Recreational facilities including: ${collegeData.campusLife.recreationalFacilities.join(", ")}
• Dining options: ${collegeData.campusLife.diningOptions.join(", ")}
• Annual traditions: ${collegeData.campusLife.traditions.join(", ")}`;
  }

  if (
    lowerQuery.includes("date") ||
    lowerQuery.includes("calendar") ||
    lowerQuery.includes("semester") ||
    lowerQuery.includes("schedule")
  ) {
    return `Important dates at ${collegeData.generalInfo.name}:
• Fall semester: ${collegeData.importantDates.fallSemesterStart} to ${collegeData.importantDates.fallSemesterEnd}
• Spring semester: ${collegeData.importantDates.springSemesterStart} to ${collegeData.importantDates.springSemesterEnd}
• Spring break: ${collegeData.importantDates.springBreak}
• Commencement: ${collegeData.importantDates.commencement}`;
  }

  if (
    lowerQuery.includes("about") ||
    lowerQuery.includes("tell me about") ||
    lowerQuery.includes("overview") ||
    lowerQuery.includes("general")
  ) {
    return `${collegeData.generalInfo.name} is a comprehensive university founded in ${collegeData.generalInfo.founded} located in ${collegeData.generalInfo.location}.

Our motto is "${collegeData.generalInfo.motto}." We have approximately ${collegeData.generalInfo.totalStudents} students (${collegeData.generalInfo.undergraduateStudents} undergraduate and ${collegeData.generalInfo.graduateStudents} graduate) and ${collegeData.generalInfo.faculty} faculty members, creating a student-to-faculty ratio of ${collegeData.generalInfo.studentFacultyRatio}.

Our beautiful campus spans ${collegeData.generalInfo.campusSize} and is accredited by the ${collegeData.generalInfo.accreditation}.`;
  }

  if (
    lowerQuery.includes("contact") ||
    lowerQuery.includes("phone") ||
    lowerQuery.includes("email") ||
    lowerQuery.includes("reach")
  ) {
    return `Contact information for ${collegeData.generalInfo.name}:

Admissions Office:
• Email: ${collegeData.admissions.contactEmail}
• Phone: ${collegeData.admissions.contactPhone}

Main website: ${collegeData.generalInfo.website}

Campus location: ${collegeData.generalInfo.location}`;
  }

  return `Thank you for your question about "${query}". I don't have specific information on that topic yet. 

For more detailed assistance, you can:
• Visit our website at ${collegeData.generalInfo.website}
• Contact our admissions office at ${collegeData.admissions.contactEmail} or ${collegeData.admissions.contactPhone}
• Try asking about admission requirements, tuition, majors, housing, or campus life.`;
}
