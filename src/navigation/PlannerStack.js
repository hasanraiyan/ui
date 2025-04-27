import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlannerScreen from '../screens/Planner/PlannerScreen';
import AddTaskScreen from '../screens/Planner/AddTaskScreen';
import TaskDetailScreen from '../screens/Planner/TaskDetailScreen';
import routes from '../constants/routes';

const Stack = createNativeStackNavigator();

export default function PlannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={routes.Planner} component={PlannerScreen} options={{ title: 'Planner' }} />
      <Stack.Screen name={routes.AddTask} component={AddTaskScreen} options={{ presentation: 'modal', title: 'Add Task' }} />
      <Stack.Screen name={routes.TaskDetail} component={TaskDetailScreen} options={{ title: 'Task Details' }} />
    </Stack.Navigator>
  );
}