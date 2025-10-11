/* eslint-disable @typescript-eslint/no-explicit-any */
// filepath: c:\Data\Project\quizzo\src\components\leaderboard\LeaderboardLayout.tsx
import LeaderboardSidebar from "./LeaderboardSidebar";
import LeaderboardContent from "./LeaderboardContent";

export default function LeaderboardLayout({
  leaderboardData,
  groupLeaderboardData,
}: {
  leaderboardData: { leaderboard: any[] };
  groupLeaderboardData: { leaderboard: any[] };
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-8 flex-1">
      <LeaderboardSidebar
        leaderboardData={leaderboardData}
        groupLeaderboardData={groupLeaderboardData}
      />
      <LeaderboardContent
        leaderboardData={leaderboardData}
        groupLeaderboardData={groupLeaderboardData}
      />
    </div>
  );
}
