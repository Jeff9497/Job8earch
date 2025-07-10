import axios from 'axios';

// Reed API configuration from environment variables
const REED_API_KEY = import.meta.env.VITE_REED_API_KEY;
const REED_BASE_URL = 'https://www.reed.co.uk/api/1.0';

// Create axios instance with Reed API configuration
const reedApi = axios.create({
  baseURL: REED_BASE_URL,
  auth: {
    username: REED_API_KEY,
    password: ''
  },
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fallback to mock data when API fails
const MOCK_JOBS = [
  {
    job_id: '1',
    job_title: 'Senior Software Developer',
    employer_name: 'TechCorp Ltd',
    job_city: 'London',
    job_country: 'UK',
    job_description: 'We are looking for a Senior Software Developer to join our dynamic team. You will be responsible for developing high-quality software solutions using modern technologies.',
    job_apply_link: '#',
    job_employment_type: 'FULLTIME',
    job_min_salary: 60000,
    job_max_salary: 80000,
    job_posted_at_datetime_utc: new Date().toISOString()
  },
  {
    job_id: '2',
    job_title: 'Product Manager',
    employer_name: 'Innovation Inc',
    job_city: 'Manchester',
    job_country: 'UK',
    job_description: 'Join our product team as a Product Manager. You will drive product strategy, work with cross-functional teams, and deliver exceptional user experiences.',
    job_apply_link: '#',
    job_employment_type: 'FULLTIME',
    job_min_salary: 50000,
    job_max_salary: 70000,
    job_posted_at_datetime_utc: new Date().toISOString()
  },
  {
    job_id: '3',
    job_title: 'UX Designer',
    employer_name: 'Design Studio',
    job_city: 'Birmingham',
    job_country: 'UK',
    job_description: 'We are seeking a talented UX Designer to create intuitive and engaging user experiences. You will work closely with product and engineering teams.',
    job_apply_link: '#',
    job_employment_type: 'FULLTIME',
    job_min_salary: 40000,
    job_max_salary: 55000,
    job_posted_at_datetime_utc: new Date().toISOString()
  },
  {
    job_id: '4',
    job_title: 'Data Scientist',
    employer_name: 'Analytics Pro',
    job_city: 'Edinburgh',
    job_country: 'UK',
    job_description: 'Looking for a Data Scientist to analyze complex datasets and provide actionable insights. Experience with Python, R, and machine learning required.',
    job_apply_link: '#',
    job_employment_type: 'FULLTIME',
    job_min_salary: 55000,
    job_max_salary: 75000,
    job_posted_at_datetime_utc: new Date().toISOString()
  },
  {
    job_id: '5',
    job_title: 'Marketing Manager',
    employer_name: 'Growth Agency',
    job_city: 'Bristol',
    job_country: 'UK',
    job_description: 'Join our marketing team as a Marketing Manager. You will develop and execute marketing strategies to drive brand awareness and customer acquisition.',
    job_apply_link: '#',
    job_employment_type: 'FULLTIME',
    job_min_salary: 45000,
    job_max_salary: 60000,
    job_posted_at_datetime_utc: new Date().toISOString()
  }
];

/**
 * Search for jobs - using mock data to avoid CORS issues
 * @param {Object} params - Search parameters
 * @param {string} params.keywords - Job keywords to search for
 * @param {string} params.locationName - Location to search in
 * @param {number} params.resultsToTake - Number of results to return
 * @param {number} params.resultsToSkip - Number of results to skip for pagination
 * @returns {Promise} API response with job listings
 */
export const searchJobs = async (params = {}) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { keywords = '', locationName = '', resultsToTake = 20, resultsToSkip = 0 } = params;

    // Filter mock jobs based on search criteria
    let filteredJobs = MOCK_JOBS;

    if (keywords) {
      const searchTerm = keywords.toLowerCase();
      filteredJobs = MOCK_JOBS.filter(job =>
        job.job_title.toLowerCase().includes(searchTerm) ||
        job.job_description.toLowerCase().includes(searchTerm) ||
        job.employer_name.toLowerCase().includes(searchTerm)
      );
    }

    if (locationName) {
      const locationTerm = locationName.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.job_city.toLowerCase().includes(locationTerm) ||
        job.job_country.toLowerCase().includes(locationTerm)
      );
    }

    // Apply pagination
    const startIndex = resultsToSkip;
    const endIndex = startIndex + resultsToTake;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    // Convert to Reed API format for compatibility
    const convertedJobs = paginatedJobs.map(job => ({
      jobId: job.job_id,
      jobTitle: job.job_title,
      employerName: job.employer_name,
      locationName: `${job.job_city}, ${job.job_country}`,
      jobDescription: job.job_description,
      jobUrl: job.job_apply_link,
      minimumSalary: job.job_min_salary,
      maximumSalary: job.job_max_salary,
      fullTime: job.job_employment_type === 'FULLTIME',
      partTime: job.job_employment_type === 'PARTTIME',
      permanent: true,
      contract: false,
      temp: false,
      date: job.job_posted_at_datetime_utc
    }));

    return {
      success: true,
      data: { results: convertedJobs, totalResults: filteredJobs.length },
      totalResults: filteredJobs.length,
      jobs: convertedJobs
    };
  } catch (error) {
    console.error('Job Search Error:', error);
    return {
      success: false,
      error: 'Failed to fetch jobs. Please try again.',
      jobs: []
    };
  }
};

/**
 * Get job details by ID
 * @param {string} jobId - Job ID
 * @returns {Promise} Job details
 */
export const getJobDetails = async (jobId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const job = MOCK_JOBS.find(j => j.job_id === jobId);

    if (job) {
      return {
        success: true,
        data: job
      };
    } else {
      return {
        success: false,
        error: 'Job not found'
      };
    }
  } catch (error) {
    console.error('Job Details Error:', error);
    return {
      success: false,
      error: 'Failed to fetch job details'
    };
  }
};

/**
 * Get popular job categories and locations
 * This is a helper function to provide common search options
 */
export const getJobCategories = () => {
  return [
    'Software Developer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'Marketing Manager',
    'Sales Executive',
    'Business Analyst',
    'Project Manager',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'QA Engineer',
    'Cybersecurity Specialist'
  ];
};

export const getPopularLocations = () => {
  return [
    'London',
    'Manchester',
    'Birmingham',
    'Leeds',
    'Glasgow',
    'Bristol',
    'Edinburgh',
    'Liverpool',
    'Newcastle',
    'Sheffield',
    'Remote',
    'Hybrid'
  ];
};

/**
 * Format salary for display
 * @param {number} min - Minimum salary
 * @param {number} max - Maximum salary
 * @returns {string} Formatted salary string
 */
export const formatSalary = (min, max) => {
  if (!min && !max) return 'Salary not specified';
  if (min && max) return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
  if (min) return `From £${min.toLocaleString()}`;
  if (max) return `Up to £${max.toLocaleString()}`;
};

/**
 * Format job type for display
 * @param {Object} job - Job object from Reed API
 * @returns {string} Formatted job type
 */
export const formatJobType = (job) => {
  const types = [];
  if (job.fullTime) types.push('Full-time');
  if (job.partTime) types.push('Part-time');
  if (job.permanent) types.push('Permanent');
  if (job.contract) types.push('Contract');
  if (job.temp) types.push('Temporary');
  
  return types.length > 0 ? types.join(', ') : 'Not specified';
};
