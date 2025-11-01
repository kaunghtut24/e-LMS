import React, { useState, useEffect } from 'react';
import { Crown, Medal, Award, Trophy, TrendingUp } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  points: number;
  rank: number;
  achievementsCount: number;
  streak?: number;
}

interface AchievementLeaderboardProps {
  currentUserId?: string;
  entries?: LeaderboardEntry[];
  timeFrame?: 'all' | 'monthly' | 'weekly';
  showCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: '1',
    userName: 'Alex Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    points: 12500,
    rank: 1,
    achievementsCount: 45,
    streak: 12,
  },
  {
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    points: 11200,
    rank: 2,
    achievementsCount: 42,
    streak: 8,
  },
  {
    userId: '3',
    userName: 'Mike Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    points: 10800,
    rank: 3,
    achievementsCount: 38,
    streak: 15,
  },
  {
    userId: '4',
    userName: 'Emma Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=4',
    points: 9500,
    rank: 4,
    achievementsCount: 35,
  },
  {
    userId: '5',
    userName: 'James Lee',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    points: 8900,
    rank: 5,
    achievementsCount: 32,
  },
];

export default function AchievementLeaderboard({
  currentUserId,
  entries = mockLeaderboard,
  timeFrame = 'all',
  showCurrentUser = true,
}: AchievementLeaderboardProps) {
  const [displayEntries, setDisplayEntries] = useState<LeaderboardEntry[]>(entries);

  useEffect(() => {
    // In a real app, fetch leaderboard data based on timeFrame
    // For now, just use mock data
    setDisplayEntries(entries);
  }, [entries, timeFrame]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankStyles = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'bg-primary/10 border-primary';
    }
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-card';
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
        </div>
        <select
          value={timeFrame}
          onChange={(e) => {/* Handle timeframe change */}}
          className="px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="all">All Time</option>
          <option value="monthly">This Month</option>
          <option value="weekly">This Week</option>
        </select>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {displayEntries.slice(0, 3).map((entry) => {
          const isCurrentUser = entry.userId === currentUserId;
          return (
            <div
              key={entry.userId}
              className={`relative rounded-lg p-4 text-center border-2 transition-all ${
                getRankStyles(entry.rank, isCurrentUser)
              } ${entry.rank === 1 ? 'order-2' : entry.rank === 2 ? 'order-1' : 'order-3'}`}
            >
              {/* Rank Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-background rounded-full p-2 shadow-md">
                  {getRankIcon(entry.rank)}
                </div>
              </div>

              {/* Avatar */}
              <div className="mt-4">
                <Avatar className="w-20 h-20 mx-auto ring-4 ring-background">
                  <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                  <AvatarFallback className="text-2xl">
                    {entry.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name */}
              <h3 className="font-semibold text-foreground mt-3">{entry.userName}</h3>

              {/* Points */}
              <div className="mt-2">
                <p className="text-2xl font-bold text-primary">
                  {entry.points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>

              {/* Achievements Count */}
              <div className="flex items-center justify-center gap-1 mt-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {entry.achievementsCount} achievements
                </span>
              </div>

              {/* Current User Indicator */}
              {isCurrentUser && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    You
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full List */}
      <div className="space-y-2">
        {displayEntries.slice(3).map((entry, index) => {
          const isCurrentUser = entry.userId === currentUserId;
          const actualRank = index + 4;

          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                getRankStyles(actualRank, isCurrentUser)
              } ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-lg font-bold text-muted-foreground">
                  {actualRank}
                </span>
              </div>

              {/* Avatar */}
              <Avatar className="w-12 h-12">
                <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                <AvatarFallback>{entry.userName.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground truncate">
                    {entry.userName}
                  </h4>
                  {isCurrentUser && (
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {entry.achievementsCount} achievements
                  </span>
                  {entry.streak && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {entry.streak} day streak
                    </span>
                  )}
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {entry.points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
        Updated just now • Showing top 20 users
      </div>
    </div>
  );
}
