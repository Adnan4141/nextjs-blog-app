import React from 'react'
import CreatePostForm from './createPostForm'
import { dbConnect } from '@/lib/dbConfig'
import PostModel from '@/models/PostModel';



const CreatePostPage = async() => {
   await dbConnect();
   let categories = []
   categories = await PostModel.distinct("category").lean()
 
  return (
    <div>
      <CreatePostForm distinctCategories={categories}/>
    </div>
  )
}

export default CreatePostPage
