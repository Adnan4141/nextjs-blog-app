import CallToAction from "@/components/shared/CallToAction"


const About = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='scroll-m-20 text-center text-3xl md:text-4xl  font-extrabold tracking-tight text-balance my-7'>
            About Adnan's Blog
          </h1>
          <div className='text-xl scroll-m-20 font-semibold tracking-tight dark:text-gray-200 text-gray-700 flex flex-col gap-6'>
            <p>
              Welcome to Adnan's Blog! This blog was created by Adnan Hossain
              as a personal project to share his thoughts and ideas with the
              world. Adnan is a passionate developer who loves to write about
              technology, coding, and everything in between.
            </p>
  
   
            <p>
              On this blog, you'll find weekly articles and tutorials on topics
              such as web development, software engineering, and programming
              languages. Adnan is always learning and exploring new
              technologies, so be sure to check back often for new content!
            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>
          </div>
        </div>
        <div className='mt-10'>
          <CallToAction />
        </div>
      </div>
    </div>
  )
}

export default About
