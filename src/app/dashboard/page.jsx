
import DashComment from "./(comment)/DashComment";
import DashboardOverview from "./(overview)/DashbOverview";
import CreatePostPage from "./(posts)/create-post/CreatePost";

import DashPosts from "./(posts)/DashPosts";
import DashProfile from "./(profile)/DashProfile";
import DashUser from "./(users)/DashUser";


const  DashoboardContent = async({ searchParams }) => {
   const getSearchParams = await searchParams;
   const tab = getSearchParams?.tab || "profile"
   
   return (
    <div className='w-full max-w-7xl mx-auto '>
      {tab ==="overview" && <DashboardOverview/>}
      {tab ==="profile" && <DashProfile/>}
      {tab ==="users" && <DashUser/>}
      {tab ==="posts" && <DashPosts/>}
      {tab ==="create-post" && <CreatePostPage/>}
      {tab ==="comments" && <DashComment/>}
    </div>
  )
}

export default DashoboardContent
