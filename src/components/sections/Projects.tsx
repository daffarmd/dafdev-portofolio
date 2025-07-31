import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import { ExternalLink, Github, Lock, ShieldCheck } from 'lucide-react';

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filterOptions = ['All', 'Golang', 'PostgreSQL', 'Docker', 'Microservices'];

  const filteredProjects = activeFilter && activeFilter !== 'All'
    ? projects.filter(project => project.technologies.includes(activeFilter))
    : projects;

  const renderResourceIcon = (type: string) => {
    switch (type) {
      case 'website':
        return <ExternalLink className="h-5 w-5 mr-2" />;
      case 'app':
        return <ExternalLink className="h-5 w-5 mr-2" />;
      case 'docs':
        return <ExternalLink className="h-5 w-5 mr-2" />;
      default:
        return null;
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-primary-600 dark:bg-primary-400 mx-auto mb-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.p
            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            A selection of my recent backend development work showcasing my expertise in Go, PostgreSQL, and related technologies.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filterOptions.map((filter) => (
              <motion.button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter || (filter === 'All' && activeFilter === null)
                    ? 'bg-primary-600 text-white dark:bg-primary-500'
                    : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
                }`}
                onClick={() => setActiveFilter(filter === 'All' ? null : filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {project.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-dark-900 dark:text-white">{project.title}</h3>
                  <div className="flex items-center space-x-1 text-xs font-semibold">
                    {project.isPrivate ? (
                      <span className="flex items-center text-red-500">
                        <Lock className="w-4 h-4 mr-1" />
                        Private
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <ShieldCheck className="w-4 h-4 mr-1" />
                        Public
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  {!project.isPrivate && project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-dark-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      <span>Source Code</span>
                    </a>
                  )}

                  {project.isPrivate &&
                    project.resources?.map((res) => (
                      <a
                        key={res.type}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-dark-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {renderResourceIcon(res.type)}
                        <span>{capitalize(res.type)}</span>
                      </a>
                    ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
