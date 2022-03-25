/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Level from 'App/Models/Level'
import axios from 'axios'

Route.get('/', async ({auth}) => {
  if(auth.user){
    // console.log(auth.user);
    return { msg: "User is Login"}
  }
  return { msg: 'User is Logout' }
})

Route.get('register','AuthController.registerShow')
Route.get('login','AuthController.loginShow')

Route.post('register','AuthController.register')
Route.post('login','AuthController.login')
Route.get('logout','AuthController.logout')


Route.get('createlevel',async({response})=>{
  const url = 'https://opentdb.com/api.php?amount=100'
  let responseResult;
  try {
    const response = await axios.get(url);
    // console.log(response.data.results);
    responseResult = response.data.results;
  } catch (error) {
    console.log(error);
  }
  /**
   * ResponseResult is array of object 
   */
  responseResult.forEach(async (questionDetails) => {
      try {
        /**
         * If Level is exist then skip or create
         */
        const level = await Level.firstOrCreate({ name:questionDetails.difficulty},{ name:questionDetails.difficulty})

        /**
         * Using level model instance insert each  question in 'questions' DB
         */
        const question = await level.related('questions').firstOrCreate(
          { title:questionDetails.question},
          { title:questionDetails.question}
        )

        /**
         * Making Options Array to store options for each single question
         */
        const finalOptions = questionDetails.incorrect_answers.map((value)=>{
          const incorrectOption = {};
          incorrectOption['title'] = value;
          incorrectOption['isAns'] = false;
          return incorrectOption;
        });
        /**
         * Correct Ans push in finalOption Array
         */
        const correctOption = {
          title: questionDetails.correct_answer,
          isAns: true,
        }
        finalOptions.push(correctOption);
        // console.log(finalOptions);
        await question.related('options').createMany(finalOptions);
      } catch (error) {
        console.log(error);
        return response.json({
          msg: 'OOP! -> Something is wrong !!'
        });
      }
  });
  // try {
  //   const data = {
  //     'name': 'Easy'
  //   }
  //   const level = await Level.create(data);
  //   const question = await level.related('questions').create({
  //     title:'fresh',
  //   })
  
  
  //   await question.related('options').createMany([
  //     {
  //       title:'is it Alco?',
  //       isAns: false,
  //     },
  //     {
  //       title:'it it Drink?',
  //       isAns:false,
  //     },
  //     {
  //       title:'is iT water?',
  //       isAns: true,
  //     },
  //     {
  //       title:'is it Oil?',
  //       isAns: false,
  //     }
  //   ])
  // } catch (error) {
  //   console.log(error);
  //   return response.json({
  //     msg:"Something Going Wrong !!"
  //   })
  // }
  return response.json({
    results: responseResult
  });
})