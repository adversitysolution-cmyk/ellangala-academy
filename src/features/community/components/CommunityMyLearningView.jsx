import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  PlayCircle,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useCommunityAuth } from '../context/CommunityAuthContext';
import { communityService } from '../services/communityService';

export default function CommunityMyLearningView({ onReturnToFeed }) {
  const { user, token } = useCommunityAuth();
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityService.getUserLearning(token)
      .then(data => setLearningData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const courses = learningData?.enrolledCourses || user?.enrolledCourses || [];
  const stats = learningData?.stats || {
    totalCourses: courses.length,
    completedLessons: 9,
    hoursInvested: 14.5
  };

  return (
    <div className="community-learning-view">
      {/* View Header */}
      <div className="community-learning-header-card">
        <div className="community-learning-header-meta">
          <div className="community-learning-badge">
            <Sparkles size={14} color="#CA8A38" />
            <span>Personal Wisdom Journey</span>
          </div>
          <h2 className="community-learning-title">
            My Learning &amp; Mind Gym
          </h2>
          <p className="community-learning-desc">
            Welcome, <strong>{user?.name || 'Seeker'}</strong>. Continue your self-mastery courses, track completed lessons, and strengthen your mental habits.
          </p>
        </div>

        {/* Quick Progress Stats Bar */}
        <div className="community-learning-stats-row">
          <div className="community-stat-box">
            <span className="stat-number">{stats.totalCourses}</span>
            <span className="stat-label">Enrolled Programs</span>
          </div>
          <div className="community-stat-divider" />
          <div className="community-stat-box">
            <span className="stat-number">{stats.completedLessons}</span>
            <span className="stat-label">Lessons Completed</span>
          </div>
          <div className="community-stat-divider" />
          <div className="community-stat-box">
            <span className="stat-number">{stats.hoursInvested}h</span>
            <span className="stat-label">Hours Invested</span>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="community-enrolled-courses-list">
        <div className="community-section-title-row">
          <h3 className="community-subheading">Active Courses &amp; Programs</h3>
          <button
            type="button"
            className="community-btn-text-link"
            onClick={onReturnToFeed}
          >
            ← Back to Community Feed
          </button>
        </div>

        {courses.map((course) => {
          return (
            <div key={course.id || course.slug} className="community-learning-course-card">
              <div className="course-thumb-container">
                <img
                  src={course.thumbnail || '/assets/images/community/featured-bhagavad-gita.png'}
                  alt={course.title}
                  className="course-thumb-img"
                />
                <div className="course-progress-badge">
                  <span>{course.progress}% Completed</span>
                </div>
              </div>

              <div className="course-details-container">
                <div className="course-top-row">
                  <span className="course-category-tag">{course.category || 'Wisdom'}</span>
                  <span className="course-lesson-count">
                    <BookOpen size={13} />
                    <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                  </span>
                </div>

                <h4 className="course-card-title">{course.title}</h4>
                <p className="course-card-sub">{course.subtitle}</p>

                {/* Current lesson resume info */}
                {course.currentLesson && (
                  <div className="course-current-lesson-box">
                    <PlayCircle size={15} color="#CA8A38" style={{ flexShrink: 0 }} />
                    <span className="lesson-text">
                      <strong>Next Up:</strong> {course.currentLesson}
                    </span>
                  </div>
                )}

                {/* Progress bar */}
                <div className="course-progress-bar-wrap">
                  <div
                    className="course-progress-bar-fill"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <div className="course-card-footer">
                  <Link
                    to={course.targetUrl || `/programs/${course.slug}`}
                    className="course-continue-btn"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight size={15} />
                  </Link>

                  <span className="course-last-active">
                    <Clock size={12} />
                    <span>Active today</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
