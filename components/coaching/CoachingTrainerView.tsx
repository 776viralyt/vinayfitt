import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Users, 
  Calendar, 
  TrendingUp,
  Clock,
  MessageSquare,
  Plus,
  Star,
  Activity,
  Search,
  Filter,
  Dumbbell,
  FileText,
  ChevronRight,
  Target,
  Award
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme, getColors } from '../../hooks/useColorScheme';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const clients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    lastWorkout: '2 days ago',
    progress: 85,
    status: 'active',
    avatar: '👩‍💼',
    nextSession: 'Today 10:00 AM',
    completedWorkouts: 24,
    totalWorkouts: 28,
  },
  {
    id: 2,
    name: 'Mike Chen',
    lastWorkout: 'Today',
    progress: 92,
    status: 'active',
    avatar: '👨‍💻',
    nextSession: 'Tomorrow 11:30 AM',
    completedWorkouts: 31,
    totalWorkouts: 32,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    lastWorkout: '1 week ago',
    progress: 45,
    status: 'inactive',
    avatar: '👩‍🎨',
    nextSession: 'Not scheduled',
    completedWorkouts: 12,
    totalWorkouts: 28,
  },
];

const upcomingSessions = [
  { id: 1, client: 'Sarah Johnson', time: '10:00 AM', type: 'Strength Training', status: 'confirmed' },
  { id: 2, client: 'Mike Chen', time: '11:30 AM', type: 'HIIT Session', status: 'pending' },
  { id: 3, client: 'Emma Wilson', time: '2:00 PM', type: 'Personal Training', status: 'confirmed' },
];

const recentActivity = [
  { id: 1, client: 'John Doe', action: 'Completed Full Body Strength', time: '30 min ago', type: 'workout' },
  { id: 2, client: 'Lisa Park', action: 'Asked about nutrition plan', time: '1 hour ago', type: 'message' },
  { id: 3, client: 'Alex Kim', action: 'Updated progress photos', time: '2 hours ago', type: 'progress' },
  { id: 4, client: 'Sarah Johnson', action: 'Completed HIIT workout', time: '3 hours ago', type: 'workout' },
];

export default function CoachingTrainerView() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = createStyles(colors);

  const [selectedTab, setSelectedTab] = useState('clients');
  const [searchQuery, setSearchQuery] = useState('');

  const handleClientPress = (client: any) => {
    // Navigate to client detail view
    router.push(`/client-detail/${client.id}`);
  };

  const handleCreatePlan = () => {
    router.push('/create-plan');
  };

  const handleCreateTemplate = () => {
    router.push('/create-template');
  };

  const handleViewTemplates = () => {
    router.push('/templates');
  };

  const handleViewPlans = () => {
    router.push('/workout-plans');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <Dumbbell size={16} color={colors.success} />;
      case 'message':
        return <MessageSquare size={16} color={colors.primary} />;
      case 'progress':
        return <TrendingUp size={16} color={colors.warning} />;
      default:
        return <Activity size={16} color={colors.textSecondary} />;
    }
  };

  const renderClientCard = (client: any) => (
    <TouchableOpacity 
      key={client.id} 
      style={styles.clientCard}
      onPress={() => handleClientPress(client)}
      activeOpacity={0.7}
    >
      <View style={styles.clientHeader}>
        <View style={styles.clientLeft}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientAvatarText}>{client.avatar}</Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{client.name}</Text>
            <Text style={styles.clientLastWorkout}>Last workout: {client.lastWorkout}</Text>
            <Text style={styles.clientNextSession}>Next: {client.nextSession}</Text>
          </View>
        </View>
        
        <View style={styles.clientRight}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: client.status === 'active' ? colors.success : colors.warning }
          ]}>
            <Text style={styles.statusText}>
              {client.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </View>
      </View>
      
      <View style={styles.clientProgress}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Workout Completion</Text>
          <Text style={styles.progressText}>
            {client.completedWorkouts}/{client.totalWorkouts} completed
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${client.progress}%`,
                  backgroundColor: client.status === 'active' ? colors.success : colors.warning
                }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>{client.progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Client Management</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'clients' && styles.activeTab]}
          onPress={() => setSelectedTab('clients')}
        >
          <Text style={[styles.tabText, selectedTab === 'clients' && styles.activeTabText]}>
            Clients
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'sessions' && styles.activeTab]}
          onPress={() => setSelectedTab('sessions')}
        >
          <Text style={[styles.tabText, selectedTab === 'sessions' && styles.activeTabText]}>
            Sessions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'activity' && styles.activeTab]}
          onPress={() => setSelectedTab('activity')}
        >
          <Text style={[styles.tabText, selectedTab === 'activity' && styles.activeTabText]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedTab === 'clients' ? (
          <>
            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Users size={20} color={colors.primary} />
                </View>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Active Clients</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.success}15` }]}>
                  <TrendingUp size={20} color={colors.success} />
                </View>
                <Text style={styles.statNumber}>92%</Text>
                <Text style={styles.statLabel}>Avg Progress</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.warning}15` }]}>
                  <Calendar size={20} color={colors.warning} />
                </View>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Today's Sessions</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={handleViewTemplates}
              >
                <Dumbbell size={20} color={colors.primary} />
                <Text style={styles.quickActionText}>Templates</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={handleViewPlans}
              >
                <Calendar size={20} color={colors.success} />
                <Text style={styles.quickActionText}>Plans</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/client-analytics')}
              >
                <TrendingUp size={20} color={colors.warning} />
                <Text style={styles.quickActionText}>Analytics</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/workout-history')}
              >
                <Activity size={20} color={colors.error} />
                <Text style={styles.quickActionText}>History</Text>
              </TouchableOpacity>
            </View>

            {/* Client List */}
            <Text style={styles.sectionTitle}>Your Clients</Text>
            {clients.map(renderClientCard)}
          </>
        ) : selectedTab === 'sessions' ? (
          <>
            {/* Today's Sessions Overview */}
            <LinearGradient
              colors={colorScheme === 'dark' ? ['#BE185D', '#BE123C'] : ['#F093FB', '#F5576C']}
              style={styles.overviewCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.overviewContent}>
                <Text style={styles.overviewLabel}>TODAY'S SESSIONS</Text>
                <Text style={styles.overviewNumber}>5/8</Text>
                <Text style={styles.overviewMessage}>3 sessions remaining</Text>
              </View>
            </LinearGradient>

            {/* Upcoming Sessions */}
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            
            {upcomingSessions.map((session) => (
              <TouchableOpacity key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionTime}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={styles.sessionTimeText}>{session.time}</Text>
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionClient}>{session.client}</Text>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <View style={[
                    styles.sessionStatusBadge,
                    { backgroundColor: session.status === 'confirmed' ? colors.success : colors.warning }
                  ]}>
                    <Text style={styles.sessionStatusText}>
                      {session.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.sessionAction}>
                  <MessageSquare size={20} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* Session Actions */}
            <View style={styles.sessionActions}>
              <TouchableOpacity style={styles.sessionActionButton}>
                <Plus size={20} color={colors.primary} />
                <Text style={styles.sessionActionText}>Schedule Session</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.sessionActionButton}>
                <Calendar size={20} color={colors.success} />
                <Text style={styles.sessionActionText}>View Calendar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Recent Activity */}
            <Text style={styles.sectionTitle}>Recent Client Activity</Text>
            
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  {getActivityIcon(activity.type)}
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityClient}>{activity.client}</Text>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))}

            {/* Activity Summary */}
            <View style={styles.activitySummary}>
              <Text style={styles.activitySummaryTitle}>Today's Activity Summary</Text>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>12</Text>
                  <Text style={styles.summaryStatLabel}>Workouts Completed</Text>
                </View>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>8</Text>
                  <Text style={styles.summaryStatLabel}>Messages Sent</Text>
                </View>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>3</Text>
                  <Text style={styles.summaryStatLabel}>Progress Updates</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePlan}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.surface,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  clientCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  clientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  clientAvatarText: {
    fontSize: 20,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  clientLastWorkout: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  clientNextSession: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.primary,
  },
  clientRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  clientProgress: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 30,
  },
  overviewCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
  },
  overviewContent: {
    alignItems: 'flex-start',
  },
  overviewLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  overviewNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  overviewMessage: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sessionCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  sessionTimeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sessionClient: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  sessionType: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 4,
  },
  sessionStatusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sessionStatusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  sessionAction: {
    padding: 8,
  },
  sessionActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  sessionActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionActionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityClient: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  activityAction: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  activitySummary: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  activitySummaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStatNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.primary,
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
});