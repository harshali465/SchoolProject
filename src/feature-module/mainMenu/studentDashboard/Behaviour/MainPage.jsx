import React from 'react'
import DashboardHead from './DashboardHead'
import PointsReceived from './PointsReceived'
import PointsGiven from './PointsGiven'
import StudentLeaderboard from './StudentLeaderboard'


const Page = () => {
  return (
      <div>
               <div className="page-wrapper">
               <div className="content">
          <DashboardHead />
          <PointsReceived />
          <PointsGiven />
          <StudentLeaderboard/>

    </div>
    </div>
    </div>
  )
}

export default Page