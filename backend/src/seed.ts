import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mentor from './models/Mentor';

dotenv.config();

const sampleMentors = [
  {
    name: "Arjun Patel",
    role: "Blockchain Developer",
    company: "Polygon",
    batch: 2021,
    branch: "CSE",
    location: "Bangalore",
    expertise: ["Solidity", "Web3.js", "Smart Contracts", "DeFi", "Ethereum"],
    imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Priya Sharma",
    role: "Data Engineer",
    company: "Amazon",
    batch: 2020,
    branch: "CSE",
    location: "Hyderabad",
    expertise: ["Apache Spark", "Python", "AWS", "Data Pipelines", "SQL"],
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Rahul Verma",
    role: "DevOps Engineer",
    company: "Microsoft",
    batch: 2019,
    branch: "IT",
    location: "Noida",
    expertise: ["Kubernetes", "Docker", "CI/CD", "AWS", "Infrastructure as Code"],
    imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Neha Gupta",
    role: "ML Engineer",
    company: "Google",
    batch: 2018,
    branch: "CSE",
    location: "Bangalore",
    expertise: ["TensorFlow", "PyTorch", "Deep Learning", "Computer Vision", "NLP"],
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Vikram Malhotra",
    role: "AI Engineer",
    company: "OpenAI",
    batch: 2017,
    branch: "CSE",
    location: "Pune",
    expertise: ["Large Language Models", "Reinforcement Learning", "Neural Networks", "Python"],
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Anjali Desai",
    role: "Product Manager",
    company: "Flipkart",
    batch: 2016,
    branch: "ECE",
    location: "Bangalore",
    expertise: ["Product Strategy", "Agile", "User Research", "Data Analytics", "Go-to-Market"],
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Karthik Krishnan",
    role: "Data Analyst",
    company: "PhonePe",
    batch: 2020,
    branch: "IT",
    location: "Mumbai",
    expertise: ["SQL", "Python", "Data Visualization", "Statistical Analysis", "Power BI"],
    imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Riya Reddy",
    role: "Data Scientist",
    company: "IBM",
    batch: 2019,
    branch: "CSE",
    location: "Hyderabad",
    expertise: ["Machine Learning", "Statistics", "Python", "R", "Data Mining"],
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Aditya Kumar",
    role: "DSA Expert",
    company: "Goldman Sachs",
    batch: 2018,
    branch: "CSE",
    location: "Gurugram",
    expertise: ["Algorithms", "Data Structures", "System Design", "Problem Solving", "C++"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Shreya Iyer",
    role: "Full Stack Developer",
    company: "Swiggy",
    batch: 2021,
    branch: "IT",
    location: "Bangalore",
    expertise: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Rohan Mehta",
    role: "Backend Developer",
    company: "Razorpay",
    batch: 2020,
    branch: "CSE",
    location: "Bangalore",
    expertise: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "System Design"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Ananya Singh",
    role: "Frontend Developer",
    company: "MakeMyTrip",
    batch: 2019,
    branch: "IT",
    location: "Gurugram",
    expertise: ["React", "Vue.js", "JavaScript", "CSS", "Web Performance"],
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Divya Kapoor",
    role: "UI/UX Designer",
    company: "Ola",
    batch: 2020,
    branch: "ECE",
    location: "Mumbai",
    expertise: ["Figma", "User Research", "Interaction Design", "Wireframing", "Design Systems"],
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Siddharth Nair",
    role: "Cloud Architect",
    company: "Infosys",
    batch: 2017,
    branch: "CSE",
    location: "Pune",
    expertise: ["AWS", "Azure", "Cloud Architecture", "DevOps", "Serverless"],
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Kavita Menon",
    role: "Security Engineer",
    company: "PayPal",
    batch: 2018,
    branch: "IT",
    location: "Hyderabad",
    expertise: ["Application Security", "Penetration Testing", "Cryptography", "Security Architecture"],
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Rajesh Khanna",
    role: "Engineering Manager",
    company: "Uber",
    batch: 2016,
    branch: "CSE",
    location: "Gurugram",
    expertise: ["Team Leadership", "System Design", "Project Management", "Agile", "Mentoring"],
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
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