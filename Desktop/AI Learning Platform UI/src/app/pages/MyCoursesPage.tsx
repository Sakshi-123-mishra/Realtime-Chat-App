import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  hoursSpent: number;
  totalHours: number;
  status: 'in-progress' | 'completed' | 'not-started';
  lastAccessed: string;
}

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Simulate fetching courses from database
    // In production, replace with actual Firestore/API call
    const fetchCourses = async () => {
      setLoading(true);
      
      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data - replace with actual database fetch
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Introduction to Python',
          description: 'Learn Python programming from scratch',
          progress: 75,
          hoursSpent: 15,
          totalHours: 20,
          status: 'in-progress',
          lastAccessed: '2 days ago',
        },
        {
          id: '2',
          title: 'Web Development Fundamentals',
          description: 'Master HTML, CSS, and JavaScript',
          progress: 100,
          hoursSpent: 25,
          totalHours: 25,
          status: 'completed',
          lastAccessed: '1 week ago',
        },
        {
          id: '3',
          title: 'Data Structures & Algorithms',
          description: 'Essential CS concepts for interviews',
          progress: 30,
          hoursSpent: 6,
          totalHours: 20,
          status: 'in-progress',
          lastAccessed: '5 days ago',
        },
      ];

      setCourses(mockCourses);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 pb-12 px-6 max-w-6xl mx-auto">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Courses</h1>
            <p className="text-gray-600">Track your learning progress and achievements</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600">Total Courses</p>
                  <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-600">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {courses.filter((c) => c.status === 'in-progress').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {courses.filter((c) => c.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-600">Hours Learned</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {courses.reduce((acc, c) => acc + c.hoursSpent, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course List */}
          {courses.length === 0 ? (
            <div className="border border-gray-200 rounded-lg p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Start your learning journey today!</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded border ${getStatusColor(
                            course.status
                          )}`}
                        >
                          {getStatusLabel(course.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <span>Progress: {course.progress}%</span>
                          <span>
                            {course.hoursSpent} / {course.totalHours} hours
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500">Last accessed: {course.lastAccessed}</p>
                    </div>

                    <button
                      onClick={() => navigate('/journey')}
                      className="ml-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;
