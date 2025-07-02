import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/skills';

const Skills: React.FC = () => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categoryTitles = {
    backend: 'Backend',
    database: 'Database',
    devops: 'DevOps',
    other: 'Other Skills'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Technical Skills
          </motion.h2>
          <motion.div 
            className="w-20 h-1 bg-primary-600 dark:bg-primary-400 mx-auto mb-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.p 
            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            My technical expertise is focused on backend development with Golang and PostgreSQL,
            complemented by various other technologies in my stack.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <motion.div 
              key={category}
              className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-6">
                {categoryTitles[category as keyof typeof categoryTitles]}
              </h3>
              <div className="space-y-6">
                {categorySkills.map((skill) => (
                  <motion.div key={skill.id} variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-dark-800 dark:text-white font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.level === 5 ? 'Expert' : 
                         skill.level === 4 ? 'Advanced' :
                         skill.level === 3 ? 'Intermediate' :
                         skill.level === 2 ? 'Basic' : 'Beginner'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-dark-600 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          category === 'backend' || category === 'other' 
                            ? 'bg-primary-600 dark:bg-primary-500' 
                            : 'bg-secondary-500 dark:bg-secondary-400'
                        }`} 
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-4">Always Learning</h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Currently exploring Rust and expanding my knowledge in distributed systems and cloud-native technologies.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;