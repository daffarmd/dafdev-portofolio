import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Server, GitBranch } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-dark-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            About Me
          </motion.h2>
          <motion.div 
            className="w-20 h-1 bg-primary-600 dark:bg-primary-400 mx-auto mb-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          ></motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
              Backend Developer with a passion for building robust systems
            </h3>
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <p>
                Hello! I'm Muhammad Daffa Ramadhan, a backend developer with 2 years of experience specializing in Golang and PostgreSQL. I'm passionate about building efficient, scalable, and maintainable backend systems that power modern applications.
              </p>
              <p>
                My journey in software development began with a fascination for solving complex problems and creating systems that can handle millions of requests. I've since worked on various projects ranging from API gateways and microservices to data processing pipelines.
              </p>
              <p>
                I believe in writing clean, testable code and designing systems that are both performant and maintainable. When I'm not coding, you can find me contributing to open-source projects, attending tech meetups, or exploring new technologies.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg shadow-md">
              <Code className="h-10 w-10 text-primary-600 dark:text-primary-400 mb-4" />
              <h4 className="text-xl font-bold text-dark-900 dark:text-white mb-2">Backend Development</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Specialized in building efficient and scalable backend systems using Go.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg shadow-md">
              <Database className="h-10 w-10 text-secondary-500 dark:text-secondary-400 mb-4" />
              <h4 className="text-xl font-bold text-dark-900 dark:text-white mb-2">Database Design</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Expert in designing and optimizing PostgreSQL database schemas.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg shadow-md">
              <Server className="h-10 w-10 text-primary-600 dark:text-primary-400 mb-4" />
              <h4 className="text-xl font-bold text-dark-900 dark:text-white mb-2">Microservices</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Experience in designing and implementing microservice architectures.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg shadow-md">
              <GitBranch className="h-10 w-10 text-secondary-500 dark:text-secondary-400 mb-4" />
              <h4 className="text-xl font-bold text-dark-900 dark:text-white mb-2">CI/CD Pipelines</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Building efficient development workflows with modern CI/CD tools.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;