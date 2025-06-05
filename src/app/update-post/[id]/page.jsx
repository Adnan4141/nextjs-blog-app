import { dbConnect } from '@/lib/dbConfig';
import PostModel from '@/models/PostModel';
import React from 'react'
import UpdatePostForm from './UpdatePostForm';

const UpdatePostPage = async({params}) => {
  const {id }= await params;
  
  await dbConnect();

   const postDataDoc = await PostModel.findById(id).lean()
   const postData =  JSON.parse(JSON.stringify(postDataDoc))

   let categories = []
   categories = await PostModel.distinct("category").lean()
   
  return (
    <div>
      <UpdatePostForm postData={postData} distinctCategories={categories}/>
    </div>
  )
}

export default UpdatePostPage
