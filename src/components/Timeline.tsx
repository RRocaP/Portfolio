import React from 'react';

interface TimelineItem {
  year: string;
  institution: string;
  degree: string;
  description: string;
  location: string;
}

interface TimelineProps {
  lang?: 'en' | 'es' | 'ca';
  strings?: any;
}

const Timeline: React.FC<TimelineProps> = ({ lang = 'en', strings }) => {
  // Default timeline data - this could be passed as props from the parent
  const defaultTimelineData: TimelineItem[] = [
    {
      year: '2020-Present',
      institution:
        strings?.timeline?.institutions?.uab ||
        'Autonomous University of Barcelona',
      degree: 'PhD in Biotechnology',
      description:
        'Autonomous University of Barcelona - Developing next-generation antimicrobial therapies',
      location: 'Barcelona, Spain',
    },
    {
      year: '2018-2020',
      institution: 'UC Irvine',
      degree: 'Master of Science in Biotechnology',
      description:
        'University of California, Irvine - Focus on molecular biotechnology and bioinformatics',
      location: 'Irvine, CA, USA',
    },
  ];

  const timelineData = defaultTimelineData;

  return (
    <section id="timeline" className="col-span-12 py-24 bg-surface-1">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-sans text-display-md text-center mb-16 text-balance">
          {strings?.timeline?.title || 'Academic Journey'}
        </h2>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>

          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <div key={index} className="relative flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-yellow rounded-full border-4 border-primary-bg flex items-center justify-center relative z-10">
                  <div className="w-2 h-2 bg-on-accent-text rounded-full"></div>
                </div>

                <div className="ml-8 flex-1">
                  <div className="bg-surface-1 border border-border rounded-sm p-6 hover:border-accent-yellow/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h3 className="font-sans text-heading-lg text-accent-yellow mb-2 md:mb-0">
                        {item.degree}
                      </h3>
                      <span className="text-sm text-text-muted bg-surface-1 px-3 py-1 rounded border border-border">
                        {item.year}
                      </span>
                    </div>

                    <h4 className="text-body-lg font-medium text-body-text mb-2">
                      {item.institution}
                    </h4>

                    <p className="text-text-muted mb-2 prose">
                      {item.description}
                    </p>

                    <p className="text-sm text-text-muted">
                      📍 {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
