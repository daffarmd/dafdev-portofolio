import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { experiences } from '../../data/experiences';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-white dark:bg-dark-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Work Experience
          </motion.h2>
          <motion.div 
            className="w-20 h-1 bg-primary-600 dark:bg-primary-400 mx-auto mb-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          ></motion.div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-px bg-gray-300 dark:bg-dark-600"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div 
                key={exp.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center shadow-md z-10">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>

                <div className={`md:w-1/2 ${
                  index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12'
                } pb-8`}>
                  <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="text-lg font-medium text-primary-600 dark:text-primary-400 mb-2">{exp.company}</h4>

                    {exp.roles.map((role, i) => (
                      <div key={i} className="mb-4">
                        <div className="flex flex-wrap items-center justify-between mb-1">
                          <h3 className="text-md font-bold text-dark-900 dark:text-white">{role.title}</h3>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                            {role.duration}
                          </span>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                          {role.description.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
