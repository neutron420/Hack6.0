"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Github, Linkedin, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const TeamPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: "Ritesh Kumar Singh",
      role: "Full Stack Web Developer & DevOps Engineer",
      img: "/members/member1.jpg",
      github: "https://github.com/neutron420",
      linkedin: "https://www.linkedin.com/in/ritesh-singh1/",
      bio: "Building LLM Q&A from the ground up. Passionate about scalable architecture and developer experience.",
    },
    {
      name: "Ashutosh Kumar",
      role: "AI/ML Engineer & Frontend Developer",
      img: "/members/member2.jpg",
      github: "https://github.com/ashutosh7484",
      linkedin: "https://www.linkedin.com/in/ashutosh-kumar-083860291/",
      bio: "Designing intuitive and beautiful user experiences, making sure LLM Q&A is a joy to use.",
    },
    {
      name: "Archita Bhalotia",
      role: "UI/UX & Backend Engineer",
      img: "/members/member3.jpg",
      github: "https://github.com/archita-debug",
      linkedin: "https://www.linkedin.com/in/archita-bhalotia-15b8382a5/",
      bio: "Focused on building robust APIs and ensuring the LLM Q&A platform runs smoothly under heavy load.",
    },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      {/* Hero */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <Users className="w-14 h-14 mx-auto mb-5 text-green-600" />
          <h1 className="text-4xl sm:text-5xl font-bold">Meet the Team</h1>
          <p className="mt-4 max-w-3xl mx-auto text-gray-600 text-lg">
            The people who make LLM Q&A possible — building, designing, and improving every single day.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 bg-gray-50 flex-grow">
        <div className="max-w-6xl mx-auto grid gap-12 sm:grid-cols-2 md:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-500 mb-4">{member.role}</p>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">{member.bio}</p>
              <div className="flex justify-center gap-4">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
