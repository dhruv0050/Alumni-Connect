import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mentor from './models/Mentor';

dotenv.config();

const defaultPrivacySettings = {
  email: true,
  phone: false,
  location: true,
  socialLinks: true,
  experience: true,
  education: true
};

const generateSocialLinks = (name: string) => {
  const username = name.toLowerCase().replace(/\s+/g, '');
  return {
    linkedin: `https://linkedin.com/in/${username}`,
    github: `https://github.com/${username}`,
    twitter: `https://twitter.com/${username}`,
    website: `https://${username}.dev`
  };
};

const createMentor = (
  name: string,
  email: string,
  role: string,
  company: string,
  batch: number,
  branch: string,
  location: string,
  expertise: string[],
  imageUrl: string,
  bio: string
) => ({
  name,
  email,
  role,
  company,
  batch,
  branch,
  location,
  expertise,
  imageUrl,
  bio,
  education: [{
    degree: `B.Tech in ${branch === 'CSE' ? 'Computer Science' : branch === 'IT' ? 'Information Technology' : 'Electronics and Communication'}`,
    institution: "Jamia Millia Islamia, New Delhi",
    year: batch
  }],
  privacySettings: defaultPrivacySettings,
  socialLinks: generateSocialLinks(name),
  experience: [{
    title: role,
    company,
    startDate: new Date(`${batch}-06-01`),
    description: bio.split('.')[0] + '.'
  }]
});

const sampleMentors = [
  createMentor(
    "Arjun Patel",
    "arjun.patel@polygon.technology",
    "Blockchain Developer",
    "Polygon",
    2021,
    "CSE",
    "Bangalore",
    ["Solidity", "Web3.js", "Smart Contracts", "DeFi", "Ethereum"],
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Passionate blockchain developer with expertise in DeFi and smart contract development. Committed to building secure and scalable decentralized applications. Currently working on innovative blockchain solutions at Polygon."
  ),
  createMentor(
    "Priya Sharma",
    "priya.sharma@amazon.com",
    "Data Engineer",
    "Amazon",
    2020,
    "CSE",
    "Hyderabad",
    ["Apache Spark", "Python", "AWS", "Data Pipelines", "SQL"],
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Experienced data engineer specializing in building robust data pipelines and analytics solutions. Strong background in big data technologies and cloud platforms. Passionate about solving complex data challenges at scale."
  ),
  createMentor(
    "Rahul Verma",
    "rahul.verma@microsoft.com",
    "DevOps Engineer",
    "Microsoft",
    2019,
    "IT",
    "Noida",
    ["Kubernetes", "Docker", "CI/CD", "AWS", "Infrastructure as Code"],
    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "DevOps practitioner focused on automating and optimizing deployment pipelines. Expert in containerization and cloud infrastructure. Committed to improving development workflows and system reliability."
  ),
  createMentor(
    "Neha Gupta",
    "neha.gupta@google.com",
    "ML Engineer",
    "Google",
    2018,
    "CSE",
    "Bangalore",
    ["TensorFlow", "PyTorch", "Deep Learning", "Computer Vision", "NLP"],
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Machine learning engineer with deep expertise in computer vision and NLP. Passionate about developing AI solutions that solve real-world problems. Currently working on cutting-edge ML projects at Google."
  ),
  createMentor(
    "Vikram Malhotra",
    "vikram.malhotra@openai.com",
    "AI Engineer",
    "OpenAI",
    2017,
    "CSE",
    "Pune",
    ["Large Language Models", "Reinforcement Learning", "Neural Networks", "Python"],
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "AI researcher and engineer specializing in large language models and reinforcement learning. Dedicated to pushing the boundaries of artificial intelligence and developing innovative AI solutions."
  ),
  createMentor(
    "Anjali Desai",
    "anjali.desai@flipkart.com",
    "Product Manager",
    "Flipkart",
    2016,
    "ECE",
    "Bangalore",
    ["Product Strategy", "Agile", "User Research", "Data Analytics", "Go-to-Market"],
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Strategic product manager with a strong technical background. Experienced in leading cross-functional teams and delivering user-centric products. Passionate about creating impactful digital solutions."
  ),
  createMentor(
    "Karthik Krishnan",
    "karthik.krishnan@phonepe.com",
    "Data Analyst",
    "PhonePe",
    2020,
    "IT",
    "Mumbai",
    ["SQL", "Python", "Data Visualization", "Statistical Analysis", "Power BI"],
    "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Data analyst with expertise in statistical analysis and visualization. Skilled at transforming complex data into actionable insights. Passionate about using data to drive business decisions."
  ),
  createMentor(
    "Riya Reddy",
    "riya.reddy@ibm.com",
    "Data Scientist",
    "IBM",
    2019,
    "CSE",
    "Hyderabad",
    ["Machine Learning", "Statistics", "Python", "R", "Data Mining"],
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Data scientist with strong foundation in machine learning and statistical analysis. Experienced in developing predictive models and extracting insights from large datasets. Passionate about data-driven decision making."
  ),
  createMentor(
    "Aditya Kumar",
    "aditya.kumar@gs.com",
    "DSA Expert",
    "Goldman Sachs",
    2018,
    "CSE",
    "Gurugram",
    ["Algorithms", "Data Structures", "System Design", "Problem Solving", "C++"],
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Expert in data structures and algorithms with deep knowledge of system design. Experienced in optimizing complex systems and mentoring developers. Passionate about solving challenging technical problems."
  ),
  createMentor(
    "Shreya Iyer",
    "shreya.iyer@swiggy.in",
    "Full Stack Developer",
    "Swiggy",
    2021,
    "IT",
    "Bangalore",
    ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Full stack developer with expertise in modern web technologies. Experienced in building scalable applications using React and Node.js. Passionate about creating efficient and user-friendly web solutions."
  ),
  createMentor(
    "Rohan Mehta",
    "rohan.mehta@razorpay.com",
    "Backend Developer",
    "Razorpay",
    2020,
    "CSE",
    "Bangalore",
    ["Java", "Spring Boot", "Microservices", "PostgreSQL", "System Design"],
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Backend developer specializing in microservices architecture and distributed systems. Experienced in building scalable and reliable server-side applications. Passionate about system design and performance optimization."
  ),
  createMentor(
    "Ananya Singh",
    "ananya.singh@makemytrip.com",
    "Frontend Developer",
    "MakeMyTrip",
    2019,
    "IT",
    "Gurugram",
    ["React", "Vue.js", "JavaScript", "CSS", "Web Performance"],
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Frontend developer with expertise in modern JavaScript frameworks. Focused on creating responsive and performant web interfaces. Passionate about delivering exceptional user experiences."
  ),
  createMentor(
    "Divya Kapoor",
    "divya.kapoor@ola.com",
    "UI/UX Designer",
    "Ola",
    2020,
    "ECE",
    "Mumbai",
    ["Figma", "User Research", "Interaction Design", "Wireframing", "Design Systems"],
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Creative UI/UX designer with a user-centered approach. Experienced in creating intuitive and engaging digital experiences. Passionate about design systems and interaction design."
  ),
  createMentor(
    "Siddharth Nair",
    "siddharth.nair@infosys.com",
    "Cloud Architect",
    "Infosys",
    2017,
    "CSE",
    "Pune",
    ["AWS", "Azure", "Cloud Architecture", "DevOps", "Serverless"],
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Experienced cloud architect specializing in AWS and Azure platforms. Expert in designing scalable and secure cloud infrastructure. Passionate about serverless architecture and cloud-native solutions."
  ),
  createMentor(
    "Kavita Menon",
    "kavita.menon@paypal.com",
    "Security Engineer",
    "PayPal",
    2018,
    "IT",
    "Hyderabad",
    ["Application Security", "Penetration Testing", "Cryptography", "Security Architecture"],
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Security engineer focused on application security and penetration testing. Expert in identifying and mitigating security vulnerabilities. Passionate about building secure and resilient systems."
  ),
  createMentor(
    "Rajesh Khanna",
    "rajesh.khanna@uber.com",
    "Engineering Manager",
    "Uber",
    2016,
    "CSE",
    "Gurugram",
    ["Team Leadership", "System Design", "Project Management", "Agile", "Mentoring"],
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "Seasoned engineering manager with strong technical leadership experience. Skilled in team building and project management. Passionate about mentoring engineers and driving technical excellence."
  )
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing mentors
    await Mentor.deleteMany({});
    console.log('Cleared existing mentors');

    // Insert sample mentors
    await Mentor.insertMany(sampleMentors);
    console.log('Sample mentors inserted successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 