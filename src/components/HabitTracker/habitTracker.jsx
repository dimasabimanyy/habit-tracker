import React, { useState, useEffect } from 'react';
import { PlusCircle, Check, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

const HabitTracker = () => {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });
  const [newHabit, setNewHabit] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const habit = {
      id: Date.now(),
      name: newHabit,
      dates: {},
      streak: 0
    };
    setHabits([...habits, habit]);
    setNewHabit('');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleHabit = (habitId, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newDates = { ...habit.dates };
        if (newDates[date]) {
          delete newDates[date];
        } else {
          newDates[date] = true;
        }
        
        // Calculate streak
        let streak = 0;
        let currentDate = new Date();
        while (newDates[currentDate.toISOString().split('T')[0]]) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return { ...habit, dates: newDates, streak };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const last7Days = getLast7Days();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Habit Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addHabit} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter a new habit..."
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center gap-2 transition-colors"
            >
              <PlusCircle size={20} />
              Add Habit
            </button>
          </form>

          {showAlert && (
            <Alert className="mb-4">
              <AlertDescription>
                New habit added successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Habit</th>
                  <th className="text-center p-2">Streak</th>
                  {last7Days.map(date => (
                    <th key={date} className="text-center p-2">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </th>
                  ))}
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {habits.map(habit => (
                  <tr key={habit.id} className="border-t">
                    <td className="p-2">{habit.name}</td>
                    <td className="text-center p-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {habit.streak} days
                      </span>
                    </td>
                    {last7Days.map(date => (
                      <td key={date} className="text-center p-2">
                        <button
                          onClick={() => toggleHabit(habit.id, date)}
                          className={`p-2 rounded-full ${
                            habit.dates[date]
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                          {habit.dates[date] ? (
                            <Check size={20} />
                          ) : (
                            <X size={20} />
                          )}
                        </button>
                      </td>
                    ))}
                    <td className="text-center p-2">
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="text-red-500 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitTracker;