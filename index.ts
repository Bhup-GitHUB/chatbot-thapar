import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as readline from 'readline';

config();

if (!process.env.GEMINI_API_KEY) {
  console.log('GEMINI_API_KEY is required in .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const THAPAR_INFO = `
THAPAR UNIVERSITY INFORMATION DATABASE:

BASIC INFORMATION:
- Full Name: Thapar Institute of Engineering and Technology (TIET)
- Established: 1956
- Location: Patiala, Punjab, India
- Type: Private University
- Founder: Karam Chand Thapar
- Campus Size: 250 acres
- Status: Deemed University (since 1985)

ACADEMICS:
- Schools: 7 major schools
- Undergraduate Programs: B.E./B.Tech in 15+ branches
- Postgraduate Programs: M.E./M.Tech, MBA, MCA, MSc
- Doctoral Programs: Ph.D. in various disciplines
- Student Strength: 13,000+ students
- Faculty: 400+ faculty members

SCHOOLS & DEPARTMENTS:
1. School of Engineering & Technology
2. School of Computer Science & Engineering  
3. School of Electronics & Electrical Engineering
4. School of Chemical Engineering & Technology
5. School of Mathematics & Computer Applications
6. School of Management & Liberal Arts
7. School of Physics & Materials Science

POPULAR COURSES:
- Computer Science Engineering
- Electronics & Communication Engineering
- Mechanical Engineering
- Civil Engineering
- Chemical Engineering
- Electrical Engineering
- Biotechnology
- MBA
- MCA

RANKINGS & ACCREDITATION:
- NIRF Ranking: Among top 50 engineering colleges
- NBA Accredited programs
- NAAC Grade A
- Member of Association of Indian Universities (AIU)

FACILITIES:
- Central Library with 2+ lakh books
- 24/7 WiFi campus
- Hostels for boys and girls
- Sports complex with swimming pool
- Medical center
- Cafeterias and food courts
- ATMs and banking facilities
- Transportation services

ADMISSION:
- JEE Main scores accepted for B.Tech
- GATE scores for M.Tech
- CAT/MAT for MBA
- University entrance test for some programs
- Application through online portal

PLACEMENT STATISTICS:
- Average Package: 6-8 LPA
- Highest Package: 40+ LPA
- Placement Rate: 85%+
- Top Recruiters: Microsoft, Google, Amazon, TCS, Infosys, Wipro, etc.

NOTABLE ALUMNI:
- Satya Nadella (CEO, Microsoft) - Honorary alumnus
- Kiran Mazumdar-Shaw (Biocon)
- Many successful entrepreneurs and industry leaders

CONTACT:
- Address: Thapar Institute of Engineering & Technology, Patiala-147004, Punjab
- Phone: +91-175-2393021
- Website: thapar.edu
- Email: info@thapar.edu

CAMPUS LIFE:
- Cultural festivals: Ojas (tech fest), Aarohi (cultural fest)
- 50+ student clubs and societies
- Sports teams and competitions  
- Annual events and celebrations
- Industry visits and internships

RESEARCH:
- Research centers in emerging technologies
- Collaborations with international universities
- Patents and publications
- Funded research projects
- Innovation and incubation center
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function formatResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '- $1')
    .trim();
}

async function getThaparAnswer(question: string): Promise<string> {
  try {
    const prompt = `You are a chatbot providing information about Thapar University (TIET).

KNOWLEDGE BASE:
${THAPAR_INFO}

USER QUESTION: ${question}

INSTRUCTIONS:
- Answer only about Thapar University using the provided information
- Be clear and informative
- If information is not in the knowledge base, say "I don't have that specific information about Thapar University"
- Keep responses concise but helpful
- Use bullet points for lists

Provide a helpful answer:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return formatResponse(response);
  } catch (error: any) {
    return `Error getting information: ${error.message}`;
  }
}

function printWelcome(): void {
  console.log('\nWelcome to Thapar University Information Chatbot');
  console.log('Ask me anything about Thapar Institute of Engineering & Technology');
  console.log('Examples: admissions, placements, courses, facilities, rankings');
  console.log('Type "exit" to quit, "help" for more options\n');
}

function printHelp(): void {
  console.log('\nYou can ask about:');
  console.log('Basic Information (establishment, location, history)');
  console.log('Academics (courses, schools, programs)');
  console.log('Admissions (eligibility, process, entrance exams)');
  console.log('Placements (statistics, companies, packages)');
  console.log('Facilities (hostels, library, sports, campus)');
  console.log('Rankings and Accreditation');
  console.log('Campus Life (festivals, clubs, events)');
  console.log('Alumni and Notable Graduates');
  console.log('Contact Information\n');
}

async function startChat(): Promise<void> {
  printWelcome();

  const askQuestion = () => {
    rl.question('Ask about Thapar: ', async (input) => {
      const question = input.trim().toLowerCase();

      if (question === 'exit' || question === 'quit') {
        console.log('\nThanks for using Thapar University Chatbot');
        rl.close();
        return;
      }

      if (question === 'help') {
        printHelp();
        askQuestion();
        return;
      }

      if (question === 'clear') {
        console.clear();
        printWelcome();
        askQuestion();
        return;
      }

      if (!question) {
        console.log('Please ask a question about Thapar University\n');
        askQuestion();
        return;
      }

      console.log('\nThinking...');
      const answer = await getThaparAnswer(input);
      console.log('\n' + answer + '\n');
      askQuestion();
    });
  };

  askQuestion();
}

process.on('SIGINT', () => {
  console.log('\nGoodbye! Thanks for using Thapar University Chatbot');
  process.exit(0);
});

console.log('Starting Thapar University Chatbot...');
startChat().catch(console.error);
