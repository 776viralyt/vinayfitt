import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  MoreHorizontal,
  RotateCcw,
  Clock
} from 'lucide-react-native';
import { useColorScheme, getColors } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { WorkoutPlan, WorkoutTemplate, DayOfWeek } from '@/types/workout';
import { getClientPlans, getTemplate, savePlan } from '@/utils/storage';
import { getWeekDates } from '@/utils/workoutUtils';

interface WeeklyWorkout {
  date: string;
  dayName: string;
  dayNumber: number;
  dayShort: string;
  template: WorkoutTemplate | null;
  templateId: string | null;
  status: 'completed' | 'missed' | 'scheduled' | 'rest';
}

export default function TrainingCalendarScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = createStyles(colors);

  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WeeklyWorkout[]>([]);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);

  useEffect(() => {
    loadWeeklySchedule();
  }, []);

  const loadWeeklySchedule = async () => {
    try {
      const clientId = 'client-1'; // TODO: Get from user context
      const plans = await getClientPlans(clientId);
      
      // Find active plan for this week
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const activePlan = plans.find(plan => 
        plan.startDate <= todayString && plan.endDate >= todayString
      );

      if (activePlan) {
        setCurrentPlan(activePlan);
        
        // Generate this week's schedule
        const weekDates = getWeekDates(today);
        const weeklySchedule: WeeklyWorkout[] = [];
        
        const dayNames: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const shortDayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        
        for (let i = 0; i < 7; i++) {
          const dayName = dayNames[i];
          const date = weekDates[dayName];
          const dayNumber = new Date(date).getDate();
          const templateId = activePlan.schedule[dayName];
          
          let template = null;
          if (templateId) {
            template = await getTemplate(templateId);
          }
          
          // Determine status
          const isToday = date === todayString;
          const isPast = new Date(date) < new Date(todayString);
          let status: 'completed' | 'missed' | 'scheduled' | 'rest' = 'rest';
          
          if (templateId) {
            if (isPast) {
              status = 'missed'; // TODO: Check from workout sessions
            } else if (isToday) {
              status = 'scheduled';
            } else {
              status = 'scheduled';
            }
          }
          
          weeklySchedule.push({
            date,
            dayName: shortDayNames[i],
            dayNumber,
            dayShort: dayName.substring(0, 3).toUpperCase(),
            template,
            templateId,
            status
          });
        }
        
        setWeeklyWorkouts(weeklySchedule);
      }
    } catch (error) {
      console.error('Error loading weekly schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRearrangeToggle = () => {
    setIsRearrangeMode(!isRearrangeMode);
    if (isRearrangeMode) {
      // Save changes when exiting rearrange mode
      saveScheduleChanges();
    }
  };

  const saveScheduleChanges = async () => {
    if (!currentPlan) return;

    try {
      const updatedSchedule: { [key: string]: string | null } = {};
      const dayNames: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      weeklyWorkouts.forEach((workout, index) => {
        const dayName = dayNames[index];
        updatedSchedule[dayName] = workout.templateId;
      });

      const updatedPlan: WorkoutPlan = {
        ...currentPlan,
        schedule: updatedSchedule,
        updatedAt: new Date().toISOString(),
      };

      await savePlan(updatedPlan);
      setCurrentPlan(updatedPlan);
      Alert.alert('Success', 'Schedule updated successfully!');
    } catch (error) {
      console.error('Error saving schedule:', error);
      Alert.alert('Error', 'Failed to save schedule changes');
    }
  };

  const handleWorkoutPress = (workout: WeeklyWorkout, index: number) => {
    if (isRearrangeMode) {
      // Handle drag and drop logic
      if (draggedItem === null) {
        setDraggedItem(index);
      } else {
        // Swap workouts
        const newWorkouts = [...weeklyWorkouts];
        const draggedWorkout = newWorkouts[draggedItem];
        const targetWorkout = newWorkouts[index];
        
        // Swap the template IDs and templates
        newWorkouts[draggedItem] = {
          ...draggedWorkout,
          template: targetWorkout.template,
          templateId: targetWorkout.templateId,
          status: targetWorkout.templateId ? draggedWorkout.status : 'rest'
        };
        
        newWorkouts[index] = {
          ...targetWorkout,
          template: draggedWorkout.template,
          templateId: draggedWorkout.templateId,
          status: draggedWorkout.templateId ? targetWorkout.status : 'rest'
        };
        
        setWeeklyWorkouts(newWorkouts);
        setDraggedItem(null);
      }
    } else {
      // Navigate to workout details
      if (workout.template) {
        router.push(`/training-day/${workout.date}?templateId=${workout.template.id}`);
      }
    }
  };

  const getWorkoutStatusColor = (status: string, isDragged: boolean = false) => {
    if (isDragged) return colors.primary;
    
    switch (status) {
      case 'completed': return colors.success;
      case 'missed': return colors.error;
      case 'scheduled': return colors.primary;
      default: return colors.borderLight;
    }
  };

  const getWorkoutStatusText = (workout: WeeklyWorkout) => {
    if (!workout.template) return '';
    
    switch (workout.status) {
      case 'completed': return 'Completed';
      case 'missed': return 'Missed';
      case 'scheduled': return `${workout.template.exercises.length} exercises`;
      default: return '';
    }
  };

  const renderCalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <Text style={styles.calendarTitle}>Training</Text>
      <View style={styles.weekContainer}>
        {weeklyWorkouts.map((workout, index) => (
          <View key={index} style={styles.dayHeaderContainer}>
            <Text style={styles.dayHeaderText}>{workout.dayName}</Text>
            <View style={[
              styles.dayHeaderCircle,
              workout.template && styles.activeDayHeaderCircle,
              workout.status === 'completed' && styles.completedDayHeaderCircle,
              workout.status === 'missed' && styles.missedDayHeaderCircle
            ]}>
              <Text style={[
                styles.dayHeaderNumber,
                workout.template && styles.activeDayHeaderNumber,
                (workout.status === 'completed' || workout.status === 'missed') && styles.statusDayHeaderNumber
              ]}>
                {workout.dayNumber}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderWorkoutItem = (workout: WeeklyWorkout, index: number) => {
    const isDragged = draggedItem === index;
    const statusColor = getWorkoutStatusColor(workout.status, isDragged);
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.workoutItem,
          isDragged && styles.draggedWorkoutItem,
          !workout.template && styles.restDayItem
        ]}
        onPress={() => handleWorkoutPress(workout, index)}
        disabled={!isRearrangeMode && !workout.template}
      >
        <View style={styles.workoutItemLeft}>
          <View style={styles.workoutDateContainer}>
            <Text style={styles.workoutDayShort}>{workout.dayShort}</Text>
            <Text style={styles.workoutDayNumber}>{workout.dayNumber}</Text>
          </View>
          
          <View style={styles.workoutInfoContainer}>
            <Text style={styles.workoutName}>
              {workout.template?.name || 'Rest Day'}
            </Text>
            {workout.template && (
              <Text style={[
                styles.workoutStatus,
                { color: workout.status === 'missed' ? colors.error : colors.textSecondary }
              ]}>
                {getWorkoutStatusText(workout)}
              </Text>
            )}
          </View>
        </View>
        
        {isRearrangeMode && (
          <View style={styles.dragHandle}>
            <MoreHorizontal size={20} color={colors.textTertiary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading training schedule...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {isRearrangeMode ? 'Rearrange' : 'Training'}
        </Text>
        
        <TouchableOpacity onPress={handleRearrangeToggle} style={styles.rearrangeButton}>
          {isRearrangeMode ? (
            <Text style={styles.rearrangeButtonText}>Done</Text>
          ) : (
            <RotateCcw size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Header */}
        {!isRearrangeMode && renderCalendarHeader()}

        {/* Workout List */}
        <View style={styles.workoutsList}>
          {weeklyWorkouts.map((workout, index) => renderWorkoutItem(workout, index))}
        </View>

        {/* Instructions for rearrange mode */}
        {isRearrangeMode && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Tap on workouts to swap their positions. Tap "Done" to save changes.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  rearrangeButton: {
    padding: 4,
    minWidth: 50,
    alignItems: 'flex-end',
  },
  rearrangeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  calendarHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  calendarTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.text,
    marginBottom: 20,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayHeaderContainer: {
    alignItems: 'center',
  },
  dayHeaderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  dayHeaderCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDayHeaderCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  completedDayHeaderCircle: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  missedDayHeaderCircle: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  dayHeaderNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  activeDayHeaderNumber: {
    color: '#FFFFFF',
  },
  statusDayHeaderNumber: {
    color: '#FFFFFF',
  },
  workoutsList: {
    paddingHorizontal: 20,
  },
  workoutItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  draggedWorkoutItem: {
    backgroundColor: `${colors.primary}10`,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  restDayItem: {
    opacity: 0.6,
  },
  workoutItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutDateContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  workoutDayShort: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  workoutDayNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.text,
  },
  workoutInfoContainer: {
    flex: 1,
  },
  workoutName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  workoutStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  dragHandle: {
    padding: 8,
  },
  instructionsContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});